var oauth = new OAuthClient(config.baseIdentityServerUrl);
var api = {
    authorize: function(oAuthConfig) {
        var deferred = $.Deferred();

        var req= oauth.createImplicitFlowRequest(oAuthConfig.client_id, oAuthConfig.redirect_uri, oAuthConfig.scope, oAuthConfig.response_type);
        // Now we need to open a window.
        var authWindow = window.open(req.url, '_blank', 'location=no,toolbar=no');

        authWindow.addEventListener('loadstart', function(e) { 
          var url= e.url;
          if (url.indexOf(options.redirect_uri + '#') !== 0) return;
          authWindow.close();
          var error = /\#error=(.+)$/.exec(url);
          if( error ) {
            deferred.reject({
              error: error[1]
            });
          } else {
            var uriFragment= url.substring( url.indexOf('#') + 1);
            var result=  oauth.parseResult(uriFragment);
            // Mitigate against CSRF attacks by checking we actually sent this request
            // We could also assert the nonce hasn't been re-used.
            if( result.state == req.state ) {
                $(".login").hide();
                $(".logout").show();

                deferred.resolve(result)
            }
            else {
              deferred.reject( {
                error: "The state received from the server did not match the one we sent."
              });
            }
          }
        }); 

        return deferred.promise();
    },
    logout: function (options) {
        var deferred = $.Deferred();

        var url = oauth.getLogoutRequestUrl();
        // Now we need to open a window.
        var authWindow = window.open(url, '_blank', 'location=no,toolbar=no');

        authWindow.addEventListener('loadstart', function (e) {
            var url = e.url;
            if (url.indexOf(options.redirect_uri + '#') !== 0) return;
            authWindow.close();
            var error = /\#error=(.+)$/.exec(url);
            if (error) {
                deferred.reject({
                    error: error[1]
                });
            } else {
                $(".login").show();
                $(".logout").hide();

                // TODO:  do something here
                var uriFragment = url.substring(url.indexOf('#') + 1);
                var result = oauth.parseResult(uriFragment);
                // Mitigate against CSRF attacks by checking we actually sent this request
                // We could also assert the nonce hasn't been re-used.
                if (result.state == req.state) {
                    deferred.resolve(result)
                }
                else {
                    deferred.reject({
                        error: "The state received from the server did not match the one we sent."
                    });
                }
            }
        });

        return deferred.promise();
    }
};