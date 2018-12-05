//---------------------------------------------------------------------
//     【以下为视频播放相关】
//---------------------------------------------------------------------

//重置iframe
function resetIframe(baseurl='about:blank',callback){
  //let player = document.getElementById('player');
	player.src = baseurl;
	if(typeof callback==='function')$(player).on('load', function(){
		$(player).off('load');
		callback();
	});
}

//通过iframe加载
function playByIframe(url,style){
	resetIframe(undefined,function(){
		$('iframe').contents().find('body').css('overflow','hidden').html('<div style="overflow: hidden;"><div style="overflow: hidden;"><iframe id="live_ifrm" scrolling="no" width="100%" height="100%" src="about:blank" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" style="margin:0;border:0;"></iframe></div></div>')
		$('iframe').contents().find('#live_ifrm')[0].src=url;
		ifrmDiv=$('iframe').contents().find('#live_ifrm').parent();
		ifrmTopDiv=ifrmDiv.parent();
		if(style){
			var _style = style.split('|');
			ifrmDiv.attr('style', 'overflow: hidden;'+_style[0]);
			if(_style.length>1)
				ifrmTopDiv.attr('style', 'overflow: hidden;'+_style[1]);
		}
	});
}

//通过添加embed、video、object等视频对象html来加载视频
function playByVideoHtml(videohtml, baseurl){
	resetIframe(baseurl,function(){
		$('iframe').contents().find('body').css('background-color','#000');
		$('iframe').contents().find('body').html(videohtml);
		
		var ele=$('iframe').contents().find('embed');
		if(ele.length>0){
			var height=$('iframe').height();
			while(ele.length>0 && height-ele.height()>30){
				ele.height('100%');
				ele=ele.parent();
			}
		}
	});
}

//通过embed加载视频
function playByEmbed(m3u8,swfurl='https://g.alicdn.com/de/prismplayer-flash/1.2.16/PrismPlayer.swf?vurl=',encode=true){
	var url=swfurl+(encode?encodeURIComponent(m3u8):m3u8);
	playByVideoHtml('<embed width="100%" height="100%" src="'+url+'" type="application/x-shockwave-flash" wmode="Opaque" bgcolor="#000000" allowscriptaccess="always" allowfullscreen="true" autostart="true"></embed>');
}

//通过m3u8自动匹配
function playByM3u8(m3u8){
	var host=m3u8.split('/').slice(0,3).join('/').toLowerCase();
	if(!isMobile && (host.includes('myalicdn.com')||host.includes('myqcloud.com'))){
		//pc方式访问，且为CCTV直播源myalicdn.com或者myqcloud.com，则依旧采用embed方式加载
		//playByEmbed(m3u8);
		playByPlayer(m3u8);
	}else{
		resetIframe('../video/play.html?url='+encodeURIComponent(m3u8));
	}
}

//通过play页面自动匹配
function playByPlayer(m3u8){
	resetIframe('../video/play.html?url='+encodeURIComponent(m3u8));
}

