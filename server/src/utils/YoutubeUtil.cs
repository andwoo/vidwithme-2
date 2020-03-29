using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Text.Json;
using System;
using System.Web;
using System.Linq;

namespace VidWithMe.Utils
{
  public static class YoutubeUtil
  {
    public static async Task<YoutubeVideoDetails> GetYoutubeVideoDetails(string apiKey, string videoId)
    {
      string json = await GetUrlContents(null, $"https://www.googleapis.com/youtube/v3/videos?id={videoId}&key={apiKey}&part=snippet,contentDetails,statistics,status");
      YoutubeVideoDetails data = null;
      try
      {
        using (JsonDocument document = JsonDocument.Parse(json))
        {
          var item = document.RootElement.GetProperty("items").EnumerateArray().First();
          data = new YoutubeVideoDetails();
          data.Title = item.GetProperty("snippet").GetProperty("title").GetString();
          data.Id = item.GetProperty("id").GetString();
          data.Thumbnail = $"https://img.youtube.com/vi/{data.Id}/0.jpg";
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

  public class YoutubeVideoDetails
  {
    public string Title {get; set;}
    public string Id {get; set;}
    public string Thumbnail {get; set;}
  }
}