(function(Q) {
    var promises;

    function defer(task) {
        var deferred = Q.defer();
        task(deferred);
        return deferred.promise;
    }

    function chain(tasks) {
        if (tasks.length === 0) return;
        
        if(!promises){
            promises = [];
        }

        var promise = defer(tasks.shift(0));
        promises.push(promise);

        var chainedPromises = promises.slice(0);
        Q.all(chainedPromises).then(function(result) {
            result[result.length - 1]();
        });
        
        chain(tasks);
    }
    Q.chain = chain;
})(Q);
