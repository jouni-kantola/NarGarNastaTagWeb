using System;
using System.Collections.Generic;
using System.Globalization;
using Nancy;
using NarGarNastaTag.API.Contract;
using NarGarNastaTag.UI.Web.Models;
using NarGarNastaTag.UI.Web.Query;

namespace NarGarNastaTag.UI.Web.Modules
{
    public class RouteQueryModule : NancyModule
    {
        private readonly ISettingsProvider _settingsProvider;

        public RouteQueryModule(ISettingsProvider settingsProvider) : base("/query")
        {
            _settingsProvider = settingsProvider;
            Get["/stations"] =
                parameters =>
                    {
                        IEnumerable<IStation> stations = GetStations();
                        return stations != null
                                   ? Response.AsJson(stations).WithContentType(@"application/json; charset=utf-8")
                                   : new Response().WithStatusCode(HttpStatusCode.InternalServerError);
                    };
            Get["/station/{StationId}"] =
                parameters =>
                    {
                        IEnumerable<IRoute> stationRoutes = GetStationRoutes(parameters.StationId);
                        return stationRoutes != null
                                   ? Response.AsJson(stationRoutes)
                                   : new Response().WithStatusCode(HttpStatusCode.InternalServerError);
                    };
            Get["/date/{Date}/route/{TrainNo}/from/{FromId}/to/{ToId}"] =
                parameters =>
                    {
                        DateTime date = DateTime.ParseExact(parameters.Date, "yyyyMMdd", CultureInfo.InvariantCulture);
                        IEnumerable<ITrainRoute> trainRoutes = GetTrainRoutes(date, parameters.TrainNo, parameters.FromId, parameters.ToId);
                        return trainRoutes != null
                                   ? Response.AsJson(trainRoutes)
                                   : new Response().WithStatusCode(HttpStatusCode.InternalServerError);
                    };
        }

        private IEnumerable<IStation> GetStations()
        {
            const string queryUri = "/query/stations";
            var apiQuery = new ApiQuery<Station>(_settingsProvider);
            return apiQuery.Query(queryUri);
        }

        private IEnumerable<IRoute> GetStationRoutes(string fromId)
        {
            const string queryUri = "/query/station/{0}";
            var apiQuery = new ApiQuery<Route>(_settingsProvider);
            return apiQuery.Query(string.Format(queryUri, fromId));
        }

        private IEnumerable<ITrainRoute> GetTrainRoutes(DateTime date, int trainNo, string fromId, string toId)
        {
            const string queryUri = "/query/date/{0}/route/{1}/from/{2}/to/{3}";
            var apiQuery = new ApiQuery<TrainRoute>(_settingsProvider);
            return apiQuery.Query(string.Format(queryUri, date.ToString("yyyyMMdd"), trainNo, fromId, toId));
        }
    }
}