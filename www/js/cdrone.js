(function (document, window) {
    //user for wo list
    if (window.name != "appwolist10")
        return false;
    
    $(document).ready(function () {
        var baseUrl = Config.host;
        //var _url = baseUrl + "/api/cdrone/list";
        var socket = null, nointernet = false;
        
        window.addEventListener("beforeunload", function(event) {
            if(socket != null) {
                socket.disconnect();
            }
        });
            
        function init() {
            //Initial socket
            initSocket();
            getList();
        }

        function initSocket() {
            socket = io(baseUrl + '/socket/cdrone');
            socket.io.on('connect_error', function (err) {
                if(nointernet == false) {
                    nointernet = true;
                    $.notify("c-auto not connected.", {globalPosition: 'bottom right', autoHide: false, clickToHide: false, className: 'warn-cdrone'});
                }
            });

            socket.on('disconnect', function () {
                console.log("disonnection");
                socket = null;
            });

            socket.on("connect", function () {
                nointernet = false;
                $(".notifyjs-corner").data("notifyjs", null).remove();                
                console.log("connected");
            });

            //Receive Notification
            socket.on("cdrone_notification", function (data) {
                if (data.reload && nointernet == false) {
                    getList();
                }
            })
        }

        function destroySocket() {
            if (socket != null) {
                socket.disconnect();
            }
        }

        function setData(data) {
            var content = "";

            for (var i in data) {
                content += '<div class="col-md-12 no-padding">' +
                        '<a href="javascript:void();" servicetag="' + data[i].ServiceTag + '" status="' + data[i].WOStatus +
                        '" master="'+data[i].MasterName+ '" JobID="'+data[i].Jobid +
                        '" class="list-group-item  cdrone-item list-group-border">' +
                        '<h4 class="list-group-item-heading">' + data[i].ActionID + ' [ by ' + data[i].UserID + ']</h4></a>' +
                        '<div class="col-md-12 cdrone-info">' +
                        '<p></p>' +
                        '<p>' + data[i].ServiceTag + ' [' + data[i].WOStatus + ' ' + data[i].CycleTime + ' sec]</p>' +
                        '<p>' + (data[i].MasterName || "UNKNOWN") + ' [<span class="' + (data[i].ResultStatus == "PASSED" ? "status-pass" : "status-failed") + '">' + data[i].ResultStatus + '</span>]</p>' +
                        '</div>' +
                        '</div>';
            }

            if (content == "") {
                content = '<a href="javascript:void()"class="list-group-item"><h4 class="list-group-item-heading">No data available</h4></a>'
            }

            $('#cdrone_list').empty().append(content);

            //Initial click action
            $('#cdrone_list').find(".cdrone-item").on('click', function (e) {
                e.preventDefault();
                
                if(nointernet) {
                    return;
                }
                
                $('#cdrone_list').find(".cdrone-item").removeClass("cdrone-selected");
                $(this).addClass("cdrone-selected");
                if ($(this).attr('status') == "COMPLETED") {
                    destroySocket();
                    var queryParams = "?ServiceTag=" + $(this).attr("servicetag");
                    
                    if($(this).attr('master'))
                        queryParams += "&MasterName="+$(this).attr("master");
                    if($(this).attr('JobID'))
                        queryParams += "&JobID="+$(this).attr("JobID");
                    window.location.assign("./cdronedetail.html"+queryParams);
                } else {
                    $.notify("This action is not completed.", {globalPosition: 'bottom right', className: 'info-cdrone'});
                }
            });
        }

        //Get Work Order List
        function getList() {
            var configs = {
                url: baseUrl + '/api/cdrone/wolist',
                method: "GET",
                async: false,
                dataType: "json",
                data: {},
                headers: {uid: "swadmin"},
                success: function (result) {
                    if (result.Status) {
                        setData(result.Data);
                    } else {
                        setData([]);
                    }
                },
                error: function (err) {}
            };
            $.ajax(configs);
        }
        //END 

        init();
    });
})(document, window);

