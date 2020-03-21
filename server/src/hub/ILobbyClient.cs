using System.Threading.Tasks;
using VidWithMe.Room;
using VidWithMe.User;

namespace VidWithMe.Hub
{
  public interface ILobbyClient
  {
    Task UserDataSet(bool success);
    Task JoinedRoom(bool success, string id);
    Task ChatMessageReceived(UserData user, string message);
    Task RoomStateReceived(bool success, RoomState roomState);
  }
}