using Moq;
using Nancy;
using Nancy.Conventions;
using NarGarNastaTag.UI.Web.Bootstrapper;
using Xunit;

namespace NarGarNastaTag.UI.Web.Tests
{
    public class CommuterBootstrapperTest
    {
        [Fact]
        public void Should_use_custom_root_path_provider_when_when_initializing_bootstrapper()
        {
            var expectedHaveBeenCalled = false;
            // Given
            var contentBundler = Mock.Of<IStaticContentBundler>();
            var staticContentsConventionsAppender = Mock.Of<IStaticContentsConventionsAppender>();
            var rootPathProvider = new Mock<CommuterRootPathProvider>();
            rootPathProvider.Setup(r => r.GetRootPath()).Callback(() => { expectedHaveBeenCalled = true; });

            var bootstrapper = new CommuterBootstrapper(rootPathProvider.Object, contentBundler, staticContentsConventionsAppender);

            // When
            bootstrapper.Initialise();

            // Then
            Assert.True(expectedHaveBeenCalled);
        }

        [Fact]
        public void Should_have_registrered_paths_for_static_content_when_initializing_bootstrapper()
        {
            var expectedHaveBeenCalled = false;

            // Given
            var contentBundler = Mock.Of<IStaticContentBundler>();
            var staticContentsConventionsAppender = new Mock<IStaticContentsConventionsAppender>(MockBehavior.Default);
            staticContentsConventionsAppender.Setup(a => a.AddPaths(It.IsAny<NancyConventions>())).Callback(() =>
                { expectedHaveBeenCalled = true; });
            var rootPathProvider = Mock.Of<IRootPathProvider>();

            var bootstrapper = new CommuterBootstrapper(rootPathProvider, contentBundler, staticContentsConventionsAppender.Object);
            
            // When
            bootstrapper.Initialise();

            // Then
            Assert.True(expectedHaveBeenCalled);
        }

        [Fact]
        public void Should_have_bundled_static_content_when_initializing_bootstrapper()
        {
            var expectedHaveBeenCalled = false;

            // Given
            var contentBundler = new Mock<IStaticContentBundler>();
            var staticContentsConventionsAppender = Mock.Of<IStaticContentsConventionsAppender>();
            contentBundler.Setup(b => b.Bundle()).Callback(() =>
                { expectedHaveBeenCalled = true; });
            var rootPathProvider = Mock.Of<IRootPathProvider>();

            var bootstrapper = new CommuterBootstrapper(rootPathProvider, contentBundler.Object, staticContentsConventionsAppender);

            // When
            bootstrapper.Initialise();

            // Then
            Assert.True(expectedHaveBeenCalled);
        }
    }
}
