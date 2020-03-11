using VidWithMe.Utils;

namespace VidWithMe.Room
{
  public static class RoomID 
  {
    private const int ROOM_ID_LENGTH = 5;

    public static string GenerateRoomID()
    {
      return Nanoid.Generate(size:ROOM_ID_LENGTH);
    }
  }
}