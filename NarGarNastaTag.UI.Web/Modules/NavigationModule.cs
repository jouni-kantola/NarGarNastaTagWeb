using System;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Nancy;
using NarGarNastaTag.API.Contract;
using NarGarNastaTag.UI.Web.Caching;
using NarGarNastaTag.UI.Web.Extensions;
using NarGarNastaTag.UI.Web.Models;
using NarGarNastaTag.UI.Web.Query;

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
                    if (string.IsNullOrWhiteSpace(parameters.FromId) || string.IsNullOrWhiteSpace(parameters.ToId))
                        return HttpStatusCode.BadRequest;
                    favouriteRoute.FromId = System.Net.WebUtility.UrlDecode(parameters.FromId).ToUpperInvariant();
                    favouriteRoute.ToId = System.Net.WebUtility.UrlDecode(parameters.ToId).ToUpperInvariant();
                    var trainRoute = GetTrainRoute(favouriteRoute);
                    if (trainRoute == null) return View["NoDirectRouteFound"];
                    dynamic extendedTrainRoute = trainRoute.ToDynamic();
                    extendedTrainRoute.FromId = parameters.FromId;
                    extendedTrainRoute.ToId = parameters.ToId;
                    return View["TrainRoutes", extendedTrainRoute];
                };
            Get["/Favourites"] = _ => View["Favourites"];
            Get["/Train"] = _ => View["Train"];
        }

        private ITrainRoute GetTrainRoute(IFavouriteRoute favouriteRoute)
        {
            var routeRepository = new RouteStopRepository();
            var cachedTrainRoute = routeRepository.Find(favouriteRoute.FromId, favouriteRoute.ToId);
            if (cachedTrainRoute != null) return cachedTrainRoute;
            var stationRoutesQuery = new ApiQuery<Route>(_settingsProvider);
            var routes = stationRoutesQuery.Query(string.Format("/query/station/{0}", favouriteRoute.FromId));
            foreach (var route in routes)
            {
                var routeQuery = new ApiQuery<TrainRoute>(_settingsProvider);
                var queryUri = string.Format("/query/date/{0}/route/{1}/from/{2}/to/{3}", route.Date, int.Parse(route.RouteNo),
                                             favouriteRoute.FromId, favouriteRoute.ToId);
                var trainRoutes = routeQuery.Query(queryUri);
                if (trainRoutes.Any())
                {
                    var trainRoute = trainRoutes.First();
                    if (!string.IsNullOrWhiteSpace(trainRoute.FromStation.StationName) &&
                        !string.IsNullOrWhiteSpace(trainRoute.ToStation.StationName))
                        routeRepository.Add(trainRoute);
                    return trainRoute;
                }
            }
            return null;
        }
    }
}