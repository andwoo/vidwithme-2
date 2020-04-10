using System.Threading.Tasks;
using VidWithMe.Room;
using VidWithMe.User;

namespace VidWithMe.Hub
{
  public interface ILobbyClient
  {
    Task UserDataSet(bool success);
    Task JoinedRoom(bool success, string id);
    Task JoinedRoomMessageReceived(UserData user, string message);
    Task LeftRoomMessageReceived(UserData user, string message);
    Task ChatMessageReceived(UserData user, string message);
    Task PlaylistItemMessageReceived(UserData user, string message, PlaylistItem item);
    Task RoomStateReceived(bool success, RoomState roomState);
  }
}