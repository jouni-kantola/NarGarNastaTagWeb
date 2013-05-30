using System.Text.RegularExpressions;
using Nancy;

namespace NarGarNastaTag.UI.Web.Extensions
{
    public static class NancyExtensions
    {
        public static bool IsCrawler(this RequestHeaders requestHeaders)
        {
            return Regex.IsMatch(requestHeaders.UserAgent,
                                 @"bot|crawler|baiduspider|80legs|ia_archiver|voyager|curl|wget|yahoo! slurp|mediapartners-google",
                                 RegexOptions.IgnoreCase);
        }
    }
}