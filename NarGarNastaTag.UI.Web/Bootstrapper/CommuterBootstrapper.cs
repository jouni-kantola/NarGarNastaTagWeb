using System.Collections.Generic;
using System.Reflection;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Conventions;
using NarGarNastaTag.API.Contract;

namespace NarGarNastaTag.UI.Web.Bootstrapper
{
    public class CommuterBootstrapper : DefaultNancyBootstrapper
    {
        private readonly IRootPathProvider _rootPathProvider;
        private readonly IStaticContentBundler _staticContentBundler;
        private readonly IStaticContentsConventionsAppender _staticContentsConventionsAppender;

        public CommuterBootstrapper()
            : this(new CommuterRootPathProvider(), new StaticContentBundler(), new StaticContentsConventionsAppender())
        { }

        public CommuterBootstrapper(IRootPathProvider rootPathProvider, IStaticContentBundler staticContentBundler, IStaticContentsConventionsAppender staticContentsConventionsAppender)
        {
            _rootPathProvider = rootPathProvider;
            _staticContentBundler = staticContentBundler;
            _staticContentsConventionsAppender = staticContentsConventionsAppender;
        }

        protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);
            _staticContentBundler.Bundle();
        }

        protected override void ConfigureRequestContainer(Nancy.TinyIoc.TinyIoCContainer container, NancyContext context)
        {
            container.AutoRegister(new List<Assembly> { typeof (ITrainRoute).Assembly });
            base.ConfigureRequestContainer(container, context);
        }

        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);
            _staticContentsConventionsAppender.AddPaths(conventions);
        }
        protected override IRootPathProvider RootPathProvider
        {
            get { return _rootPathProvider; }
        }
        internal new Nancy.TinyIoc.TinyIoCContainer GetApplicationContainer()
        {
            return base.GetApplicationContainer();
        }
        
    }
}