namespace NarGarNastaTag.UI.Web.Bootstrapper
{
    public class StaticContentBundler : IStaticContentBundler
    {
        public void Bundle()
        {
            SquishIt.Framework.Bundle.JavaScript()
                .AddRemote("~/Scripts/jquery-1.9.1.js", "http://code.jquery.com/jquery-1.9.1.min.js")
                .AddRemote("~/Scripts/jquery.mobile-1.3.0.js", "http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.js")
                .AsNamed("jquery-with-mobile", "~/assets/js/jquery-with-mobile");

            SquishIt.Framework.Bundle.JavaScript()
                .AddRemote("~/Scripts/q.js", "http://cdnjs.cloudflare.com/ajax/libs/q.js/0.9.6/q.min.js")
                .AsNamed("q", "~/assets/js/q");

            SquishIt.Framework.Bundle.JavaScript()
                .Add("~/Scripts/jQuery.XDomainRequest.js")
                .Add("~/Scripts/q.chain.js")
                .Add("~/Scripts/App/IdRandomizer.js")
                .Add("~/Scripts/App/UrlHelper.js")
                .Add("~/Scripts/App/Logger.js")
                .Add("~/Scripts/App/Route.js")
                .Add("~/Scripts/App/StationRoutes.js")
                .Add("~/Scripts/App/YqlQueryExecutor.js")
                .Add("~/Scripts/App/CookieStoreConfiguration.js")
                .Add("~/Scripts/App/RouteToJsonParser.js")
                .Add("~/Scripts/App/RouteCollection.js")
                .Add("~/Scripts/App/CookieStore.js")
                .Add("~/Scripts/App/IoC.js")
                .Add("~/Scripts/App/commuter.js")
                .Add("~/Scripts/App/UI/Loader.js")
                .Add("~/Scripts/App/UI/HomePage.js")
                .Add("~/Scripts/App/UI/FavouritesPage.js")
                .Add("~/Scripts/App/UI/RoutesPage.js")
                .Add("~/Scripts/App/UI/TrainPage.js")
#if DEBUG
                .AsNamed("app", "~/assets/js/app");
#else
                .AsCached("app", "~/assets/js/app");
#endif

            SquishIt.Framework.Bundle.Css()
                .Add("~/Content/jquery.mobile-1.3.0-commuter.metroish-1.0.css")
                .AddRemote("~/Content/jquery.mobile.structure-1.3.0.css", "http://code.jquery.com/mobile/1.3.0/jquery.mobile.structure-1.3.0.min.css")
                .Add("~/Content/commuter.ui.modifications-1.1.css")
#if DEBUG
                .AsNamed("app-ui-css", "~/assets/css/app-ui-css");
#else
                .AsCached("app-ui-css", "~/assets/css/app-ui-css");
#endif
        }
    }
}