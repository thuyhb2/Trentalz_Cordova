(function (Win) {
    var storageLocal = {
        set: function (key, value) {
            Win.localStorage.setItem(key, value);
        },
        get: function (key) {
            return Win.localStorage.getItem(key);
        },
        remove: function (key) {
            Win.localStorage.removeItem(key);
        },
        clear: function () {
            Win.localStorage.clear();
        }
    };

    function openDb(name) {
        var db = null;
        if (window.sqlitePlugin) {
            db = window.sqlitePlugin.openDatabase({ name: name + '.db', location: 'default' }, function (db) {
                console.log('Open database OK: ' + JSON.stringify(db));
            }, function (error) {
                console.log('Open database ERROR: ' + JSON.stringify(error));
            });
        }
        return db;
    }
    function closeDb(db) {
        db.close(function () { }, function () { });
    }
    function deleteDb(name) {
        if (window.sqlitePlugin) {
            window.sqlitePlugin.deleteDatabase({ name: name + '.db', location: 'default' }, function () { }, function () { });
        }
    }
    var storageDb = {
        execute: function (query, values, success, error) {
            //query = "DELETE FROM customerAccounts WHERE acctNo = ?";
            //query = "SELECT firstname, lastname, acctNo FROM customerAccounts WHERE lastname = ?";
            //query = "INSERT INTO customerAccounts (firstname, lastname, acctNo) VALUES (?,?,?)";
            //query = "DELETE FROM customerAccounts WHERE acctNo = ?";
            var db = openDb("cauto");
            if (db) {
                db.transaction(
                    function (tx) {
                        tx.executeSql(query, values, success, error);
                    },
                    function (err) {
                        closeDb(db);
                        //alert("Sqlite: Transaction error => " + err.message);
                    },
                    function () {
                        closeDb(db);
                        //alert("Sqlite: Transaction Ok");
                    }
                );
            } else {
                throw new Error("Store is not available.");
                //alert("Sqlite: Store is not available.");
            }
        }
    };
    Win.CStore = {
        Local: storageLocal,
        Sqlite: storageDb
    };
})(window);