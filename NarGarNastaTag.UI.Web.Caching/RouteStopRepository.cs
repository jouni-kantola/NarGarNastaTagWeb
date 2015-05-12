using System.Threading.Tasks;
using NarGarNastaTag.API.Contract;

namespace NarGarNastaTag.UI.Web.Caching
{
    public class RouteStopRepository
    {
        private const string CollectionName = "TrainRoutes";

        public void Add(TrainRoute trainRoute)
        {
            var db = MongoDbManager<TrainRoute>.MongoDb(CollectionName);
            if (db != null)
                db.Save(trainRoute);
        }

        public TrainRoute Find(string fromId, string toId)
        {
            var db = MongoDbManager<TrainRoute>.MongoDb(CollectionName);
            if (db == null) return null;
            return db.Find(string.Concat(fromId, "-", toId));
        }
    }
}