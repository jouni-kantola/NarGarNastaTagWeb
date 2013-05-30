namespace NarGarNastaTag.UI.Web.Extensions
{
    public static class StringExtensions
    {
         public static string DecodeNonBreakingSpace(this string value)
         {
             return value.Replace("&nbsp;", " ");
         }
    }
}