(function (document, window) {
    //use for wo detal
    if(window.name != "appwodetail10")
        return;
    
    $(document).ready(function () {
            var baseUrl = Config.host;
            var currentData = {}, nointernet = false, socket=null;
            
            if(window.location.search) {
                currentData = window.location.search.replace(/([?])|([&])|([=])/ig, function(){
                    //return "";
                    if(arguments[1] == "?")
                        return "\"";
                    if(arguments[2] == "&")
                        return "\",\"";
                    if(arguments[3] == "=") 
                        return "\":\"";
                })
                
                currentData = JSON.parse("{"+currentData+"\"}");
            }
            
            window.addEventListener("beforeunload", function(event) {
                if(socket != null) {
                    socket.disconnect();
                }
            });
            
            
            function init() {
                //Initial socket
                initSocket();
                
                $("#customer").on("change", function(n, o){
                    var val = $(this).val();
                    if(val != "" && nointernet == false) {
                        getItemFG(val);
                    }
                    $("#table_content").empty();
                })
                
                $("#item_fg").on("change", function(n, o){
                    var params = {
                        mastername: $("#customer").val()+'__'+$("#item_fg").val(),
                        servicetag: currentData['ServiceTag'].trim()
                    };
                    if(params['mastername'] && params['servicetag'] && nointernet == false)
                        compare(params);
                });
                
                $("#gobacklist").click(function(e){console.log(222)
                    e.preventDefault();
                    window.location.assign("./cdronelist.html");
                });
                
                if(currentData['JobID']) {
                    currentWO(currentData['JobID']);
                }
                
                if(currentData['ServiceTag']) {
                    $(".header-text").text(currentData['ServiceTag']);
                }
                
                if(currentData['MasterName']) {
                    var master = currentData['MasterName'].split("/");
                    currentData['custid'] = master[0].trim();
                    currentData['partno'] = master[1].trim();
                    delete currentData["MasterName"];
                }
                //Get Customer
                getCustomer();
            }
            
            function initSocket() {
                socket = io(baseUrl + '/socket/cdrone');
                socket.io.on('connect_error', function (err) {
                    //c-auto not connected
                    if(nointernet == false) {
                        nointernet = true;
                        $("#customer").attr("disabled", true);
                        $("#item_fg").attr("disabled", true);
                        $.notify("c-auto not connected.", {globalPosition: 'bottom right', autoHide: false, clickToHide: false, className: 'warn-cdrone'});
                    }
                });

                socket.on('disconnect', function () {
                    console.log("disonnection");
                    socket = null;
                });

                socket.on("connect", function () {
                    nointernet = false;
                    //c-auto connected
                    $("#customer").attr("disabled", false);
                    $("#item_fg").attr("disabled", false);
                    $(".notifyjs-corner").data("notifyjs", null).remove();

                });
            }
            
            function renderResult(data) 
            {
                var content = '<tr>' +
                                '<th style="min-width:140px">HW Configuration</th>' +
                                '<th style="width:30%">Description</th>' +
                                '<th style="minWidth:70px" class="text-center">Qty</th>' +
                                '<th style="width: 30%"> Description</th> ' +
                                '<th style="min-width:70px" class="text-center">Qty</th>' +
                                '</tr>';
                if(data.HW) {
                    var rowS = 1;
                    for (var i in data.HW) {
                        rowS = data.HW[i].length;
                        for (var j = 0; j < data.HW[i].length; j++) {

                            if (j == 0) {
                                content += "<tr>" + "<td rowspan="+rowS+">"+ i +"</td >" +
                                            '<td class ="'+ (data.HW[i][j].compareDesc?" not-matched ":"")+'">'+ data.HW[i][j].desc +'</td>' +
                                            '<td class ="text-center '+ (data.HW[i][j].compareDesc?" not-matched ":"") +'">' + (data.HW[i][j].qty||"") + '</td>' +
                                            '<td rowspan='+rowS+'>'+ data.HW[i][j].descMaster +'</td>' +
                                            '<td rowspan ='+rowS+' class="text-center">'+ data.HW[i][j].qtyMaster +'</td>' +
                                            '</tr>';

                            } else {
                                content +='<tr>' +
                                '<td class ="'+(data.HW[i][j].compareDesc?" not-matched ":"")+'">'+data.HW[i][j].desc+ '</td>'+
                                '<td class ="text-center '+(data.HW[i][j].compareQty?"not-matched":"")+'">' +data.HW[i][j].qty+ '</td>'+
                                '</tr>';
                            }
                        }
                    }
                }
                
                content += '<tr>' +
                        '<th colspan="1">SW/FW Revisions</th>' +
                        '<th colspan="2"></th>' +
                        '<th colspan="2"></th>'
                        '</tr>';
                        
                if(data.FW) {
                    var row = null;
                    for(var i in data.FW){
                        for (var j = 0; j < data.FW[i].length; j++) {
                            if(j==0){
                                    content+='<tr>'+
                                            '<td rowspan='+data.FW[i].length+'>'+i+'</td>' +
                                            '<td colspan ="2" class ="'+(data.FW[i][j].compareDesc?"not-matched":"")+'">'+data.FW[i][j].desc+'</td>'+
                                            '<td colspan ="2">'+ data.FW[i][j].descMaster +'</td >'+
                                            '</tr>';
                            }else{
                                content+='<tr>'+
                                        '<td colspan ="2" class ="'+(data.FW[i][j].compareDesc?"not-matched":"")+'">'+data.FW[i][j].desc+'</td>'+
                                        '<td colspan ="2">'+ data.FW[i][j].descMaster+ '</td>'+
                                        '</tr>'
                            }
                        }

                    }
                }
                
                $("#table_content").empty().append(content);
            }
            
            function getCustomer()
            {
                //pi/cdrone/getcustomer
                var configs = {
			url: baseUrl+"/api/cdrone/getcustomer",
			method: "GET",
			async: false,
			dataType: "json",
			data: {type: "cdrone_compare"},
			success: function(result){
                            var options = "<option value=''>--Select One--</option>";
                            if(result.Status) {
                                for(var i in result.Data) {
                                    options += "<option value=" + result.Data[i].custid +
                                            ">" + result.Data[i].custid + "</option>"
                                             
                                }
                                $("#customer").append(options);
                                if(currentData['custid']) {
                                    $("#customer").val(currentData['custid']);
                                    //load item finish good
                                    getItemFG(currentData['custid']);
                                    delete currentData['custid'];
                                }
                            }
                        },
			error: function(err){}
		};
                $.ajax(configs);
            }
            
            function getItemFG(custid)
            {
                //api/cdrone/getitemfinishgood
                var configs = {
			url: baseUrl+"/api/cdrone/getitemfinishgood",
			method: "GET",
			async: false,
			dataType: "json",
			data: {type: "cdrone_compare", custid: custid},
			success: function(result){
                            //empty previous data
                            $("#item_fg").empty();
                            var options = "<option value=''>--Select One--</option>";
                            if(result.Status) {
                                for(var i in result.Data) {
                                    options += "<option value=" + result.Data[i].partno +
                                            ">" + result.Data[i].partno + "</option>"
                                             
                                }
                                $("#item_fg").append(options);
                                
                                if(currentData['partno']) {
                                    $("#item_fg").val(currentData['partno']);
                                    delete currentData['partno'];
                                }
                                    
                            }
                        },
			error: function(err){}
		};
                $.ajax(configs);
            }
            
            function compare(params) {
                params["comparemaster"] = true;
                var configs = {
			url: baseUrl+"/api/cdrone/compare",
			method: "GET",
			async: false,
			dataType: "json",
			data: params,
                        headers: {uid: "swadmin"},
			success: function(result){
                            if(result.Status) {
                                renderResult(result.Data)
                            } else {
                                $.notify(result.Msg||"Data is not found.", {globalPosition: 'bottom right', className: 'info-cdrone'});
                            }
                        },
			error: function(err){}
		};
                $.ajax(configs);
            }
            
            //Get Current Job
            function currentWO(jobid) {
                var configs = {
			url: baseUrl+"/api/cdrone/woinfo",
			method: "GET",
			async: false,
			dataType: "json",
			data: {jobid: jobid},
                        headers: {uid: "swadmin"},
			success: function(result){
                            if(result.Status) {
                                if(result.Data.HW || result.Data.FW)
                                renderResult(result.Data)
                            }else {
                                 $.notify(result.Msg||"Data is not found.", {globalPosition: 'bottom right', className: 'info-cdrone'});
                            }
                        },
			error: function(err){}
		};
                $.ajax(configs);
            }
            
            init();
        });
    
})(document, window);