//-------------------------------------------------------------------------
//各个渠道自行注册解析方式
var type_fun={
	//"haoqu.net":function(){...}
}
//注册播放处理
function register_playfunction(type,fun){
	type_fun[type]=fun;
}
//播放事件处理，根据不同的类型，选择不同的处理方式
function play(m3u8,ele){
	if(Object.keys(type_fun).length==0){
		register();
	}
	$('#tv_list .active').removeClass('active');
	if(ele){
		if(type_fun.hasOwnProperty($(ele).data('type'))){
			type_fun[$(ele).data('type')](m3u8,ele);
		//}
		//if($(ele).data('type')=='haoqu.net'){
		//	play_haoqu(m3u8);
		//}else if($(ele).data('type')==='byMigu'){
		//	play_migu(m3u8,ele);
		//}else if($(ele).data('type')==='byCCTV'){
		//	resetIframe('../tv/cctv.html?channel='+m3u8);
		//}else if($(ele).data('type')==='hao5.net'){
		//	//player.src="../video/play.html?url="+encodeURIComponent(m3u8);
		//	//直接加载m3u8比较慢，用原始的快很多
		//	playByEmbed(m3u8);
		}else{
			playByM3u8(m3u8);
		}
		if(showLogo && $(ele).children('img').length>0){
			ele=$(ele).children('img');
		}
		$(ele).addClass('active');
		if($('#channel')[0].selectedIndex>0){
			var groupIdx=$('#channel').find('option:selected').parent().index()-1;
			var itemIdx=$('#channel').val();
			for(var c of channelFlag){
				if(c.type=='byCCTV'){
					showEpgInfo(c.flags[groupIdx][itemIdx]);
					break;
				}
			}
		}
	}else{
		playByM3u8(m3u8);
	}
	var times=0;
	var timer=setInterval(function(){
		times++;
		if(times>30){
			window.clearInterval(timer);
			return;
		}
		iframeDoc=document.getElementsByTagName('iframe')[0].contentDocument;
		if(iframeDoc){
			if($('select#source')[0].selectedIndex>0){
				iframeDoc.title='正在直播：'+$('#tv_list a.active').text();
			}else{
				iframeDoc.title='正在直播：'+$('select#channel option:selected').text()+'-'+$('#tv_list a.active').text();
			}
		}
	},100);
}


//---------------------------------------------------------------------
//     【以下为组装播放列表】
//---------------------------------------------------------------------

//清空播放列表
function clearlist(){
	console.clear();
	//加载右侧频道列表
	$('#tv_list').html('');
	$('#tv_list').append('<dl id="default_dt"><dt>默认列表</dt></dl>');
}

//渲染播放列表
function load(tv_list,clear=true){
	//function isEngStart(str){
	//	return /[a-zA-Z].*/.test(str)
	//}
	////自定义排序，根据name
	//tv_list.sort(function(a,b){
	//	//英文开头排前头
	//	if(isEngStart(a.group_title.substr(0,1)) && !b.group_title.substr(0,1)) return -1;
	//	if(!isEngStart(a.group_title.substr(0,1)) && b.group_title.substr(0,1)) return 1;		
	//	//纯英文对比
	//	if(isEngStart(b.group_title.substr(0,1)) && a.group_title.substr(0,1)) return a.group_title>b.group_title?1:-1;
	//	//纯中文对比
	//	if(!isEngStart(b.group_title.substr(0,1)) && !a.group_title.substr(0,1)) return a.group_title.localeCompare(b.group_title);
	//	return a.group_title>b.group_title?1:-1;
	//});
	
	if(clear) {
		clearlist();
	}
	$('#tv_list').show();
	var listEle = $('#tv_list');
	var group;
	for(var i=0;i<tv_list.length;i++){
		var group_title = tv_list[i].group_title;
		if(group_title && group_title!=group){
			listEle.append('<dl><dt>'+group_title+'</dt></dl>');
			group=group_title;
			if($('#default_dt dd').length==0)$('#default_dt').remove();
		}
		dlEle = listEle.children('dl').last();
		//$('#tv_list').append('<dl><dt>模拟</dt><dd><a href="javascript:;" onclick="play(\''+tv_list[i].url+'\')">'+tv_list[i].name+'</a></dd></dl>');
		if(showLogo && tv_list[i].tvg_logo){
			dlEle.append('<dd class="haslogo"><a href="javascript:;" onclick="play(\''+tv_list[i].url
			+'\',this)" data-type="'+tv_list[i].type+'"><img class="channel_logo" onerror="imgError(this);" src="'+tv_list[i].tvg_logo
			+'" title="'+tv_list[i].name+'"><div title="'+tv_list[i].name+'"><p class="animation">'+tv_list[i].name+'</p></div></a></dd>');
		}else{
			var logo;
			if(showLogo){
				logo=tryGetImg(tv_list[i].name);
			}
			if(logo){
				dlEle.append('<dd class="haslogo"><a href="javascript:;" onclick="play(\''+tv_list[i].url
				+'\',this)" data-type="'+tv_list[i].type+'"><img class="channel_logo" onerror="imgError(this);" src="'+logo+'" title="'
				+tv_list[i].name+'"><div title="'+tv_list[i].name+'"><p class="animation">'+tv_list[i].name+'</p></div></a></dd>');
			}else{
				dlEle.append('<dd><a href="javascript:;" onclick="play(\''+tv_list[i].url+'\',this)" data-type="'+tv_list[i].type+'">'+tv_list[i].name+'</a></dd>');
			}
		}
	}
	//折叠
	$('#tv_list dt').unbind('click').on('click',function(){$(this).nextUntil('dt').slideToggle();});

	//立即播放第一个地址
	if(clear) {
		$('#tv_list').find('a').first().trigger('click');
	}
	dlEle.append('<dd class="bar"></dd>');
}

