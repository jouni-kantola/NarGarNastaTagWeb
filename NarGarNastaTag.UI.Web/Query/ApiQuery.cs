using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Web;
using NarGarNastaTag.UI.Web.Models;

namespace NarGarNastaTag.UI.Web.Query
{
    public interface IApiQuery<T>
    {
        string ApiUrl { get; set; }
        string ApiKey { get; set; }
        T Query(string url);
    }

    public class ApiQuery<T> : IApiQuery<T>
    {
        public string ApiUrl { get; set; }
        public string ApiKey { get; set; }

        public ApiQuery(ISettingsProvider settingsProvider)
        {
            ApiUrl = settingsProvider.ApiUrl;
            ApiKey = settingsProvider.ApiKey;
        }

        public T Query(string url)
        {
            using (var httpClient = new HttpClient())
            {
                SetRequestHeaders(httpClient);
                var response = httpClient.GetAsync(new Uri(ApiUrl + url)).Result;
                response.EnsureSuccessStatusCode();
                using (var responseStream = response.Content.ReadAsStreamAsync().Result)
                {
                    //return (new StreamReader(responseStream)).ReadToEnd();
                    return ServiceStack.Text.JsonSerializer.DeserializeFromStream<T>(responseStream);
                }
            }
        }

        private static void SetRequestHeaders(HttpClient httpClient)
        {
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept",
                                                                 "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Encoding", "gzip,deflate,sdch");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent",
                                                                 "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.97 Safari/537.22");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Language", "sv-SE,sv;q=0.8,en-US;q=0.6,en;q=0.4");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Charset", "ISO-8859-1,utf-8;q=0.7,*;q=0.3");
        }
    }
}