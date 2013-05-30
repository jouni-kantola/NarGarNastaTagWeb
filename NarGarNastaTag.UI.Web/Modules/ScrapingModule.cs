using Nancy;
using NarGarNastaTag.UI.Web.Models;

namespace NarGarNastaTag.UI.Web.Modules
{
    public class ScrapingModule : NancyModule
    {
        private readonly ISettingsProvider _settingsProvider;

        public ScrapingModule(ISettingsProvider settingsProvider) : base("/query")
        {
            _settingsProvider = settingsProvider;
            //Get["/stations"] =
            //    parameters =>
            //        {
            //            IEnumerable<IStation> stations = GetStations();
            //            return stations != null
            //                       ? Response.AsJson(stations).WithContentType(@"application/json; charset=utf-8")
            //                       : new Response().WithStatusCode(HttpStatusCode.InternalServerError);
            //        };
            //Get["/station/{StationId}"] =
            //    parameters =>
            //        {
            //            IEnumerable<IRoute> stationRoutes = GetStationRoutes(parameters.StationId);
            //            return stationRoutes != null
            //                       ? Response.AsJson(stationRoutes)
            //                       : new Response().WithStatusCode(HttpStatusCode.InternalServerError);
            //        };
            //Get["/date/{Date}/route/{TrainNo}/from/{FromId}/to/{ToId}"] =
            //    parameters =>
            //        {
            //            DateTime date = DateTime.ParseExact(parameters.Date, "yyyyMMdd", CultureInfo.InvariantCulture);
            //            IEnumerable<ITrainRoute> trainRoutes = GetTrainRoutes(date, parameters.TrainNo, parameters.FromId, parameters.ToId);
            //            return trainRoutes != null
            //                       ? Response.AsJson(trainRoutes)
            //                       : new Response().WithStatusCode(HttpStatusCode.InternalServerError);
            //        };
        }

        //private IEnumerable<IStation> GetStations()
        //{
        //    var htmlExtractor = new StationExtractor();
        //    var htmlScraper = new HtmlScraper<Station>(htmlExtractor);
        //    var url = _settingsProvider.GetAllStationsUrl();
        //    var routes = htmlScraper.Scrape(url);
        //    return routes;
        //}

        //private IEnumerable<IRoute> GetStationRoutes(string fromId)
        //{
        //    var htmlExtractor = new StationRouteExtractor(fromId);
        //    var htmlScraper = new HtmlScraper<Route>(htmlExtractor);
        //    var url = _settingsProvider.GetStationRoutesUrl(fromId);
        //    var routes = htmlScraper.Scrape(url);
        //    return routes;
        //}

        //private IEnumerable<ITrainRoute> GetTrainRoutes(DateTime date, int trainNo, string fromId, string toId)
        //{
        //    var htmlExtractor = new TrainRouteExtractor(fromId, toId, date);
        //    var htmlScraper = new HtmlScraper<TrainRoute>(htmlExtractor);
        //    var url = _settingsProvider.GetRouteUrl(date, trainNo);
        //    var routes = htmlScraper.Scrape(url);
        //    return routes;
        //}
    }
}