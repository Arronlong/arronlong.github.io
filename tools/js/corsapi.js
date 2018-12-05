function isFunction(f){return typeof f === 'function';}
function isObject(o){return typeof o === 'object';}
function isString(s){return typeof s === 'string';}

//跨域引用阻止
var corsapi_referrer=document.referrer
if(!corsapi_referrer){
	//var js_arr=document.getElementsByTagName('SCRIPT');
	//for (var js in js_arr){
	//	if(js_arr[js].src && js_arr[js].src.indexOf('corsapi.js')))>0){
	//		location.href='http://www.baidu.com/';
	//	}
	//}
	corsapi_referrer=location.hostname;
}
var corsapi_referDomain=(corsapi_referrer.split('/').slice(2,3).join('/'))||location.hostname;
if(corsapi_referDomain!=location.hostname || (!corsapi_referDomain.endsWith('arronlong.com') 
	&& corsapi_referDomain!='arronlong.netlify.app'
	&& corsapi_referDomain!='localhost' 
	&& !corsapi_referDomain.startsWith('10.1.22.')
	&& !corsapi_referDomain.startsWith('192.168.1.') 
	&& !location.pathname.startsWith('/arronlong.com'))){
	window.top.location.href='http://www.baidu.com/';
}

//跨域请求，也可以改为https
//1. http://cors-anywhere.herokuapp.com/ 支持get、post，有限制
//2. https://data.jianshukeji.com/jsonp?url=，仅支持get
//3. http://www.whateverorigin.org/get?url=，仅支持get
function corsApi(url){
	//调用说明:corsApi(url,httpmethod,data,fun,contentType){
	var paras=Array.prototype.slice.call(arguments);
	if(paras.length==0)return;
	var method='get',data,fun,type='json';
	if(isString(paras.slice(1,2)[0])){//第二个参数为字符串，则为选择get|post
		method = paras.slice(1,2)[0];
	}
	if(isFunction(paras.slice(-1)[0])){//最后一个参数为function，则为回调函数
		fun = paras.slice(-1)[0];
		if(isObject(paras.slice(-2,-1)[0])){//倒数第二个参数为object，则为传递的post参数
			data=paras.slice(-2,-1)[0];
		}
	}else if(isString(paras.slice(-1)[0]) && isFunction(paras.slice(-2,-1)[0])){//最后一个参数为string，倒数第二个为function，则为回调函数
		fun = paras.slice(-2,-1)[0];
		type = paras.slice(-1)[0];//最后一个参数为type
		if(isObject(paras.slice(-3,-2)[0])){//倒数第二个参数为object，则为传递的post参数
			data=paras.slice(-3,-2)[0];
		}
	}
	
	if(method.toLowerCase().trim() === 'get'){
		var urls=['http://www.whateverorigin.org/get?url=','https://data.jianshukeji.com/jsonp?url='];
		var idx=Math.random()>0.999?0:1;
		if(type.toLowerCase()==='json'){
			$.getJSON(urls[idx] + encodeURIComponent(url) + '&callback=?', function(msg){
				if(fun)fun(idx==0?JSON.parse(msg.contents):msg);
			});
		}else{
			var _fun=idx==0?$.getJSON:$.get;//用第一种方式，返回值是json
			_fun(urls[idx] + encodeURIComponent(url) + '&callback=?', function(msg) {
				if(fun)fun(idx==0?msg.contents:msg);
			},type);
		}
	}else{
		var urls=['https://cors.zme.ink/','http://cors-anywhere.herokuapp.com/'];
		var idx=Math.random()>0.999?0:1;
		$.post(urls[idx]+ url, data, function(msg){
			if(fun)fun(msg);
		});
	}
}

