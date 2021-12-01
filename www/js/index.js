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
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("online", this.onOnline, false);
    },
    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        //this.validateApp();
        this.checkNetwork();
    },
    onOnline: function () {
        this.checkNetwork(true);
    },
    onOffline: function () {
        this.checkNetwork(true);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        // Enable to debug issues.
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        var notificationOpenedCallback = function (jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal
            .startInit("209ddabe-399c-443a-9ff7-77e828168f20")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();

        // Call syncHashedEmail anywhere in your app if you have the user's email.
        // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
        // window.plugins.OneSignal.syncHashedEmail(userEmail);
        window.plugins.OneSignal.getIds(function (ids) {
            console.log('getIds: ' + JSON.stringify(ids));
            //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
        });
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
    },
    checkNetwork: function (_flag) {
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        var _noNetworks = [Connection.UNKNOWN, Connection.NONE];
        if (_flag) {
            alert(states[networkState]);
        } else {
            if (_noNetworks.indexOf(networkState) > -1) {
                alert(states[networkState]);
            }
        }
    },
    validateApp: function () {
        var cciDb = window.sqlitePlugin.openDatabase({
            name: 'cauto.db',
            location: 'default'
        });
        cciDb.transaction(
            function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS cuser(name, appid, seed, expire)');
            },
            function (error) {
                cciDb.close();
                console.log("Transaction error: " + error.message);
                alert("Sqlite: Transaction error => " + err.message);
            },
            function () {
                cciDb.close();
                console.log("Populated database OK.");
                alert("Sqlite: Transaction Ok");
            }
        );

        /*********************Test-Sqlite-Database*********************/
        var insert = "INSERT INTO cuser(name, appid, seed, expire) VALUES(?,?,?,?)";
        window.CStore.Sqlite.execute(insert, ["a", "b", "c", 123],
            function (a, b) {
                alert(JSON.stringify(a) + "--" + JSON.stringify(b));
            },
            function (a, b) {
                alert(JSON.stringify(a) + "--" + JSON.stringify(b));
            }
        );
        var query = "SELECT name, appid, seed, expire FROM cuser WHERE name = ?";
        window.CStore.Sqlite.execute(query, ["a"],
            function (a, b) {
                alert(JSON.stringify(a) + "--" + JSON.stringify(b));
            },
            function (a, b) {
                alert(JSON.stringify(a) + "--" + JSON.stringify(b));
            }
        );
        /*********************Test-Sqlite-Database*********************/
    }
};

app.initialize();