/*!
 * connect-ironcache
 * Copyright(c) 2013 Mike Angell <mike@evulse.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.0.1';


module.exports = function(connect){

    /**
     * Connect's Store.
     */

    var Store = connect.session.Store;

    /**
     * Initialize IronCacheStore with the given `options`.
     *
     * @param {Object} options
     * @api public
     */

    function IronCacheStore(options) {
        options = options || {};
        Store.call(this, options);
        if (!options.oauthToken) {
            options.oauthToken = 'No Token Specified';
        }
        if (!options.projectID) {
            options.projectID = 'No Project ID';
        }
        if (!options.cacheID) {
            options.cacheID = 'No Cache ID';
        }

        var ironio = require('node-ironio')(options.oauthToken),
            project = ironio.projects(options.projectID);

            this.client = project.caches(options.cacheID);;

    };

    /**
     * Inherit from `Store`.
     */

    IronCacheStore.prototype.__proto__ = Store.prototype;

    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} fn
     * @api public
     */

    IronCacheStore.prototype.get = function(sid, fn) {
        this.client.get(sid, function(err, data) {
            try {
                if (!data) {
                    return fn();
                }
                fn(null, JSON.parse(data.toString()));
            } catch (err) {
                fn(err);
            }
        });

    };

    /**
     * Commit the given `sess` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Session} sess
     * @param {Function} fn
     * @api public
     */

    IronCacheStore.prototype.set = function(sid, sess, fn) {
        try {
            var maxAge = sess.cookie.maxAge
            var ttl = 'number' == typeof maxAge ? maxAge / 1000 | 0 : 86400
            var sess = JSON.stringify(sess);

            this.client.put(sid, sess, function() {
                fn && fn.apply(this, arguments);
            });
        } catch (err) {
            fn && fn(err);
        }
    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @api public
     */

    IronCacheStore.prototype.destroy = function(sid, fn) {
        this.client.del(sid, fn);
    };


    /**
     * Clear all sessions.
     *
     * @param {Function} fn
     * @api public
     */

    IronCacheStore.prototype.clear = function(fn) {
        this.client.clear(fn);
    };

    return IronCacheStore;
};
