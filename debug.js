window.baseUrl = function() {
    return window.debug_root_api;
}
(function (w) {
    w.util = {}
    w.util.extend = function () {
        var data = {};
        for (var i = 0; i < arguments.length; i++) {
            var value = arguments[i];
            if(typeof value=="object"){
                for(var key in value){
                    data[key] = value[key];
                }
            }
        }
        return data;
    };
    w.util.json =function(str){
            var json = (new Function("return " + str))();
            return json;
        };
    w.util.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var _search = window.location.search
        var r = _search.substr(1).match(reg); //匹配目标参数
        if (r != null) return decodeURIComponent(r[2]);
        return null; //返回参数值
    };
    w.util.htmlEscape = function (str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

})(window);
(function (win) {
    win.goHtml = function (url){
       window.cokehttp.get(url,{},function (ex) {
           win.document.write(ex.data);
       })
    }
})(window);
(function (win){
        function getXmlhttp() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        var rNum = 0;
        function $httpRequest() {
            var __this__ = this;
            this.__use__ = false;
            this._rnum_ = rNum++;
            this.__xmlHttp__ = getXmlhttp();
            this.abort = function (){
                this.__use__ = false;
                this.__xmlHttp__.abort()
            }
            this.isUse = function () {
                return __this__.__xmlHttp__.readyState !=0 || __this__.__use__
            }

            this.onreadystatechange = function (){
                if (__this__.__xmlHttp__.readyState == 4) {
                    var result = {};
                    result.status = __this__.__xmlHttp__.status
                    result.data = __this__.__xmlHttp__.responseText
                    __this__.abort()
                    if (result.status == 200 || result.status == 204) {
                        __this__.config.success(result)
                    } else {
                        __this__.config.error(result)
                    }
                }
            }
            this.ajax = function (request) {
                __this__.config = {};
                __this__.__use__ = true;
                __this__.config.url = request.url;
                __this__.config.method = request.method;
                __this__.config.data = request.data ||[];
                __this__.config.success =  function (ex) {
                    if(!request.dataType){
                        if(request.success){
                            ex.json = function () {
                                return w.util.json(ex.data);
                            }
                            ex.text = function () {
                                return ex.data;
                            }
                            request.success(ex);
                        }
                    }else{
                        if(request.dataType=="json"){
                            if(request.success){
                                request.success(w.util.json(ex.data));
                            }
                        }
                    }
                };
                __this__.config.error = request.error|| function () {};
                if (__this__.config.method == undefined || __this__.config.method.toLowerCase() != "post") {
                    var params = [];
                    for (var key in __this__.config.data){
                        params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                    }
                    var postData = params.join('&');
                    if(__this__.config.url.indexOf("?")!=-1){
                        __this__.config.url = __this__.config.url+"&"+postData;
                    }else{
                        __this__.config.url = __this__.config.url+"?"+postData;
                    }
                    __this__.__xmlHttp__.open("GET", __this__.config.url, true)
                    __this__.__xmlHttp__.onreadystatechange = __this__.onreadystatechange;
                    __this__.__xmlHttp__.timeout = 300000
                    __this__.__xmlHttp__.send(null)
                } else {
                    __this__.__xmlHttp__.open("POST", __this__.config.url, true)
                    __this__.__xmlHttp__.onreadystatechange = __this__.onreadystatechange;
                    __this__.__xmlHttp__.timeout = 300000
                    if(typeof __this__.config.data == 'object'){
                        __this__.__xmlHttp__.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                        __this__.__xmlHttp__.send(JSON.stringify(__this__.config.data))
                    }else{
                        __this__.__xmlHttp__.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                        __this__.__xmlHttp__.send(__this__.config.data)
                    }
                }
            }
            this.get = function (url, data, successCall, errorCall) {
                __this__.ajax({
                    url: url,
                    method: "GET",
                    data: data,
                    success: successCall,
                    error: errorCall
                });
            };
            this.num = function (){
                return __this__._rnum_;
            };
            this.post = function (url, data, successCall, errorCall) {
                __this__.ajax({
                    url: url,
                    method: "POST",
                    data: data,
                    success: successCall,
                    error: errorCall
                });
            }
        };
        function requestPool(){
            this._request_pool_ = new Array();
            var __this__ = this;
            this.getRequest = function (){
                for (var i=0;i<__this__._request_pool_.length;i++){
                    if(!__this__._request_pool_[i].isUse()){
                        return __this__._request_pool_[i];
                    }
                }
                var httpRequest = new $httpRequest();
                __this__._request_pool_.push(httpRequest)
                return httpRequest
            }
            this.getRequest2 = function (){
                return new $httpRequest();
            }
        };
        function Request(){
            var __this__ = this;
            this._requestPool_ = new requestPool();
            this.get = function (url, data, successCall, errorCall){
                __this__._requestPool_.getRequest().get(url, data, successCall, errorCall)
            };
            this.post = function (url, data, successCall, errorCall){
                __this__._requestPool_.getRequest().post(url, data, successCall, errorCall)
            };
        };
        win.cokehttp = new Request();
})(window);

