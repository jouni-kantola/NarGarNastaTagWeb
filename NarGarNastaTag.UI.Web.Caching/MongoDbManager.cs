using MongoDB.Driver;

namespace NarGarNastaTag.UI.Web.Caching
{
    public class MongoDbManager<T>
    {
        private readonly MongoCollection<T> _collection;
 
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
            var server = client.GetServer();
            var database = server.GetDatabase(url.DatabaseName);
            _collection = database.GetCollection<T>(collectionName);
        }

        public void Save(T document)
        {
            _collection.Save(document);
        }

        public T Find(string id)
        {
            return _collection.FindOneByIdAs<T>(id);
        }
    }
}