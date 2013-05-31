
# connect-ironcache

  IronCache session store, using [node-ironio](http://github.com/ahallock/node-ironio) for communication with cache server.

## Installation

  via npm:

      $ npm install connect-ironcache

## Example

      /**
      * Module dependencies.
      */

      var express = require('express');

      // pass the express to the connect IronCache module
      // allowing it to inherit from express.session.Store
      var IronCacheStore = require('connect-ironcache')(express);

      var app = express.createServer();

      app.use(express.favicon());

      // request logging
      app.use(express.logger());

      // required to parse the session cookie
      app.use(express.cookieParser());

      // Populates:
      // - req.session
      // - req.sessionStore
      // - req.sessionID (or req.session.id)

      app.use(express.session({
          secret: 'PumpThatIronLikeThereIsNoTomorrow',
          store: new IronCacheStore({oauthToken:"<INSERT IRONCACHE TOKEN>", projectID:"<INSERT IRONCACHE PROJECT ID>", cacheID:"<INSERT IRONCACHE CACHE>"})
      }));

      app.get('/', function(req, res){
        if (req.session.views) {
          ++req.session.views;
        } else {
          req.session.views = 1;
        }
        res.send('Viewed <strong>' + req.session.views + '</strong> times.');
      });

      app.listen(3000);
      console.log('Express app started on port 3000');
