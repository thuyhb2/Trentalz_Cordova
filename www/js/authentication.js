(function (document, window) {
    // Login Section
    if (window.name != "homepage")
        return false;
	
    
    function validateLoginForm() {
        var user = $("#login-email").val().trim(), pass = $("#login-password").val().trim();
        if (!user) {
            $("#login-email").focus();
        } else if (!pass) {
            $("#login-password").focus();
        }
    }
    function nullify(islogin) {
        // 1 alert("islogin "+ status);
        if (islogin) {
            // Login screen
            $("#login-register").hide();
            // Menu screen
            $("#form-app").show();
        } else {
            $("#login-register").show();
            $("#form-app").hide();
        }
    }
    
    /*function registerDevice(e) {
        if (e && e.which === 13 && socket) {
            register(socket);
        }
        if (!socket) {
            showMsgLogin("Your device has to connect to internet.");
        }
    }*/
    function refreshScreen() {
        var status = CVerify && CVerify.verify();
        // 3 alert("status refreshScreen "+CVerify.verify());
        nullify(status);
        //return status;
        /*if (CVerify && CVerify.verify()) {
         nullify(true);
         } else {
         nullify(false);
         }*/
    }
    function showMsgLogin(msg) {
//        alert("Message "+ msg);
        $("#device-reject-msg p.message-copy").text(msg);
        $("#device-reject-msg").show();
    }
    $(document).ready(function () {
        var baseUrl = Config.host;
		var socket = null;
		
        function init() {
            refreshScreen();

            //socket = io(baseUrl + '/socket/auth', {autoConnect: true});
//            alert("Host: "+baseUrl);
            socket = io(baseUrl + '/socket/auth');
            socket.io.on('connect_error', function (err) {
//                alert("cauto can not connect to server: "+ JSON.stringify(err));
                console.log("cauto can not connect to server: " + JSON.stringify(err));
            });

            socket.on('disconnect', function () {
//                alert("cauto disconnect to server");
                console.log("cauto disconnected to server.");
            });

            socket.on("connect", function () {
                //console.log("cauto connected to server.");
//                alert("device: "+CStore.Local.get('userid') +', '+ device.serial)
                //Check device
                this.emit("check_device", {deviceid: device.serial, userid: CStore.Local.get('userid')});
                
            });


            socket.on("device_valid", function (data) {console.log(data)
                if (data && !data.valid) {
                    alert("Your account has been logged by another device!");
                    //Clear Local Storage
                    CStore.Local.clear();
                    //Refresh screen
                    refreshScreen();
                }
            });
            
            socket.on("debug_error", function (data) {
//                alert("6666666666666 " + JSON.stringify(data));
            });

            socket.on("auth_device_approve", function (data) {
//                alert("5555555555555 " + JSON.stringify(data));
                $("#device-reject-msg").hide();
                $("#confirmDigister").modal("hide");
                if (CVerify) {
                    CVerify.addAuth({
                        key: data.key,
                        expire: 0,
                        appid: data.appid,
                        userid: data.userid
                    });
                    // 6 alert("CVerify "+CVerify + ", "+data.appid);
                }
                if (data.appid) {
                    refreshScreen();
                }
            });

            socket.on("auth_device_reject", function (data) {
                if (data.type && data.type.toUpperCase() === "CONFIRM") {
                    $("#msg-confirm-register").text(data.msg);
                    $("#confirmDigister").modal();
                } else {
                    showMsgLogin(data.msg);
                }
            });
            
            //Login 
            $("#login-email").keydown(function(e){
				if (e && e.which === 13 && socket) {
					register(socket);
				}
				if (!socket) {
					showMsgLogin("Your device has to connect to internet.");
				}
			});
            $("#login-password").keydown(function(e){
				if (e && e.which === 13 && socket) {
					register(socket);
				}
				if (!socket) {
					showMsgLogin("Your device has to connect to internet.");
				}
			});
            
        }
		
		function register(socket, force) {
			//$("#device-reject-msg").hide();
			validateLoginForm();
//                        alert("Connection ............. ");
			var _noNetworks = [Connection.UNKNOWN, Connection.NONE];
//                        alert("socket " + socket);
			if (!socket || _noNetworks.indexOf(navigator.connection.type) > -1) {
				showMsgLogin("Your device has been disconnected to internet.");
			} else {
				var user = $("#login-email").val().trim(), pass = $("#login-password").val().trim();
//                        alert("Form Login Data: " + user + " "+ pass);
				if (socket != null && user && pass) {
					if (force === undefined) {
						force = null;
					}
					socket.emit("auth_device_register", {user: user, password: pass, device: device.serial, force: force});
				}
			}
		}
	
        init();
        //Destroy
        function destroy() {
            if (socket != null) {
                socket.close();
            }
        }

        $("#register-device").on("click", function () {
            if (socket) {
                // 7 alert("register socket ");
                register(socket);
            } else {
                showMsgLogin("Your device has to connect to internet.");
            }
        });
        $("#register-device").keypress(function (e) {
            // 8 alert("Press Key on Mobile");
            if (socket && e.keyCode == '13') {
                register(socket);
            } else {
                showMsgLogin("Your device has to connect to internet.");
            }
        });
        $("#re-register-device").on("click", function () {
            if (socket) {
                register(socket, true);
            } else {
                showMsgLogin("Your device has to connect to internet.");
            }
        });
        $(window).bind("beforeunload", function (e) {
            if (socket != null) {
                socket.close();
            }
        });
    });
})(document, window);

