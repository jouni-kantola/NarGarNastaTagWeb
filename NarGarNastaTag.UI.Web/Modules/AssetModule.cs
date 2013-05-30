using System.IO;
using System.Text;
using Nancy;
using SquishIt.Framework;

namespace NarGarNastaTag.UI.Web.Modules
{
    public class AssetModule : NancyModule
    {
        public AssetModule()
        {
            Get["/assets/js/{name}"] =
                parameters => CreateResponse(Bundle.JavaScript().RenderCached((string) parameters.name),
                                             Configuration.Instance.JavascriptMimeType);
            Get["/assets/css/{name}"] =
                parameters => CreateResponse(Bundle.Css().RenderCached((string) parameters.name),
                                             Configuration.Instance.CssMimeType);
        }

        Response CreateResponse(string content, string contentType)
        {
            return Response
                .FromStream(() => new MemoryStream(Encoding.UTF8.GetBytes(content)), contentType)
                .WithHeader("Cache-Control", "max-age=45");
        }
    }
}