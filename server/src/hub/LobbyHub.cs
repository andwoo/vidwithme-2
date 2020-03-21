using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using VidWithMe.Room;
using VidWithMe.User;

namespace VidWithMe.Hub
{
  public class LobbyHub : Hub<ILobbyClient>
  {
    static readonly string KEY_USER_DATA = "user_data";
    static readonly string KEY_ROOM_ID = "room_id";

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
      ContextUserData = user;
      await Clients.Caller.UserDataSet(true);
    }

    public async Task CreateRoom()
    {
      RoomState roomState = RoomManager.CreateRoom();

      //test code
      PlaylistItem item = new PlaylistItem();
      item.Url = "https://www.youtube.com/watch?v=_fiKPLXYttw";
      roomState.Playlist.Add(item);

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
      await Clients.GroupExcept(id, Context.ConnectionId).ChatMessageReceived(ContextUserData, "Has joined the room.");
    }

    public async Task LeaveRoom()
    {
      string id = ContextRoomId;
      RoomState roomState = RoomManager.GetRoom(id);
      if(roomState != null) {
        await SendChatMessage("Left the room"); 
        RoomManager.LeaveRoom(id);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, id);
        ContextRoomId = string.Empty;
      }
    }

    public async Task getRoomState()
    {
      RoomState roomState = RoomManager.GetRoom(ContextRoomId);
      await Clients.Caller.RoomStateReceived(roomState != null, roomState);
    }

    public async Task SendChatMessage(string message)
    {
      await Clients.Group(ContextRoomId).ChatMessageReceived(ContextUserData, message);
    }
  }
}