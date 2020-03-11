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

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      if(Context.Items.ContainsKey(KEY_ROOM_ID))
      {
        UserData user = Context.Items[KEY_USER_DATA] as UserData;
        string id = Context.Items[KEY_ROOM_ID] as string;
        await SendChatMessage(user, "Left the room", id);
      }
      await base.OnDisconnectedAsync(exception);
    }

    public async Task CreateRoom(UserData user)
    {
      SetUserDataOnUser(user);
      string id = RoomID.GenerateRoomID();
      //check if already in a room and leave it
      await Groups.AddToGroupAsync(Context.ConnectionId, id);
      SetRoomIdOnUser(id);
      await Clients.Caller.JoinedRoom(id);
      await Clients.GroupExcept(id, Context.ConnectionId).ReceiveChatMessage(user, "Has created the room.");
    }

    public async Task JoinRoom(UserData user, string id)
    {
      SetUserDataOnUser(user);
      //check if already in a room and leave it
      await Groups.AddToGroupAsync(Context.ConnectionId, id);
      SetRoomIdOnUser(id);
      await Clients.Caller.JoinedRoom(id);
      await Clients.GroupExcept(id, Context.ConnectionId).ReceiveChatMessage(user, "Has joined the room.");
    }

    public async Task SendChatMessage(UserData user, string message, string id)
    {
      SetUserDataOnUser(user);
      await Clients.GroupExcept(id, Context.ConnectionId).ReceiveChatMessage(user, message);
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
      if(Context.Items.ContainsKey(KEY_ROOM_ID))
      {
        Context.Items.Remove(KEY_ROOM_ID);
      }
      Context.Items.Add(KEY_ROOM_ID, id);
    }
  }

  public interface ILobbyClient
  {
    Task JoinedRoom(string id);
    Task ReceiveChatMessage(UserData user, string message);
  }
}