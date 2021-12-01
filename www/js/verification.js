(function (Win) {
    'use strict';
    function getStore(local) {
        if (Win.CStore) {
            if (local === false) {
                return Win.CStore.Sqlite;
            }
            return Win.CStore.Local;
        }
        return null;
    }
    function extendDate(num) {
        var _date = new Date();
        if (typeof (num) === "number") {
            _date.setDate(_date.getDate() + num);
        }
        return Date.parse(_date.toUTCString());
    }
    function add(obj) {
        var _store = getStore();
        if (_store) {
            _store.clear();
            for (var i in obj) {
                if (i === "expire") {
                    obj[i] = extendDate(30);
                }
                _store.set(i, obj[i]);
            }
        }
    }
    function get(name) {
        var _store = getStore();
        if (_store) {
            return _store.get(name);
        }
        return null;
    }
    function verify() {
        var flag = false;
        var _store = getStore();
        if (_store) {
            var expire = get("expire"), current_expire = extendDate();
            if (current_expire <= expire && get("key") && get("appid")) {
                flag = true;
            }
            if (current_expire > expire) {
                _store.clear();
            }
        }
        return flag;
    }
    Win.CVerify = {
        addAuth: add,
        verify: verify
    };
})(window);