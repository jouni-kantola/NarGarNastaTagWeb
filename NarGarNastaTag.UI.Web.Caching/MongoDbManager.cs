using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using NarGarNastaTag.API.Contract;

namespace NarGarNastaTag.UI.Web.Caching
{
    public class MongoDbManager<T> where T : ITrainRoute
    {
        private readonly IMongoCollection<T> _collection;

        public static MongoDbManager<T> MongoDb(string collectionName)
        {
            try
            {
                return new MongoDbManager<T>(collectionName, new ConnectionStringSettings());
            }
            catch
            {
                return null;
            }
        }

        private MongoDbManager(string collectionName, IConnectionStringSettings settings)
        {
            var url = new MongoUrl(settings.MongoDb);
            var client = new MongoClient(url);
            var database = client.GetDatabase(url.DatabaseName);
            _collection = database.GetCollection<T>(collectionName);
        }

        public void Save(T document)
        {
            _collection.InsertOneAsync(document).Wait();
        }

        public T Find(string id)
        {
            return _collection.Find(arg => arg.Id == id).SingleOrDefaultAsync().Result;
        }
    }
}