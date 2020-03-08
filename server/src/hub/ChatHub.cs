using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
  public class ChatHub : Hub
  {
    private const int ROOM_ID_LENGTH = 5;

    public async Task SendMessage(string user, string message)
    {
      string roomId = Nanoid.Nanoid.Generate(size:ROOM_ID_LENGTH);
      await Clients.All.SendAsync("messageReceived", user, roomId + " " + message);
    }
  }
}