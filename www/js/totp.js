(function (WIN, SHA) {
    var _sha = {
        SHA_1: "SHA-1",
        SHA_256: "SHA-256",
        SHA_512: "SHA-512"
    };
    var _totpConfig = {
        timestep: 30,
        sha: _sha.SHA_1,
        seed: "CAMHOTUACSYSHTUAPXE"
    };

    function dec2hex(s) {
        return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
    }

    function hex2dec(s) {
        return parseInt(s, 16);
    }

    function base32tohex(base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "", hex = "";

        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }

        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    }

    function leftpad(str, len, pad) {
        if (len + 1 >= str.length) {
            str = Array(len + 1 - str.length).join(pad) + str;
        }
        return str;
    }

    function getUTCTimestamp() {
        var dateTime = new Date();
        return Date.parse(dateTime.toUTCString());
    }

    function otp(seedcode, option) {
        var opt = option || {};
        if (!opt.timestep) {
            opt.timestep = 30;
        }
        if (!opt.sha) {
            opt.sha = _sha.SHA_1;
        }

        var key = base32tohex(seedcode);
        if (key.length % 2 !== 0) {
            key = leftpad(key, key.length + 1, '0');
        }
        var T0_epoch = Math.round(getUTCTimestamp() / 1000.0);
        var T_time = leftpad(dec2hex(Math.floor(T0_epoch / opt.timestep)), 16, '0');

        var shaObj = new SHA(opt.sha, "HEX");
        shaObj.setHMACKey(key, "HEX");
        shaObj.update(T_time);
        var hmac = shaObj.getHMAC("HEX");

        var offset = hex2dec(hmac.substring(hmac.length - 1));

        var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
        return (otp).substr(otp.length - 6, 6);
    }

    WIN.Totp = {
        generate: function () {
            var option = {
                timestep: _totpConfig.timestep,
                sha: _totpConfig.sha
            }, seedcode = _totpConfig.seed;
            if (localStorage.getItem("key")) {
                seedcode = localStorage.getItem("key");
            }
            return otp(seedcode, option);
        },
        getTime: function () {
            return getUTCTimestamp();
        }
    };

})(window, jsSHA);