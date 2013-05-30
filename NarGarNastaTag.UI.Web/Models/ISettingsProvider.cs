namespace NarGarNastaTag.UI.Web.Models
{
    public interface ISettingsProvider
    {
        string ApiKey { get; }
        string ApiUrl { get; }
    }
}