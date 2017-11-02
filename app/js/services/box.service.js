
angular
    .module('Blurbiz')
    .factory('Box', BoxProvider);


  function BoxProvider ($q, $http, $window) {
        var urls = {
          authorize:"https://account.box.com/api/oauth2/authorize"
        }

        function popupSize(popupWidth, popupHeight) {
          var x0, y0, width, height, popupLeft, popupTop;

          // Metrics for the current browser window.
          x0 = $window.screenX || $window.screenLeft
          y0 = $window.screenY || $window.screenTop
          width = $window.outerWidth || $document.documentElement.clientWidth
          height = $window.outerHeight || $document.documentElement.clientHeight

          // Computed popup window metrics.
          popupLeft = Math.round(x0) + (width - popupWidth) / 2
          popupTop = Math.round(y0) + (height - popupHeight) / 2.5
          if (popupLeft < x0) { popupLeft = x0 }
          if (popupTop < y0) { popupTop = y0 }

          return 'width=' + popupWidth + ',height=' + popupHeight + ',' +
                 'left=' + popupLeft + ',top=' + popupTop + ',' +
                 'dialog=yes,dependent=yes,scrollbars=yes,location=yes';
        }



        return {
          authenticate: function () {
            console.log("boxClientId",boxClientId)
            var deferred = $q.defer()
              , authUrl = urls.authorize
                        + '?response_type=code'
                        + '&client_id=' + config.social.box.client_id

            var listener = function (event) {
              if (!event.data) {
                deferred.reject("Error");
              }
              else {
                var response = JSON.parse(event.data);
                deferred.resolve(response);
              }

              $window.removeEventListener('message', listener, false);
            }

            $window.addEventListener('message', listener, false);
            $window.open(authUrl,'_BoxOauthSigninWindow', popupSize(700, 500));

            return deferred.promise;
          }

      }


  }

