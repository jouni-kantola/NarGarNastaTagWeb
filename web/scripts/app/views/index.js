define(['jquery', 'oompa', 'rivets', 'ajaxify'], function($, oompa, rivets, ajaxify) {
    'use strict';

    var body = document.getElementById('content');

    return {
        render: function() {
            oompa.get('http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST');
            oompa.getMany(['http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST', 'http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST']);
        }
    };
});