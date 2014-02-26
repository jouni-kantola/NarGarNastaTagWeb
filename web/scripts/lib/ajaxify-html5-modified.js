define(['require', 'history'], function(require) {
    'use strict';

    (function(window, undefined) {

        // Prepare our Variables
        var History = window.History,
            document = window.document,
            $ = window.jQuery;

        // Check to see if the HTML5 History API is enabled for our Browser
        if (!History.enabled) {
            return false;
        }

        /**
         * history.getRootUrl()
         * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
         * @return {string} rootUrl
         */
        history.getRootUrl = function() {
            // Create
            var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
            if (document.location.port || false) {
                rootUrl += ':' + document.location.port;
            }
            rootUrl += '/';

            // Return
            return rootUrl;
        };

        // Wait for Document
        $(function() {
            /* Application Specific Variables */
            var contentSelector = '#content',
                $content = $(contentSelector).filter(':first'),
                contentNode = $content.get(0),
                $menu = $('#menu,#nav,nav:first,.nav:first').filter(':first'),
                activeClass = 'active selected current youarehere',
                activeSelector = '.active,.selected,.current,.youarehere',
                menuChildrenSelector = '> li,> ul > li',
                /* Application Generic Variables */
                $window = $(window),
                $body = $(document.body),
                rootUrl = history.getRootUrl(),
                scrollOptions = {
                    duration: 800,
                    easing: 'swing'
                };

            // Ensure Content
            if ($content.length === 0) {
                $content = $body;
            }

            // Internal Helper
            $.expr[':'].internal = function(obj, index, meta, stack) {
                // Prepare
                var $this = $(obj),
                    url = $this.attr('href') || '',
                    isInternalLink;

                // Check link
                isInternalLink = url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1;

                // Ignore or Keep
                return isInternalLink;
            };

            var updateView = function(url) {
                var deferred = $.Deferred();
                // Set Loading
                $body.addClass('loading');

                // Start Fade Out
                // Animating to opacity to 0 still keeps the element's height intact
                // Which prevents that annoying pop bang issue when loading in new content
                $content.fadeOut('slow');

                $.ajax({
                    url: url,
                    headers: {
                        'X-Push-State-Request': true
                    },
                    success: function(data, textStatus, jqXHR) {
                        var view = renderHtml(data, url);
                        deferred.resolve(view);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        deferred.fail(errorThrown);
                        document.location.href = url;
                        return false;
                    }
                });

                return deferred.promise();
            };

            // HTML Helper
            var documentHtml = function(html) {
                // Prepare
                var result = String(html)
                    .replace(/<\!DOCTYPE[^>]*>/i, '')
                    .replace(/<(html|head|body|title|meta|script)([\s\>])/gi, '<div class="document-$1"$2')
                    .replace(/<\/(html|head|body|title|meta|script)\>/gi, '</div>');

                // Return
                return result;
            };

            var renderHtml = function(html, url) {
                // Prepare
                var $data = $(documentHtml(html)),
                    $dataBody = $data.find('.document-body:first'),
                    $dataContent = $dataBody.find(contentSelector).filter(':first'),
                    view = $dataContent.data('view'),
                    relativeUrl = url.replace(rootUrl, ''),
                    $menuChildren, contentHtml, $scripts;

                // Fetch the scripts
                $scripts = $dataContent.find('.document-script');
                if ($scripts.length) {
                    $scripts.detach();
                }

                // Fetch the content
                contentHtml = $dataContent.html() || $data.html();
                if (!contentHtml) {
                    document.location.href = url;
                    return false;
                }

                // Update the menu
                $menuChildren = $menu.find(menuChildrenSelector);
                $menuChildren.filter(activeSelector).removeClass(activeClass);
                $menuChildren = $menuChildren.has('a[href^="' + relativeUrl + '"],a[href^="/' + relativeUrl + '"],a[href^="' + url + '"]');
                if ($menuChildren.length === 1) {
                    $menuChildren.addClass(activeClass);
                }

                // Update the content
                $content.stop(true, true);
                $content.html(contentHtml).ajaxify().fadeIn('slow'); /* you could fade in here if you'd like */

                // Update the title
                document.title = $data.find('.document-title:first').text();
                try {
                    document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
                } catch (Exception) {}

                // Add the scripts
                $scripts.each(function() {
                    var $script = $(this),
                        scriptText = $script.html(),
                        scriptNode = document.createElement('script');
                    scriptNode.appendChild(document.createTextNode(scriptText));
                    contentNode.appendChild(scriptNode);
                });

                // Complete the change
                if ($body.ScrollTo || false) {
                    $body.ScrollTo(scrollOptions);
                } /* http://balupton.com/projects/jquery-scrollto */
                $body.removeClass('loading');

                // Inform Google Analytics of the change
                if (typeof window.pageTracker !== 'undefined') {
                    window.pageTracker._trackPageview(relativeUrl);
                }

                // Inform ReInvigorate of a state change
                if (typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined') {
                    window.reinvigorate.ajax_track(url);
                    // ^ we use the full url here as that is what reinvigorate supports
                }

                return view;
            };

            // Ajaxify Helper
            $.fn.ajaxify = function() {
                // Prepare
                var $this = $(this);

                // Ajaxify
                $this.find('a:internal:not(.no-ajaxy)').click(function(event) {
                    // Prepare
                    var $this = $(this),
                        url = $this.attr('href'),
                        title = $this.attr('title') || null;

                    // Continue as normal for cmd clicks etc
                    if (event.which == 2 || event.metaKey) {
                        return true;
                    }

                    // Ajaxify this link
                    document.title = title;
                    History.pushState(null, title, url);
                    event.preventDefault();
                    return false;
                });

                // Chain
                return $this;
            };

            // Ajaxify our Internal Links
            $body.ajaxify();

            // Hook into State Changes
            $window.bind('statechange', function() {
                // Prepare Variables
                var State = History.getState(),
                    url = State.url;

                    // Update view to requested resource
                    updateView(url)
                        .then(function(viewPath) {
                            if (typeof(viewPath) === 'undefined') return;
                            require([viewPath], function(view) {
                                if (typeof(view) === 'undefined' || !view.hasOwnProperty('render')) return;
                                view.render();
                            });
                        });
            }); // end onStateChange

        }); // end onDomLoad

    })(window); // end closure
});
