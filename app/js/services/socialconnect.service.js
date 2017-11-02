(function () {
    'use strict';

    angular
        .module('Blurbiz')
        .factory('SocialConnectService', Service);

        function Service($q, $uibModal, LocalStorageService, socket, $rootScope) {
		    var authorizationResult = {};

			$rootScope.oauthInitState = false;
			///////////
			//interaction with DB


			var integrations = [
				"instagram2",
				"dropbox",
				"google_drive",
				"box"];
			var connections = [
				"facebook",
				"twitter",
				"instagram",
				"pinterest", 
				"snapchat"
			];


			function getCurrConfig(arr) {
				var currConfig = {};
				currConfig["oauthio_cache"] = LocalStorageService.get('oauthio_cache');

				angular.forEach(arr, function (social) {
					var key = "oauthio_provider_" + social;
					currConfig[key] = LocalStorageService.get(key);
				});

				return currConfig;
			}


			function loadConfigFromDb(callback) {

				socket.emit('get_oauthio_config', {
					token: LocalStorageService.getToken()
				});

				socket.on('get_oauthio_config_response', function(configJson) {
					try {
						var config = angular.fromJson(configJson);

						if (config.oauthio_cache != undefined) {
							LocalStorageService.put('oauthio_cache', config.oauthio_cache);
						}

						angular.forEach(integrations, function (social) {
							var key = "oauthio_provider_" + social;
							if (config[key] != undefined) {
								LocalStorageService.put(key, config[key]);
							}
						});

						callback()
					} catch (e) {
						callback()
					}

				})
			}

			function socialCredentialPopup(social) {
	        	var deferred = $q.defer();
	        	var modalInstance = $uibModal.open({
        			animation: true,
        			templateUrl: 'templates/modals/socialCredentialModal.template.html',
        			windowTemplateUrl: 'templates/modals/shareModalWindow.template.html',
        			controller: 'CredentialsController',
        			resolve: {
        				social: function() {
        					return social;
        				}
        			}
        		});

        		modalInstance.result.then(function(msg) {
        			deferred.resolve(msg);
        		});

        		return deferred.promise;
	        }

	        function tryToGetSocialInfoFromLocalStorage(social) {
	        	var cache = LocalStorageService.get("oauthio_provider_" + social);
	        	if (!cache) return false;
	        	return JSON.parse(decodeURIComponent(cache));
	        }

			/////////////

		    return {
		        initialize: function() {
		        	// loadConfigFromDb()
					loadConfigFromDb(function () {
						//initialize OAuth.io with public key of the application
						//OAuth.initialize('cj99ACP7KboyHWQiuX5xVchrGiU');
						OAuth.initialize('66JuGU1ZWZ9qwkD352llWQAfq8c');
						//try to create an authorization result when the page loads,

						PDK.init({
				            appId: config.social.pinterest.app_id,
				            cookie: true
				        });

						authorizationResult["instagram2"] = OAuth.create("instagram");

						authorizationResult["dropbox"] = OAuth.create("dropbox");
						authorizationResult["google_drive"] = OAuth.create("google_drive");
						authorizationResult["box"] = OAuth.create("box");

						$rootScope.oauthInitState = true;
					})
		        },
		        saveConfigToDb: function() {
		        	var currConfig = getCurrConfig(integrations),
						currConfigJson = angular.toJson(currConfig);

					socket.emit('set_oauthio_config', {
						token: LocalStorageService.getToken(),
						config: currConfig
					});
		        },
		        saveConfigToTeamDb: function() {
		        	var currConfig = getCurrConfig(connections),
						currConfigJson = angular.toJson(currConfig);

					socket.emit('set_team_social_info', {
						token: LocalStorageService.getToken(),
						config: currConfig
					});
		        },
		        isReady: function(social, resultIs) {

		        	if ($rootScope.oauthInitState == true) {
						checkReady()
					}
					else {
						$rootScope.$watch('oauthInitState', function () {
							if ($rootScope.oauthInitState == true) {
								checkReady()
							}
						})
					}
		            // return this.getResult(social);

		            function checkReady() {
						if (!authorizationResult[social])
							return resultIs(false);
						//oauth's isReady is not working for box. so we use BoxApi for isready.
						if (social == 'box') { //if social is box -> check isready through our server
							socket.removeListener('check_box_ready_response');
							socket.emit('check_box_ready', {
								boxToken: authorizationResult["box"].access_token
							});
							socket.on('check_box_ready_response', function(isready) {
								return resultIs(isready);
							});
						}
						else if (social == 'instagram') {
							socket.removeListener('instagram_login_by_credential_response');
							socket.emit('instagram_login_by_credential', authorizationResult[social]);
							socket.on('instagram_login_by_credential_response', function(res) {
								return resultIs(res.loggedIn);
							});
						}
						else { //if social is not box -> use oauth method
							// authorizationResult[social].get('me').done(function(me) {
							authorizationResult[social].me().done(function(me) {
								return resultIs(me);
							}).fail(function(err) {
								return resultIs(false);
							});
						}
					}

		        },
		        isReadyForConnection: function(social, resultIs) {

		        	socket.removeListener('get_team_social_info_response');
		        	socket.emit('get_team_social_info', {
			            token: LocalStorageService.getToken()
			        });

			        socket.on('get_team_social_info_response', function(msg) {
			            if (!msg.success)
			            {
			                console.error("team social info getting failed");
			                return resultIs(false);
			            } else {
			                var config = angular.fromJson(msg.integrations_and_connections);
			                var key = "oauthio_provider_" + social;
			                if (config[key] && (config[key] != "undefined"))
			                {
			                	authorizationResult[social] = JSON.parse(decodeURIComponent(config[key]));	
			                }
			                return resultIs(!!config[key]);
			            }
			        });
		        },
		        getResult: function(social) { // now it's for team 
		        	return authorizationResult[social];
		        },
		        connectSocial: function(social) {
		            var deferred = $q.defer();

		            // debugger;

		            if (social == 'snapchat') {
		            	
		     //        	socket.emit('snapchat_authentication_request');
		     //        	socket.on('snapchat_authentication_request_response', function(res) {
		            		
							// if (!res.success) {
		     //        	 		console.log('sign in', client.username);
		     //        	 		authorizationResult[social] = session.result;
		     //        	 		deferred.resolve();
		     //        	 	} else {
		     //        	 		console.error(error);
		     //        	 		deferred.reject();
		     //        	 	}
		     //        	});
		     			socialCredentialPopup(social).then(function(msg) {
		     				if (!msg.error) {
			                    authorizationResult[social] = msg.result;
			                    LocalStorageService.put("oauthio_provider_snapchat", encodeURIComponent(JSON.stringify(msg.result)));
			                    deferred.resolve();
			                } else {
			                    //do something if there's an error
			                    console.error(msg.error);
			                    deferred.reject();
			                }
		     			});
		            }
		            else if (social == 'pinterest') {
		            	PDK.login({ scope : 'read_public, write_public' }, function(response) {
		            		debugger;
		            		if (!response || !response.session) {
				              	//  alert('Error occurred');
				              	console.error('pinterest session is not ok');
			                    deferred.reject();
				            } else {
				               	//console.log(JSON.stringify(response));
				               	authorizationResult[social] = response.session;
			                    LocalStorageService.put("oauthio_provider_pinterest", encodeURIComponent(JSON.stringify(response.session)));
			                    deferred.resolve();
				            }
		            	});
		            }
		            else if (social == 'instagram') {
		            	socialCredentialPopup(social).then(function(msg) {
		            		if (!msg.error) {
			                    authorizationResult[social] = msg.result;
			                    LocalStorageService.put("oauthio_provider_instagram", encodeURIComponent(JSON.stringify(msg.result)));
			                    deferred.resolve();
			                } else {
			                    //do something if there's an error
			                    console.error(msg.error);
			                    deferred.reject();
			                }
		            	});
		            }
		            else {
		            	if (social == 'instagram2')
		            	{
		            		social = 'instagram';
		            	}

			            OAuth.popup(social, {cache: true}, function(error, result) {
			                // cache means to execute the callback if the tokens are already present
			                
			                if (!error) {
			                	if (social == 'instagram') {
			                		social = 'instagram2';
			                	}
			                    authorizationResult[social] = result;
			                    // LocalStorageService.put(social + "_auth", result);
			                    deferred.resolve();
			                } else {
			                    //do something if there's an error
			                    console.error(error);
			                    deferred.reject();
			                }
			            });	
		            }
		            

		            return deferred.promise;
		        },
		        clearCache: function(social) {
		            OAuth.clearCache(social);
		            authorizationResult[social] = false;
		            // LocalStorageService.put(social + "_auth", false);
		        },
		        get_pinterest_boards:function(){
		           	var deferred = $q.defer();
		      	  	var result = authorizationResult["pinterest"]; 	  
		      	   	if (result && result.accessToken) {
		        	   	console.log('pinterest auth:'+result.accessToken);
			        	socket.emit('get_pinterest_boards', {
								token: LocalStorageService.getToken(),
								access_token: result.accessToken
							});
						socket.removeListener('get_pinterest_boards_response');
			        	socket.on('get_pinterest_boards_response', function(res) {	     
			        		 console.log(res);
							 if (res) 
								 deferred.resolve(res);
							 else
								 deferred.reject();	    
		             	});
		           }	             
		        	 
		           return deferred.promise;
		        },
		        create_pinterest_boards:function(name){
		        	var deferred = $q.defer();
			      	var result = authorizationResult["pinterest"]; 	  
					if (result && result.accessToken) {
						console.log('pinterest auth:'+result.accessToken);
						socket.emit('create_pinterest_boards', {
							token: LocalStorageService.getToken(),
							access_token: result.accessToken,
							name:name
						});
						socket.removeListener('create_pinterest_boards_response');
						socket.on('create_pinterest_boards_response', function(res) {	     
							console.log(res);
							if (res) 
								deferred.resolve(res);
							else
								deferred.reject();	    
						});
					}	             
			        	 
			        return deferred.promise;
		        }
		    }
		}

})();