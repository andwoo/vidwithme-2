using System;
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
    public string VideoId {get; set;}
    public string Thumbnail {get; set;}
    public string Uid {get; set;}
    public bool IsPlaying {get; set;}
    public float StartTime {get; set;}

    private Nullable<DateTime> m_StartTimeLastSet = null;

    public void ResetStartTimeTracking()
    {
      m_StartTimeLastSet = DateTime.UtcNow;
    }

    public void CalculateStartTimeCorrection()
    {
      if(IsPlaying && m_StartTimeLastSet.HasValue)
      {
        StartTime = StartTime + (Int32)(DateTime.UtcNow.Subtract(m_StartTimeLastSet.Value)).TotalSeconds;
      }
      ResetStartTimeTracking();
    }
  }
}