//异步：获取跨域的get请求
function asyncApi(url,fun,httpmethod='get',parastr=''){
	//调用说明：asyncApi(url,fun,httpmethod='get',parastr='')
	var data='method=0';
	if(httpmethod.toLowerCase()==='post'){
		data='method=1';
	}
	var _url=url.replace('CURRENT_TIME_STAMP',new Date().getTime()).split('?');
	var data=data+'&host='+encodeURIComponent(_url[0])+'&hideRAW=';
	if(_url.length>1){
		if(parastr!='') parastr+="&";
		data+=encodeURIComponent(parastr+_url[1]);
		var paras=_url[1].split('&');
		for(var para of paras){
			data=data+'&paramsname='+para.split('=')[0]+'&paramsval='+para.split('=')[1]
		}
	}else{
		data+=encodeURIComponent(parastr);
	}

	var lastArg = Array.prototype.slice.call(arguments).slice(-1)[0];
	var type = typeof lastArg == 'string'? (/get|post/.test(lastArg)?'JSON':lastArg):'JSON';
	fetch('https://tool.chinaz.com/Tools/httptest.aspx',{
		method:'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: data //向服务端传入json数据
	}).then(function (res) {
		res.text().then(function (value) {
			var parser=new DOMParser();
			var htmlDoc=parser.parseFromString(value, 'text/html');
			var text=$(htmlDoc).find('.RtitCeCode pre').text();
			if(type.toUpperCase()==='JSON'){
				text=JSON.parse(text);
			}
			if(typeof fun ==='function'){
				fun(text);
			}
		})
	})
}

/*
//fetch的同步方式
async function myFetch(){
	let res = await fetch('https://www2.deepl.com/jsonrpc',{
		method:'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		mode:'cors',
		body: JSON.stringify({"jsonrpc":"2.0","method": "LMT_split_into_sentences","params":{"texts":["Thank you, sir. Number five."],"lang":{"lang_user_selected":"auto","user_preferred_langs":["ZH","EN"]}},"id":99410005}) //向服务端传入json数据
	});
    let result = await res.json()
    console.log(JSON.stringify(result))
    return result;
}
myFetch().then(data => console.log(JSON.stringify(data)))

*/

//异步：获取跨域的get请求
async function syncApi(url,fun,httpmethod='get',parastr=''){
	//调用说明：asyncApi(url,fun,httpmethod='get',parastr='')
	var data='method=0';
	if(httpmethod.toLowerCase()==='post'){
		data='method=1';
	}
	var _url=url.replace('CURRENT_TIME_STAMP',new Date().getTime()).split('?');
	var data=data+'&host='+encodeURIComponent(_url[0])+'&hideRAW=';
	if(_url.length>1){
		if(parastr!='') parastr+="&";
		data+=encodeURIComponent(parastr+_url[1]);
		var paras=_url[1].split('&');
		for(var para of paras){
			data=data+'&paramsname='+para.split('=')[0]+'&paramsval='+para.split('=')[1]
		}
	}else{
		data+=encodeURIComponent(parastr);
	}

	var lastArg = Array.prototype.slice.call(arguments).slice(-1)[0];
	var type = typeof lastArg == 'string'? (/get|post/.test(lastArg)?'JSON':lastArg):'JSON';
	let res = await fetch('https://tool.chinaz.com/Tools/httptest.aspx',{
		method:'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: data //向服务端传入json数据
	})
	let result = await res.text().then(function (value) {
			var parser=new DOMParser();
			var htmlDoc=parser.parseFromString(value, 'text/html');
			var text=$(htmlDoc).find('.RtitCeCode pre').text();
			if(type.toUpperCase()==='JSON'){
				text=JSON.parse(text);
			}
			if(typeof fun ==='function'){
				fun(text);
			}
			return text;
		})
    return result;
}

//同步：获取远程api请求结果，get方式
function syncGetApi(url,fun){
	var _url=url.replace('CURRENT_TIME_STAMP',new Date().getTime()).split('?');
	var data='method=0&host='+encodeURIComponent(_url[0])+'&hideRAW=';
	if(_url.length>1){
		data+=encodeURIComponent(_url[1]);
		var paras=_url[1].split('&');
		for(var para of paras){
			data=data+'&paramsname='+para.split('=')[0]+'&paramsval='+para.split('=')[1]
		}
	}

	var result = $.ajax({
	 type: 'GET',
	 url: 'https://tool.chinaz.com/Tools/httptest.aspx',
	 data: data,
	 async: false
	});
	var parser=new DOMParser();
	var htmlDoc=parser.parseFromString(result.responseText, 'text/html');
	var text=$(htmlDoc).find('.RtitCeCode pre').text();
	var lastArg = Array.prototype.slice.call(arguments).slice(-1)[0];
	var type = typeof lastArg == 'string'? (/get|post/.test(lastArg)?'JSON':lastArg):'JSON';
	if(type.toUpperCase()==='JSON'){
		text=JSON.parse(text);
	}
	if(typeof fun ==='function'){
		fun(text);
	}
	return text;
}
