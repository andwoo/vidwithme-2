using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidWithMe.Room;
using VidWithMe.User;

namespace VidWithMe.Hub
{
  public class LobbyHub : Hub<ILobbyClient>
  {
    static readonly string KEY_USER_DATA = "user_data";
    static readonly string KEY_ROOM_ID = "room_id";

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      if(IsUserInRoom())
      {
        string id = Context.Items[KEY_ROOM_ID] as string;
        await LeaveRoom(id);
      }
      await base.OnDisconnectedAsync(exception);
    }

    public async Task SetUserData(UserData user)
    {
      SetUserDataOnUser(user);
      await Clients.Caller.UserDataSet(true);
    }

    public async Task CreateRoom()
    {
      await JoinRoom(RoomID.GenerateRoomID());
    }

    public async Task JoinRoom(string id)
    {
      await LeaveRoom(id);
      //check if room exists
      await Groups.AddToGroupAsync(Context.ConnectionId, id);
      SetRoomIdOnUser(id);
      await Clients.Caller.JoinedRoom(true, id);
      UserData user = Context.Items[KEY_USER_DATA] as UserData;
      await Clients.GroupExcept(id, Context.ConnectionId).ChatMessageReceived(user, "Has joined the room.");
    }

    public async Task LeaveRoom(string id)
    {
      if(IsUserInRoom())
      {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, id);
        UserData user = Context.Items[KEY_USER_DATA] as UserData;
        await SendChatMessage(user, "Left the room", id);
      }
    }

    public async Task getRoomState(string id)
    {
      PlaylistItem item = new PlaylistItem();
      item.Url = "https://www.youtube.com/watch?v=_fiKPLXYttw";

      RoomState roomState = new RoomState();
      roomState.Playlist = new List<PlaylistItem>(){item};

      //check if room exists
      await Clients.Caller.RoomStateReceived(true, roomState);
    }

    public async Task SendChatMessage(UserData user, string message, string id)
    {
      SetUserDataOnUser(user);
      await Clients.GroupExcept(id, Context.ConnectionId).ChatMessageReceived(user, message);
    }

    public void SetUserDataOnUser(UserData user)
    {
      if(Context.Items.ContainsKey(KEY_USER_DATA))
      {
        Context.Items.Remove(KEY_USER_DATA);
      }
      Context.Items.Add(KEY_USER_DATA, user);
    }

    public void SetRoomIdOnUser(string id)
    {
      if(IsUserInRoom())
      {
        Context.Items.Remove(KEY_ROOM_ID);
      }
      Context.Items.Add(KEY_ROOM_ID, id);
    }

    public bool IsUserInRoom()
    {
      return Context.Items.ContainsKey(KEY_ROOM_ID);
    }
  }

  public interface ILobbyClient
  {
    Task UserDataSet(bool success);
    Task JoinedRoom(bool success, string id);
    Task ChatMessageReceived(UserData user, string message);
    Task RoomStateReceived(bool success, RoomState roomState);
  }
}