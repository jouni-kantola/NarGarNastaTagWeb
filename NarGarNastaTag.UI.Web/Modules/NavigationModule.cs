using Nancy;
using NarGarNastaTag.API.Contract;
using NarGarNastaTag.UI.Web.Caching;
using NarGarNastaTag.UI.Web.Models;

namespace NarGarNastaTag.UI.Web.Modules
{
    public class NavigationModule : NancyModule
    {
        private readonly ISettingsProvider _settingsProvider;

        public NavigationModule(ISettingsProvider settingsProvider, IFavouriteRoute favouriteRoute)
        {
            _settingsProvider = settingsProvider;
            Get["/"] = _ => View["Home"];
            Get["/Routes/from/{FromId}/to/{ToId}"] = parameters =>
                {
                    favouriteRoute.FromId = System.Net.WebUtility.UrlDecode(parameters.FromId);
                    favouriteRoute.ToId = System.Net.WebUtility.UrlDecode(parameters.ToId);
                    var trainRoute = GetTrainRoute(favouriteRoute);
                    return trainRoute != null ? View["TrainRoutes", trainRoute] : View["NoDirectRouteFound"];
                };
            Get["/Favourites"] = _ => View["Favourites"];
            Get["/Train"] = _ => View["Train"];
        }
        
        private ITrainRoute GetTrainRoute(IFavouriteRoute favouriteRoute)
        {
            var routeRepository = new RouteStopRepository();
            var cachedTrainRoute = routeRepository.Find(favouriteRoute.FromId, favouriteRoute.ToId);
            if (cachedTrainRoute != null) return cachedTrainRoute;
            //var stationRouteExtractor = new StationRouteExtractor(favouriteRoute.FromId);
            //var routeScraper = new HtmlScraper<Route>(stationRouteExtractor);
            //var stationRoutesUrl = _settingsProvider.GetStationRoutesUrl(favouriteRoute.FromId);
            //var routes = routeScraper.Scrape(stationRoutesUrl);
            //foreach (var route in routes)
            //{
            //    var date = DateTime.ParseExact(route.Date, "yyyyMMdd", CultureInfo.InvariantCulture);
            //    var trainRouteExtractor = new TrainRouteExtractor(favouriteRoute.FromId, favouriteRoute.ToId, date);
            //    var trainStopScraper = new HtmlScraper<TrainRoute>(trainRouteExtractor);
            //    var routeUrl = _settingsProvider.GetRouteUrl(date, int.Parse(route.RouteNo));
            //    var trainRoutes = trainStopScraper.Scrape(routeUrl);
            //    if (trainRoutes.Any())
            //    {
            //        var trainRoute = trainRoutes.First();
            //        if (!string.IsNullOrWhiteSpace(trainRoute.FromStation.StationName) &&
            //            !string.IsNullOrWhiteSpace(trainRoute.ToStation.StationName))
            //            routeRepository.Add(trainRoute);
            //        return trainRoute;
            //    }
            //}
            return null;
        }
    }
}