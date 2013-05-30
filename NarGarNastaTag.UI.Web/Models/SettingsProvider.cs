using System.Configuration;

namespace NarGarNastaTag.UI.Web.Models
{
    internal class SettingsProvider : ISettingsProvider
    {
        public string ApiKey
        {
            get { return ConfigurationManager.AppSettings["API_KEY"]; }
        }

        public string ApiUrl
        {
            get { return ConfigurationManager.AppSettings["API_URL"]; }
        }
    }
}