using System.Collections.Generic;

namespace VidWithMe.Room
{
  public class RoomState
  {
    public string Id { get; set; }
    public int UserCount { get; set; }
    public List<PlaylistItem> Playlist { get; set; }

    public RoomState()
    {
      Id = string.Empty;
      UserCount = 0;
      Playlist = new List<PlaylistItem>();
    }
  }

  public class PlaylistItem
  {
    public string Vendor {get; set;}
    public string Title {get; set;}
    public string Id {get; set;}
    public string Thumbnail {get; set;}
  }
}