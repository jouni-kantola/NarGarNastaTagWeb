using Nancy.Conventions;

namespace NarGarNastaTag.UI.Web.Bootstrapper
{
    public interface IStaticContentsConventionsAppender
    {
        void AddPaths(NancyConventions conventions);
    }
}