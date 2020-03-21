using System.Collections.Generic;
using VidWithMe.Utils;

namespace VidWithMe.Room
{
  public static class RoomManager
  {
    private const int ROOM_ID_LENGTH = 5;
    private static Dictionary<string, RoomState> s_Rooms = new Dictionary<string, RoomState>();

    private static RoomState CreateNewRoom()
    {
      RoomState room = new RoomState();
      room.Id = Nanoid.Generate(size:ROOM_ID_LENGTH);
      return room;
    }

    public static bool ContainsRoom(string id)
    {
      return id != null ? s_Rooms.ContainsKey(id) : false;
    }

    public static RoomState CreateRoom()
    {
      RoomState room = CreateNewRoom();
      s_Rooms.Add(room.Id, room);
      return room;
    }

    public static RoomState GetRoom(string id)
    {
      return ContainsRoom(id) ? s_Rooms[id] : null;
    }

    public static void LeaveRoom(string id)
    {
      if(ContainsRoom(id)) {
        s_Rooms.Remove(id);
      }
    }
  }
}