(function (document, window) {
    // Authentication Section
    if (window.name != "authensection")
        return false;
    var timerInter = null, t0 = 26, t = t0;
    /*var enterCode = function () {
     $(".progress.time-countdown").show();
     setTimeout(function () {
     $(".progress.time-countdown .progress-bar").width("0%");
     $('#enter-code').text(Totp.generate());
     }, 500);
     };*/
    function generateCode() {
        $('#enter-code').text(Totp.generate());
    }
    function checkAuth() {
        var flag = false;
        if (CVerify) {
            flag = CVerify.verify();
        }
        if (!flag) {
            //var host = window.location.href.substr(0, window.location.href.length - window.location.pathname.length);
            //window.location.assign(host + "/index.html");
            if (timerInter) {
                clearInterval(timerInter);
            }
            $('#enter-code').text("");
            alert("Session expired. Get back home page to login!");
        }
    }

    $(document).ready(function () {
        checkAuth();
        var authInfo = null;
        var socket = null;
        var baseUrl = Config.host;
        function activeButton(status) {
            $("#approve_btn").attr("disabled", !status);
            $("#reject_btn").attr("disabled", !status);
        }
        generateCode();
        if (timerInter) {
            clearInterval(timerInter);
        }
        timerInter = setInterval(function () {
            checkAuth();
            var epoch = Math.round(Totp.getTime() / 1000.0);
            var count = 30 - (epoch % 30);
            if (epoch % 30 == 0) {
                generateCode();
            }
            $("#timer-count-down").width(Math.round((count * 100) / 30.0) + "%");
        }, 1000);
        /*timerInter = setInterval(function(){
         $(".progress.time-countdown .progress-bar").width("100%");
         $(".progress.time-countdown").hide();
         setTimeout(function(){
         enterCode();
         }, 50);
         }, t0 * 1000);*/

        function init() {
            activeButton(false);
            socket = io(baseUrl + '/socket/auth', {autoConnect: true});

            socket.io.on('connect_error', function (err) {
                activeButton(false);
                console.log('Error connecting to server');
            });

            socket.on('disconnect', function () {
                console.log("cauto dis-connected to server.");
                activeButton(false);
            });

            socket.on("connect", function () {
                //Send message to create a room
                this.emit("auth_initial", {clientid: CStore.Local.get('userid')});
                //alert("APP ID NE" + CStore.Local.get('userid'));
                //console.log("cauto connected to server");
            });

            //Receive authentication info
            socket.on("auth_info", function (data) {
                console.log("auth_info", data);
                authInfo = data;
                activeButton(true);
            });

            socket.on("auth_disabled_app", function (data) {
                if (data.disabled) {
                    activeButton(false);
                }
            });
        }

        //Destroy
        function destroy() {
            if (socket != null) {
                socket.close();
            }
        }

        $("#approve_btn").on("click", function () {
            if (socket != null && authInfo != null) {
                socket.emit("auth_confirm", {token: authInfo.token, approved: true});
                //End 
                //socket.emit("auth_endproc", {clientid: "swadmin"});
                activeButton(false);
            }
        });

        $("#reject_btn").on("click", function () {
            if (socket != null && authInfo != null) {
                socket.emit("auth_confirm", {token: authInfo.token, approved: false});
                //End 
                //socket.emit("auth_endproc", {clientid: "swadmin"});
                activeButton(false);
            }
        });

        //Before close event
        $(window).bind("beforeunload", function (e) {
            if (socket != null) {
                socket.close();
            }
        });
        init();
    });

})(document, window);