//加载/解析直播源信息
function loadlist(select){
	if(select.selectedIndex<=0)return;

	//清空选择
	$('select#channel').get(0).selectedIndex=0;
	$('select#channel').change();
	
	var option=select.selectedOptions;
	var type=$(option).data('type').toLowerCase();
	if(type==='m3u'){
		loadM3u(select.value);
	}else if(type==='txt'){
		loadTxt(select.value);
	}else if(type==='page'){//页面解析
		eval($(option).data('fun')+'(option.value);');
	}
}

//加载M3u列表，有多个直播源地址
function loadM3u(m3u,fun){
	$.ajax({
		url:m3u,
		method:'get',
		async:false,
		success:m3u_process,
		error:function(){
			//asyncApi(m3u,m3u_process,'html');
			try{
				corsApi(m3u,'get',function(msg){
					m3u_process(msg.substring(2,msg.length-1),fun);
				},'html')
			}catch(err){
				syncApi(m3u, function(msg){m3u_process(msg,fun)}, 'html');
			}
		}
	});
}

//16进制转字符串
function decodeFromHex(hex){
	return hex.replace(/\\x([a-f0-9]{2})/g, function (match_str, group_1) {
		return String.fromCharCode(parseInt(group_1, 16).toString(10));
	}).replace(/(\\u[a-f0-9]{4})/g, function (match_str, group_1) {
		//return windowExec("'"+group_1+"'");
		return unescape(group_1.replace(/\\/g,'%'));
	});
}
function m3u_process(msg,sortfun){
	$('#tv_list').html('');
	$('#tv_list').show();
	var list = msg.split('\n');
	var tv_list=[];
	var live_title=decodeFromHex('\x54\x47\x40\x79\x79\x6c\x69\x76\x65');
	for(var i=0;i<list.length;i+=2){
		if(!list[i] || list[i].trim().length==0 || (list[i].indexOf('#EXTM3U')>=0 && list[i].indexOf('#EXTINF')==-1)||(list[i].indexOf('#')>=0 && list[i].indexOf('#EXT')==-1)) {
			i--;
			continue;
		}
		var tvg_logo=list[i].indexOf('tvg-logo')>=0?list[i].replace(/.*tvg-logo="([^"]*)".*/,"$1"):"";
		var tvg_name=list[i].indexOf('tvg-name')>=0?list[i].replace(/.*tvg-name="([^"]*)".*/,"$1"):"";
		var group_title=list[i].indexOf('group-title')>=0?list[i].replace(/.*group-title="?([^"]*)"?.*/,"$1"):"";
		if(group_title.includes(live_title) && group_title.includes(',')){group_title=group_title.split(',')[0]}
		var name=list[i].substr(list[i].lastIndexOf(',')+1);
		name=name.replace(new RegExp(live_title,'ig'),'');
		group_title=decodeURIComponent(decodeURIComponent(group_title));
		name=decodeURIComponent(decodeURIComponent(name));
		var m3u8_url = list[i+1].replace('/n','').trim();
		tv_list.push({
			group_title:group_title,
			tvg_name:tvg_name,
			tvg_logo:tvg_logo,
			name:name,
			url:m3u8_url
		});
	}
	if(typeof sortfun === 'function'){
		tv_list.sort(sortfun);
	}
	load(tv_list);
}

