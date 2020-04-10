using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using System.Linq;
using VidWithMe.Room;
using VidWithMe.User;
using VidWithMe.Utils;

namespace VidWithMe.Hub
{
  public class LobbyHub : Hub<ILobbyClient>
  {
    static readonly string KEY_USER_DATA = "user_data";
    static readonly string KEY_ROOM_ID = "room_id";
    static readonly int MAX_CHARACTERS = 12;
    static readonly int MAX_CHAT_CHARACTERS = 250;

    private readonly IConfiguration CONFIGURATION;

    public LobbyHub(IConfiguration Configuration)
    {
      CONFIGURATION = Configuration;
    }

    private UserData ContextUserData
    {
      get { return GetContextData<UserData>(KEY_USER_DATA); }
      set { SetContextData<UserData>(KEY_USER_DATA, value); }
    }

    private string ContextRoomId
    {
      get { return GetContextData<string>(KEY_ROOM_ID); }
      set { SetContextData<string>(KEY_ROOM_ID, value); }
    }

    private T GetContextData<T>(string key)
    {
      if (Context.Items.ContainsKey(key))
      {
        return (T)Context.Items[key];
      }
      return default(T);
    }

    private void SetContextData<T>(string key, T data)
    {
      if (Context.Items.ContainsKey(key))
      {
        Context.Items.Remove(key);
      }
      Context.Items.Add(key, data);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      await LeaveRoom();
      await base.OnDisconnectedAsync(exception);
    }

    public async Task SetUserData(UserData user)
    {
      if(string.IsNullOrEmpty(user.UserName) || user.UserName.Length >= MAX_CHARACTERS)
      {
        await Clients.Caller.UserDataSet(false);
      }
      else
      {
        user.UserName = user.UserName.Replace(' ', '_');
        ContextUserData = user;
        await Clients.Caller.UserDataSet(true);
      }
    }

    public async Task CreateRoom()
    {
      RoomState roomState = RoomManager.CreateRoom();
      await JoinRoom(roomState.Id);
    }

    public async Task JoinRoom(string id)
    {
      await LeaveRoom();
      if(!RoomManager.ContainsRoom(id)) {
        await Clients.Caller.JoinedRoom(false, id);
        return;
      }
      await Groups.AddToGroupAsync(Context.ConnectionId, id);
      ContextRoomId = id;
      await Clients.Caller.JoinedRoom(true, id);
      RoomManager.GetRoom(id).UserCount++;
      await Clients.GroupExcept(id, Context.ConnectionId).JoinedRoomMessageReceived(ContextUserData, "has joined");
    }

    public async Task LeaveRoom()
    {
      string id = ContextRoomId;
      RoomState roomState = RoomManager.GetRoom(id);
      if(roomState != null) {
        await Clients.GroupExcept(id, Context.ConnectionId).LeftRoomMessageReceived(ContextUserData, "has left");
        if(--RoomManager.GetRoom(id).UserCount <= 0) {
          RoomManager.LeaveRoom(id);
        }
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, id);
        ContextRoomId = string.Empty;
      }
    }

    public async Task GetRoomState()
    {
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      PlaylistItem item = roomState.Playlist.Count > 0 ? roomState.Playlist[0] : null;
      if(item != null)
      {
        item.CalculateStartTimeCorrection();
      }
      await Clients.Caller.RoomStateReceived(roomState != null, roomState);
    }

    public async Task UpdateAllRoomState()
    {
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      await Clients.Group(ContextRoomId).RoomStateReceived(roomState != null, roomState);
    }

    public async Task SendChatMessage(string message)
    {
      if(string.IsNullOrWhiteSpace(message))
      {
        return;
      }

      if(message.Length > MAX_CHAT_CHARACTERS)
      {
        message = message.Substring(0, MAX_CHAT_CHARACTERS);
        message += "...";
      }

      //check if youtube link
      string videoId = YoutubeUtil.ExtractVideoId(message);
      if(!string.IsNullOrWhiteSpace(videoId))
      {
        PlaylistItem videoData = await YoutubeUtil.GetYoutubeVideoDetails(CONFIGURATION["youtube_api_key"], videoId);
        if(videoData != null)
        {
          RoomState roomState = RoomManager.GetRoom(ContextRoomId);
          if(roomState != null) {
            videoData.StartTime = YoutubeUtil.ExtractTimeStamp(message);
            roomState.Playlist.Add(videoData);
            if(roomState.Playlist.Count == 1) {
              //first video
              videoData.IsPlaying = true;
              videoData.ResetStartTimeTracking();
            }
            await UpdateAllRoomState();
            await Clients.Group(ContextRoomId).PlaylistItemMessageReceived(ContextUserData, "added", videoData);
          }
          return;
        }
      }
      
      await Clients.Group(ContextRoomId).ChatMessageReceived(ContextUserData, message);
    }

    public async Task RemovePlaylistItem(string uid)
    {
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      if(roomState != null && !string.IsNullOrEmpty(uid))
      {
        PlaylistItem item = roomState.Playlist.FirstOrDefault(el => el.Uid == uid);
        if(item != null)
        {
          int index = roomState.Playlist.IndexOf(item);
          if(index == 0 && roomState.Playlist.Count > 1)
          {
            roomState.Playlist[1].IsPlaying = true;
          }

          roomState.Playlist.Remove(item);
          await UpdateAllRoomState();
        }
      }
    }

    public async Task PauseVideo(string uid, float seekSeconds)
    {
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      if(roomState != null && !string.IsNullOrEmpty(uid))
      {
        PlaylistItem item = roomState.Playlist.FirstOrDefault(el => el.Uid == uid);
        if(item != null)
        {
          item.StartTime = seekSeconds;
          item.IsPlaying = false;
          item.ResetStartTimeTracking();
          await UpdateAllRoomState();
        }
      }
    }

    public async Task ResumeVideo(string uid, float seekSeconds)
    {
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      if(roomState != null && !string.IsNullOrEmpty(uid))
      {
        PlaylistItem item = roomState.Playlist.FirstOrDefault(el => el.Uid == uid);
        if(item != null)
        {
          item.StartTime = seekSeconds;
          item.IsPlaying = true;
          item.ResetStartTimeTracking();
          await UpdateAllRoomState();
        }
      }
    }

    public async Task CompleteVideo(string uid)
    {
      //set the next video as is playing
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      if(roomState != null && !string.IsNullOrEmpty(uid))
      {
        if(roomState.Playlist.Count > 1)
        {
          roomState.Playlist[1].IsPlaying = true;
          roomState.Playlist[1].ResetStartTimeTracking();
        }
      }
      await RemovePlaylistItem(uid);
    }
  }
}