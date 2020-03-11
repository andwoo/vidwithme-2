using System.Collections.Generic;

namespace VidWithMe.Room
{
  public class RoomState
  {
    public List<PlaylistItem> Playlist { get; set; }
  }

  public class PlaylistItem
  {
    public string Url { get; set; }
  }
}