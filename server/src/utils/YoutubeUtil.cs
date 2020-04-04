using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Text.Json;
using System;
using System.Web;
using System.Linq;
using System.Text.RegularExpressions;
using VidWithMe.Room;

namespace VidWithMe.Utils
{
  public static class YoutubeUtil
  {
    private const int UID_LENGTH = 6;
    private static readonly Regex TIME_STAMP_REGEX = new Regex(@"^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:(\?t|\&t|&start)=(\d+))?.*", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public static async Task<PlaylistItem> GetYoutubeVideoDetails(string apiKey, string videoId)
    {
      string json = await GetUrlContents(null, $"https://www.googleapis.com/youtube/v3/videos?id={videoId}&key={apiKey}&part=snippet,contentDetails,statistics,status");
      PlaylistItem data = null;
      try
      {
        using (JsonDocument document = JsonDocument.Parse(json))
        {
          var item = document.RootElement.GetProperty("items").EnumerateArray().First();
          data = new PlaylistItem();
          data.Vendor = "youtube";
          data.Title = item.GetProperty("snippet").GetProperty("title").GetString();
          data.VideoId = item.GetProperty("id").GetString();
          data.Thumbnail = $"https://img.youtube.com/vi/{data.VideoId}/0.jpg";
          data.Uid = Nanoid.Generate(size:UID_LENGTH);
          data.StartTime = 0;
        }
      }
      catch
      {
        return null;
      }
      
      return data;
    }

    public static string ExtractVideoId(string url)
    {
      Uri uri;
      if(!Uri.TryCreate(url, UriKind.Absolute, out uri))
      {
        return string.Empty;
      }
      var query = HttpUtility.ParseQueryString(uri.Query);
      string videoId = string.Empty;

      if (query.AllKeys.Contains("v"))
      {
        return query["v"];
      }
      else
      {
        return uri.Segments.Last();
      }
    }

    public static int ExtractTimeStamp(string url)
    {
      Uri uri;
      if(Uri.TryCreate(url, UriKind.Absolute, out uri))
      {
        var query = HttpUtility.ParseQueryString(uri.Query);
        string videoId = string.Empty;

        if (query.AllKeys.Contains("t") || query.AllKeys.Contains("start"))
        {
          MatchCollection matches = TIME_STAMP_REGEX.Matches(url);
          if(matches != null && matches.Count > 0)
          {
            Match match = matches[0];
            int result = 0; 
            if(Int32.TryParse(match.Groups[match.Groups.Count - 1].Value, out result))
            {
              return result;
            }
          }
        }
      }
      return 0;
    }

    private static async Task<string> GetUrlContents(Dictionary<string, string> headers, string url)
    {
      string content = string.Empty;
      HttpWebRequest webReq = (HttpWebRequest)WebRequest.Create(url);
      webReq.ContentType = "application/json; charset=utf-8";
      if(headers != null)
      {
        foreach(var kvp in headers)
        {
          webReq.Headers.Add(kvp.Key, kvp.Value);
        }
      }

      using (WebResponse response = await webReq.GetResponseAsync())
      {
        using (Stream dataStream = response.GetResponseStream())
        {
          using (StreamReader reader = new StreamReader(dataStream))
          content = reader.ReadToEnd();
        }
      }
      return content;
    }
  }
}