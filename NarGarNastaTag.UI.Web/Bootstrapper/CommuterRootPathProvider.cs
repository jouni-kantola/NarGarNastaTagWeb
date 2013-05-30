using System;
using Nancy;

namespace NarGarNastaTag.UI.Web.Bootstrapper
{
    public class CommuterRootPathProvider : IRootPathProvider
    {
        public virtual string GetRootPath()
        {
            return AppDomain.CurrentDomain.BaseDirectory;
        }
    }
}