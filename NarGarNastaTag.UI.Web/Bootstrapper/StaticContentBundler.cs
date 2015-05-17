﻿namespace NarGarNastaTag.UI.Web.Bootstrapper
{
    public class StaticContentBundler : IStaticContentBundler
    {
        public void Bundle()
        {
            SquishIt.Framework.Bundle.JavaScript()
                .AddRemote("~/Scripts/vendor/jquery-1.9.1.js", "http://code.jquery.com/jquery-1.9.1.min.js")
                .AddRemote("~/Scripts/vendor/jquery.mobile-1.3.0.js", "http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.js")
                .AddRemote("~/Scripts/vendor/jQuery.XDomainRequest.js", "http://cdnjs.cloudflare.com/ajax/libs/jquery-ajaxtransport-xdomainrequest/1.0.3/jquery.xdomainrequest.min.js")
                .AsNamed("jquery-with-mobile", "~/assets/js/jquery-with-mobile");

            SquishIt.Framework.Bundle.JavaScript()
                .AddRemote("~/Scripts/vendor/q.js", "http://cdnjs.cloudflare.com/ajax/libs/q.js/0.9.6/q.min.js")
                .AsNamed("q", "~/assets/js/q");

            SquishIt.Framework.Bundle.Css()
                .Add("~/Content/jquery.mobile-1.3.0-commuter.metroish-1.0.css")
                .AddRemote("~/Content/jquery.mobile.structure-1.3.0.css", "http://code.jquery.com/mobile/1.3.0/jquery.mobile.structure-1.3.0.min.css")
                .Add("~/Content/commuter.ui.modifications-1.2.css")
#if DEBUG
                .AsNamed("app-ui-css", "~/assets/css/app-ui-css");
#else
                .AsCached("app-ui-css", "~/assets/css/app-ui-css");
#endif
        }
    }
}