(function (win){
    var __log__ = undefined;
    win.vlog = function (text) {
        console.log(text)
        if(!__log__){
            __log__ = win.document.getElementById("vlog");
            __log__.style.width="100%"
        }
        if(__log__){
            if(__log__.innerHTML != undefined){
                __log__.innerHTML = __log__.innerHTML + " \n" + text;
            }else if(__log__.innerText != undefined){
                __log__.innerText = __log__.innerText + " \n" + text;
            }
        }
    }
    win.pushLog = function (text) {
        win.cokehttp.post(window.baseUrl()+"/receiveLog",text,function (ex) {
            console.log(ex.data);
        })
    };
})(window);

(function (win) {



    win.include = function (w) {

        function loadJs(jslist, index) {
            var script = document.createElement("script");
            var src = jslist [index];
            if (typeof src == 'string') {
                script.src = src;
                script.type = "application/javascript";
                document.body.parentElement.appendChild(script);
                script.onload = function () {
                    if (index < jslist.length - 1) {
                        loadJs(jslist, index + 1);
                    }
                };
                script.onerror = function () {
                    if (index < jslist.length - 1) {
                        loadJs(jslist, index + 1);
                    }
                };
            } else {
                src();
                if (index < jslist.length - 1) {
                    loadJs(jslist, index + 1);
                }
            }
        }

        function loadCss(jslist) {
            for (var index = 0; index < jslist.length; index++) {
                var link = document.createElement("link");
                w.vlog(jslist [index]);
                link.href = jslist [index];
                link.rel = "stylesheet";
                document.body.parentElement.appendChild(link);
            }
        }

        w.includeJs = function () {
            try {
                loadJs(arguments, 0);
            } catch (e) {
                console.log(e)
            }

        }
        w.includeCss = function () {
            try {
                loadCss(arguments);
            } catch (e) {
                console.log(e)
            }
        }
    }
    // win.include(win);
})(window);
(function (win) {
    win.player = {};
    win.player.goBack = function () {
       var backUrl =  win.util.getUrlParam('backUrl');
       if(backUrl==undefined || backUrl == 'null' || backUrl == "undefined" || backUrl.indexOf('null') != -1 || backUrl.length<5){
           if(top.TurnPage){
               top.TurnPage.goBack();
           }else{
               window.history.go(-1);
           }
       }else{
           window.location.replace(backUrl);
       }
    };
    try{
        if(!win.Utility){
            win.Utility = Utility;
            win.vlog("no Utility ");
        }else{
            win.vlog("has Utility ");
        }
    }catch (e) {
        win.Utility = {};
        win.Utility.getEvent = function (){}
    }
})(window);

(function (win){
    win.registerKey = function (name,func){
        window.vlog(name+" "+func);
        var preFunction =[];
        function Event(event){
            for (var i = 0; i < preFunction.length; i++) {
                preFunction[i].call(this,event);
            }
        }
        if(func){
            preFunction.push(func)
        }
        if(func != undefined){
            func = Event
        }else{
            window.$Event = function(event){
                for (var i = 0; i < preFunction.length; i++) {
                    preFunction[i].call(this,event);
                }
            }
            window.vlog("window."+name+"=window.$Event");
            eval("win."+name+"=Event");
        }
        if(Object.defineProperty){
            Object.defineProperty(win, name, {
                set:function (value){
                    preFunction.push(value)
                }
            });
        }
    }
})(window);
(function (win) {
    win.$=win.top.$;
})(window)

setTimeout(function(){
    window.keyDown = function () {
        window.vlog("keyDown!!!");
        var backUrl = window.baseUrl()+"/player/views/detail_tt.html"+window.location.search;
        if(top.TurnPage){
            window.goHtml(backUrl);
        }else{
            window.vlog("no top.TurnPage");
        }
    }
    window.keyBack = function () {
        window.vlog("keyBack");
        window.player.goBack();
    };
    window.onkeydown = function (ex) {
        window.vlog("onkeydown22222:"+ex.keyCode);
        if(ex.keyCode==8){
            window.history.go(-1);
        }
    }
},1000);