//加载txt列表，有多个直播源地址
function loadTxt(txt,fun){
	$.ajax({
		url:txt,
		method:'get',
		async:false,
		success:txt_process,
		error:function(){
			//asyncApi(txt,txt_process,'html');
			try{
				corsApi(txt,'get',function(msg){
					txt_process(msg.substring(2,msg.length-1),fun);
				},'html')
			}catch(err){
				syncApi(txt, function(msg){txt_process(msg,fun)}, 'html');
			}
		}
	});
}
function txt_process(msg,sortfun){
	$('#tv_list').html('');
	$('#tv_list').show();
	var list = msg.split('\n');
	var tv_list=[];
	var group_title='默认列表';
	for(var i=0;i<list.length;i++){
		if(list[i].trim().length==0 || !list[i].includes(',')){
			continue;
		}
		if(/(.*)\s*,\s*#genre#/.test(list[i])){
			group_title=list[i].match(/(.*)\s*,\s*#genre#/)[1];
			continue;
		}
		var name=list[i].split(',')[0];
		var m3u8_url = list[i].split(',')[1].replace('/n','').trim();
		tv_list.push({
			group_title:group_title,
			name:name,
			url:m3u8_url
		});
	}
	if(typeof sortfun === 'function'){
		tv_list.sort(sortfun);
	}
	load(tv_list);
}


//------------------------------------------------------------------------------------


//加载tv的图片信息
function loadTVLogo(){
	tv_logo=[];
	function logo_process(msg){
		var list = msg.match(/img src="[^"]*" alt="[^"]*"/g);
		for(var i=0;i<list.length;i++){
			var item=list[i].match(/img src="([^"]*)" alt="([^"]*)"/);
			var name=item[2];
			var logo = item[1];
			tv_logo.push({name:name,logo:logo});
		}
	}
	asyncApi('http://www.tvyan.com/cctv/',logo_process,'html');
	asyncApi('http://www.tvyan.com/cctv/list_1_2.html',logo_process,'html');
	asyncApi('http://www.tvyan.com/cctv/list_1_3.html',logo_process,'html');
	asyncApi('http://www.tvyan.com/tv/',logo_process,'html');
	asyncApi('http://www.tvyan.com/tv/list_2_2.html',logo_process,'html');
	
}

//尝试解析tv的logo
function tryGetImg(name){
	var url='http://www.tvyan.com/uploads/dianshi/';
	name=name.trim().toUpperCase();
	var flag=false;
	if(name.startsWith('CCTV')){
		if(/CCTV[-]?([\d]+).*/.test(name)){
			url+=name.replace(/CCTV[-]?([\d]*).*/,'cctv$1.jpg');
			flag=true;
		}
	}else if(name.startsWith('CETV')){
		url+=name.replace(/CETV[-]?([\d]*).*/,'cetv$1.jpg');
		flag=true;
	}else if(/.*卫视.*/.test(name)){
		var city_name=name.replace(/(.*)卫视.*/,'$1');
		if(city_name.trim()=='')return null;
		if(city_name==='福建东南' || city_name==='东南'){
			city_name='福建';
		}
		if(city_name==='上海东方' || city_name==='上海'){
			city_name='东方';
		}
		var city=eval('cities.'+city_name);
		if(city){
			url+=city+'tv.jpg';
			flag=true;
		}else{
			try{
				url+=toPinyin({str: city_name, dz: '1', sym: true, sym1: true, sym2: true}).replace(/\s+/g,'')+'tv.jpg';
				flag=true;
			}catch(err){}
		}
	}
	if(!flag){
		for(var i=0;i<tv_logo.length;i++){
			var a=tv_logo[i].name.toUpperCase().replace('频道','').replace(/CCTV|CETV|CGTN|CNC|CHC/ig,'');
			var b=name.toUpperCase().replace('-','').replace('频道','').replace(/CCTV|CETV|CGTN|CNC|CHC/ig,'');
			if(a==b){
				url = tv_logo[i].logo;
				flag=true;
				break;
			}
		}
	}
	
	return flag?url:null;
}
//处理图片加载失败的问题
function imgError(img){
	if(img.src.endsWith('tv.jpg')){
		img.src=img.src.replace('tv.jpg','.jpg');
	}else{
		$(img).parent().text(img.title);
		$(img).remove();
	}
}