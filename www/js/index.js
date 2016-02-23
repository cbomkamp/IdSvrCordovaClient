/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = function () {
    var accessToken;
    var idToken;

    return {
        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicity call 'app.receivedEvent(...);'
        onDeviceReady: function () {
            app.receivedEvent('deviceready');

            var $loginButton = $('#login button.login');
            var $logoutButton = $('#login button.logout');
            var $loginStatus = $('#login p');

            $loginButton.on('click', function () {
                api.authorize(config.oAuth).done(function (data) {
                    app.accessToken = data.access_token;
                    app.idToken = data.idToken;
                    $loginStatus.html('Access Token: ' + data.access_token);
                }).fail(function (data) {
                    $loginStatus.html(data.error);
                });
            });

            $logoutButton.on('click', function () {
                // logout
            });

            var apiButton = $('#api button');
            var apiStatus = $('#api p');

            apiButton.on('click', function () {
                apiStatus.html("access_token: " + app.accessToken);

                var xhr = new XMLHttpRequest();
                xhr.onload = function (e) {
                    if (xhr.status == 403) {
                        alert("statusText: " + xhr.statusText);
                        alert("wwwAuthenticate: " + xhr.getResponseHeader("WWW-Authenticate"));
                    }

                    apiStatus.html(xhr.response);
                };
                xhr.onerror = function () {
                    alert("status: " + xhr.status);
                    alert("statusText: " + xhr.statusText);
                    alert("wwwAuthenticate: " + xhr.getResponseHeader("WWW-Authenticate"));
                    apiStatus.html(statusText);
                };
                xhr.open("GET", config.baseApiUrl + "/identity", true);
                xhr.setRequestHeader("Authorization", "Bearer " + app.accessToken);
                xhr.send();
            });

            if (cordova.InAppBrowser == null) {
                alert("InnAppBrowser is null.  Did you add the InAppBrowser plugin?");
            } else {
                window.open = cordova.InAppBrowser.open;
            }
        },
        // Update DOM on a Received Event
        receivedEvent: function (id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        },

        accessToken: accessToken,
        idToken: idToken
    };
}();