(function(document, window){
    if(window.name != "cdroneinfo10")
        return;
    
    $(document).ready(function () {
            var baseUrl = Config.host;
            var  socket=null, nointernet = false;
            
            window.addEventListener("beforeunload", function(event) {
                if(socket != null) {
                    socket.disconnect();
                }
            });
            
            function init() {
                initSocket();                
                var input = $("#cdrone_id");
                input.on("focus", function(){
                    $(this).select();
                });
                input.focus();
            }
            
            function initSocket() {
                socket = io(baseUrl+'/socket/cdrone');
                socket.io.on('connect_error', function (err) {
                    console.log('Error connecting to server');
                    if(nointernet == false) {
                        nointernet = true;
                        $("#cdrone_id").attr("disabled", true);
                        $("#command").attr("disabled", true);
                        $("#goback").attr("disabled", true);
                        $.notify("c-auto not connected.", {globalPosition: 'bottom right', autoHide: false, clickToHide: false, className: 'warn-cdrone'});
                    }
                });
                
                socket.on('disconnect', function () {
                    console.log("disonnection");
                    socket = null;
                });
                
                socket.on("connect", function () {
                    console.log("connected")
                    nointernet = false;
                    $("#cdrone_id").attr("disabled", false);
                    $("#goback").attr("disabled", false);
                    $(".notifyjs-corner").data("notifyjs", null).remove();
                    loadData();
                    //c-auto connected
                    
                });
                
                //Receive Notification
                socket.on("cdrone_notification", function(data){console.log(888, data)
                    if($("#cdrone_id").val() != "") {console.log(222)
                        if(data.StatusName == "RUNNING") {
                            getInfo();
                            var msg = "This cDrone was running.";

                            if(data.UserID && data.UserID != "swadmin")
                                msg = "This cDrone ran by "+ data.UserID;

                            $.notify(msg, {globalPosition: 'bottom right', className: 'info-cdrone'});
                        } else if(data.StatusName == "COMPLETED") {
                            $.notify("This cDrone was completed.", {globalPosition: 'bottom right', className: 'info-cdrone'});
                        } else if(data.Status == "FAILED") {
                            $.notify("This cDrone was failed.", {globalPosition: 'bottom right', className: 'info-cdrone'});
                        }
                        getInfo();
                    }
                })
            }
            //Load Data
            function loadData(){
                var data = $("#cdronePage").data(data)||{};
                $("#cdrone_name").text(data.cDroneName||"");
                $("#cdrone_status").text(data.StatusName||"");
                $("#cdrone_version").text(data.cDroneVersion||"");
                $("#cdrone_hw_version").text(data.cDroneHWVersion||"");
                
                $("#cdrone_id").select();
                $("#command").attr("disabled", !data.ReadyToRun);
            }
            
            function getInfo() {
                var configs = {
			url: baseUrl + "/api/cdrone/info",
			method: "GET",
			async: false,
			dataType: "json",
			data: {
				cDroneID: $("#cdrone_id").val().replace(/[+]/gi, ":")
			},
                        headers: {uid: "swadmin"},
			success: function(result){
                            var msg = "";
                            if(result.Status) {
                                if(result.Data.Msg)
                                      msg = result.Data.Msg;
                                $("#cdronePage").data(result.Data);
                                loadData();
                                $(".cdrone-item").removeClass("hidden-cls");
                            } else {
                                msg = result.Msg;
                                $("#cdronePage").data({});
                                loadData();
                                $(".cdrone-item").addClass("hidden-cls");
                            }
                            if(msg) {
                                $.notify(msg, {globalPosition: 'bottom right', className: 'info-cdrone'});
                            }
                        },
			error: function(err){}
		};
                $.ajax(configs);
            }
            
            $("#cdrone_id").keypress(function(e){
                if(e && e.charCode==13) {
                    e.preventDefault();
                    getInfo();
                }
            });
            
            $("#goback").click(function(e) {
                e.preventDefault();
                window.location.assign("./cdronelist.html");
            });
            
            $("#command").click(function(e){
                e.preventDefault();
                var configs = {
			url: baseUrl+"/api/cdrone/runcommand",
			method: "POST",
			async: false,
			dataType: "json",
			data: {
				cDroneID: $("#cdrone_id").val().replace(/[+]/gi, ":"),
                                AppVersion: "2"
			},
                        headers: {uid: "swadmin"},
			success: function(result){
                            if(result.Status) {
                                getInfo();
                            } else {
                                $.notify(result.Msg||"An Error occur.", {globalPosition: 'bottom right', className: 'info-cdrone'});
                            }
                        },
			error: function(err){}
		};
                $.ajax(configs);
            });
            
            init();
        });
})(document, window);