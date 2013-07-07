using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using NarGarNastaTag.UI.Web.Models;
using ServiceStack.Text;

namespace NarGarNastaTag.UI.Web.Query
{
    public class ApiQuery<T> : IApiQuery<T> where T : class 
    {
        public string ApiUrl { get; set; }
        public string ApiKey { get; set; }

        public ApiQuery(ISettingsProvider settingsProvider)
        {
            ApiUrl = settingsProvider.ApiUrl;
            ApiKey = settingsProvider.ApiKey;
        }

        public IEnumerable<T> Query(string url)
        {
            using (var httpClient = new HttpClient(new HttpClientHandler { AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip }))
            {
                SetRequestHeaders(httpClient);
                var response = httpClient.GetAsync(new Uri(ApiUrl + url)).Result;
                response.EnsureSuccessStatusCode();
                using (var responseStream = response.Content.ReadAsStreamAsync().Result)
                {
                    return JsonSerializer.DeserializeFromStream<IEnumerable<T>>(responseStream);
                }
            }
        }

        private static void SetRequestHeaders(HttpClient httpClient)
        {
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Encoding", "gzip,deflate,sdch");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.97 Safari/537.22");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Language", "sv-SE,sv;q=0.8,en-US;q=0.6,en;q=0.4");
            httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Charset", "ISO-8859-1,utf-8;q=0.7,*;q=0.3");
        }
    }
}