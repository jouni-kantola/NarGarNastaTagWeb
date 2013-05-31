using System.Collections.Generic;

namespace NarGarNastaTag.UI.Web.Query
{
    public interface IApiQuery<T> where T : class 
    {
        string ApiUrl { get; set; }
        string ApiKey { get; set; }
        IEnumerable<T> Query(string url);
    }
}