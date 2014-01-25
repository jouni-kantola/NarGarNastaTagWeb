require(['oompa-loompa'], function(oompa) {
    var a = oompa.get('http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST');
    var b = oompa.getMany(['http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST', 'http://nargarnastatagapi.apphb.com/query/date/20140125/route/825/from/74,U/to/74,CST']);
});