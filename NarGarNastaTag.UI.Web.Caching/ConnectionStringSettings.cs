using System.Configuration;

namespace NarGarNastaTag.UI.Web.Caching
{
    class ConnectionStringSettings : IConnectionStringSettings
    {
        public string MongoDb
        {
            get { return ConfigurationManager.AppSettings["MONGO_DB"]; }
        }
    }
}