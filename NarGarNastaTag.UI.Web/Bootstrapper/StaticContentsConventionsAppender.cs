using Nancy.Conventions;

namespace NarGarNastaTag.UI.Web.Bootstrapper
{
    class StaticContentsConventionsAppender : IStaticContentsConventionsAppender
    {
        public void AddPaths(NancyConventions conventions)
        {
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("scripts"));
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("content"));
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("images"));
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddFile(@"/BingSiteAuth.xml", @"/BingSiteAuth.xml"));
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddFile(@"/robots.txt", @"/robots.txt"));
        }
    }
}