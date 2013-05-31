using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Text;
using Nancy;
using NarGarNastaTag.API.Contract;
using NarGarNastaTag.UI.Web.Extensions;
using NarGarNastaTag.UI.Web.Models;
using NarGarNastaTag.UI.Web.Query;
using HttpStatusCode = Nancy.HttpStatusCode;

namespace NarGarNastaTag.UI.Web.Modules
{
    public class SitemapModule : NancyModule
    {
        private readonly ISettingsProvider _settingsProvider;

        public SitemapModule(ISettingsProvider settingsProvider) : base("/sitemap")
        {
            _settingsProvider = settingsProvider;
            Get["/static"] = _ =>
                {
                    if (!Request.Headers.IsCrawler())
                        return HttpStatusCode.NotFound;
                    return CreateResponse(GetStaticUrlsetSitemap());
                };
            Get["/routes/fromCharacter/{FromCharacter}/toCharacter/{ToCharacter}"] = parameters =>
                {
                    if (!Request.Headers.IsCrawler())
                        return HttpStatusCode.NotFound;
                    return CreateResponse(GetRouteSitemap(parameters.FromCharacter, parameters.ToCharacter));
                };
        }

        private Response CreateResponse(string sitemap)
        {
            return Response.AsText(sitemap)
                           .WithStatusCode(HttpStatusCode.OK)
                           .WithContentType(@"application/xml; charset=utf-8");
        }

        private string GetRouteSitemap(string from, string to)
        {
            var fromCharacter = char.Parse(WebUtility.UrlDecode(from).ToUpper());
            var toCharacter = char.Parse(WebUtility.UrlDecode(to).ToUpper());
            return CreateSitemap(GetRouteUrlset(fromCharacter, toCharacter));
        }

        private string GetRouteUrlset(char from, char to)
        {
            var routes = GetRoutes();
            var urlset = new StringBuilder(@"<urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9"">");

            var departureStations = routes.Where(station =>
                {
                    var beginsWith = station.Name.ToUpper().ToCharArray().First();
                    return beginsWith >= from && beginsWith <= to;
                }).ToList();

            var siteMapSize = 0;
            var urlBase = GetUrlBase();
            departureStations.ForEach(station => routes.ForEach(route =>
                {
                    if ((station.Id != route.Id) && siteMapSize < 50000)
                    {
                        urlset.AppendLine(string.Format(
                            "<url><loc>{0}/Routes/from/{1}/to/{2}</loc><changefreq>daily</changefreq></url>",
                            urlBase, station.Id, route.Id));
                        siteMapSize++;
                    }
                }
                                                     ));
            urlset.AppendLine("</urlset>");
            return urlset.ToString();
        }

        private List<Station> GetRoutes()
        {
            var apiQuery = new ApiQuery<IEnumerable<Station>>(_settingsProvider);
            return apiQuery.Query("/query/stations").ToList();
        }

        private static string CreateSitemap(string urlset)
        {
            var sitemap = new StringBuilder(@"<?xml version=""1.0"" encoding=""UTF-8""?>");
            return sitemap.Append(urlset).ToString();
        }

        private string GetStaticUrlsetSitemap()
        {
            var urlset = new StringBuilder(@"<urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9"">");
            urlset.AppendLine(string.Format("<url><loc>{0}</loc><changefreq>weekly</changefreq></url>", GetUrlBase()));
            urlset.AppendLine("</urlset>");
            return CreateSitemap(urlset.ToString());
        }

        private string GetUrlBase()
        {
            var urlBase = bool.Parse(ConfigurationManager.AppSettings["PORT_IN_SITEMAP_URLS"])
                              ? Request.Url.SiteBase
                              : Request.Url.SiteBase.Substring(0, Request.Url.SiteBase.LastIndexOf(":"));
            return urlBase;
        }
    }
}