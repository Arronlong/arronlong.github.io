//---------------------------------------------------------------------
//     频道解析【以下为每个频道的多个直播源解析】依赖tv.js
//		cctv：http://jsontv.oss-cn-shenzhen.aliyuncs.com/tvjson/cctv1.txt
//		卫视：http://jsontv.oss-cn-shenzhen.aliyuncs.com/tvjson/weishi1.txt
//		其他：http://jsontv.oss-cn-shenzhen.aliyuncs.com/tvjson/qita1.txt
//		直播源频道：http://bashijiu.com/825.html
//		https://github.com/homenet6/homenet6.github.io/blob/master/add.txt
//---------------------------------------------------------------------
//加载卫视频道
var channels=[
	{
		name:'央视频道',
		children:['CCTV1综合','CCTV2财经','CCTV3综艺','CCTV4中文国际','CCTV5体育','CCTV5+体育','CCTV6电影','CCTV7军事农业','CCTV8电视剧','CCTV9纪实片','CCTV10科教','CCTV11戏曲','CCTV12社会与法','CCTV13新闻','CCTV14少儿','CCTV15音乐','CCTV17农业农村频道']
	},
	{
		name:'卫视频道',
		children:['安徽卫视','北京卫视','重庆卫视','东方卫视','东南卫视','甘肃卫视','广东卫视','广西卫视','贵州卫视','河北卫视','河南卫视','黑龙江卫视','湖北卫视','湖南卫视','吉林卫视','江苏卫视','江西卫视','辽宁卫视','内蒙古卫视','宁夏卫视','青海卫视','山东卫视','山西卫视','陕西卫视','深圳卫视','四川卫视','天津卫视','西藏卫视','厦门卫视','新疆卫视','云南卫视','浙江卫视', '兵团卫视', '三沙卫视']
	}
]

//频道结构定义
//Type：byPage 解析地址，byIframe 替换iframe，byLink 直接解析播放地址，byXXX 单独处理
var channelFlag=[
	{//http://www.hao5.net
		site:'http://www.hao5.net',
		type: 'byLink',
		_type: 'hao5.net',
		name: 'hao5-PC源',
		mode:'pc',
		format:[
			//CCTV
			'http://cctvalih5ca.v.myalicdn.com/live/%s_2/index.m3u8',//ali阿里线路
			//'http://cctvcnch5ca.v.wscdns.com/live/%s_2/index.m3u8',//cnc
			
			//卫视
			//'http://cctvalih5c.v.myalicdn.com/wstv/%s_2/index.m3u8',//已失效
			'http://cctvalih5ca.v.myalicdn.com/wstv/%s_2/index.m3u8',
			//'http://cctvtxyh5ca.liveplay.myqcloud.com/wstv/%s_2/index.m3u8', //没有hd也是高清
			],
		flags:[
			['cctv1','cctv2','cctv3','cctv4','cctv5','cctv5plus','cctv6','cctv7','cctv8',null,'cctv10','cctv11','cctv12','cctv13','cctvchild','cctv15','cctv17'],
			['anhui','btv1','chongqing','dongfang','dongnan','gansu','guangdong','guangxi','guizhou','hebei','henan','heilongjiang','hubei',null,'jilin',null,'jiangxi','liaoning',null,'ningxia','qinghai','shandong','shan1xi','shan3xi','shenzhen','sichuan','tianjin','xizang','special-xiamen',null,'yunnan', null,null,null],//湖南、江苏、内蒙古、新疆、浙江、兵团、三沙挂了
		],
		special:{
			xiamen:'http://cctvbsh5ca.v.live.baishancdnx.cn/cstv/xiamen_2/index.m3u8',
		}
	},
	{//migu
		site:'migu',
		type: 'byMigu',
		name: '咪咕源',
		mode:'pc',
		flags:[
			['cctv1/cctv1hd','cctv2/cctv2hd','cctv3/cctv3hd','cctv4/cctv4hd','cctv5/cctv5hd','cctv5p/cctv5phd','cctv6/cctv6hd','cctv7','cctv8/cctv8hd','cctv9','cctv10/cctv10hd','cctv11','cctv12','cctv13','cctv14/cctv14hd','cctv15','cctv17'],
			['ahws/ahwshd','bjws/bjws2','cqws','dfws','dnws','gsws','gdws/gdwshd','gxws','gzws','hbws','hnws','hljws/hljwshd','hubws/hubwshd','hunwshd1/hunwshd2/hunwshd3','jlws','jsws/jswshd','jxws','lnws/lnwshd','nmws','nxws','qhws',null,'sxiws','sxws','szws/szwshd','scws','tjws/tjwshd','xzws','xmws','xjws','ynws',null,'btws',null],
		]
	},
	{//http://ivi.bupt.edu.cn，http://ivi6.bupt.edu.cn/hls/cctv1hd.m3u8
		site:'http://ivi.bupt.edu.cn',
		type: 'byLink',
		name: '北邮',
		format:[
			'http://ivi.bupt.edu.cn/hls/%s.m3u8',//'rtmp://ivi.bupt.edu.cn/livetv/jstv'//标清
			'http://ivi.bupt.edu.cn/hls/%s.m3u8',//'rtmp://ivi.bupt.edu.cn/livetv/jshd'//高清
			],
		flags:[
			['cctv1/cctv1hd','cctv2/cctv2hd','cctv3/cctv3hd','cctv4hd', null,'cctv5p/cctv5phd','cctv6/cctv6hd','cctv7/cctv7hd','cctv8/cctv8hd','cctv9/cctv9hd','cctv10/cctv10hd','cctv11','cctv12/cctv12hd','cctv13','cctv14/cctv14hd','cctv15','cctv17/cctv17hd'],
			['ahtv/ahhd','btv1/btv1hd','cqtv','dftv/dfhd','dntv/dnhd','gstv','gdtv/gdhd','gxtv/gxhd','gztv/gzhd','hebtv/hebhd','hntv','hljtv/hljhd','hbtv/hbhd','hunantv/hunanhd','jltv/jlhd','jstv/jshd','jxtv','lntv','nmtv','nxtv','qhtv','sdtv/sdhd','sxrtv','sxtv','szws/szhd','sctv/schd','tjtv','xztv',null,'xjtv','yntv','zjtv/zjhd','bttv','sstv'],
		]
	},
	{//http://tv.cctv.com
		site:'http://tv.cctv.com',
		type: 'byCCTV',
		name: 'CCTV源',
		mode:'pc',
		flags:[
			['cctv1','cctv2','cctv3','cctv4','cctv5','cctv5plus','cctv6','cctv7','cctv8','cctvjilu','cctv10','cctv11','cctv12','cctv13','cctvchild','cctv15','cctv17'],
			['anhui','btv1','chongqing','dongfang','dongnan','gansu','guangdong','guangxi','guizhou','hebei','henan','heilongjiang','hubei','hunan','jilin','jiangsu','jiangxi','liaoning','neimenggu','ningxia','qinghai','shandong','shan1xi','shan3xi','shenzhen','sichuan','tianjin','xizang','xiamen','xinjiang','yunnan','zhejiang','bingtuan','sansha'],//江苏失效
		]
	},
	//{//http://www.haoqu.net,包含在66zhibo.net
	//	site: 'http://www.haoqu.net',
	//	type: 'byPage', 
	//	format:[
	//		'http://www.haoqu.net/1/%s.html',
	//		'http://www.haoqu.net/2/%s.html',
	//		],
	//	flags: [
	//		['cctv1','347','cctv3','cctv4','cctv5','cctv5+','cctv6','cctv7','353','cctv9','cctv10','cctv11','cctv12','cctv13','cctv14','cctv15','cctv17'],
	//		['anhui','beijingweishi','chongqing-weishi','dongfangweishi','fujian','gansu','guangdong','guangxi','guizhouweishi','hebei','henan','heilongjiang','hubei','hunanweishi','jilin','jiangsuweishi','jiangxiweishi','liaoningweishi','neimenggu','ningxia','qinghai-weishi','shandongweishi','shanxi','shanxiweishi','szws','sichuan','tianjinweishi','xizang','xiamen','xinjiang','yunnan','zhejiangweishi','bingtuan','sansha'],
	//	]
	//},
	{//http://www.66zhibo.net
		site: 'http://www.66zhibo.net',
		type: 'byPage', 
		format:[
			'http://www.66zhibo.net/1/%s.html',
			'http://www.66zhibo.net/2/%s.html',
			],
		flags: [
			['cctv1','cctv2','cctv3','cctv4','cctv5','cctv5+','cctv6','cctv7','cctv8','cctv9','cctv10','cctv11','cctv12','cctv13','cctv14','cctv15','cctv17'],
			['anhui','beijing','chongqing','dongfang','dongnan','gansu','guangdong','guangxi','guizhou','hebei','henan','heilongjiang','hubei','hunan','jilin','jiangsu','jiangxi','liaoning','neimeng','ningxia','qinghai','shandong','shanxi','shanxi','shenzhen','sichuan','tianjin','xizang','xiamen','xinjiang','yunnan','zhejiang','bingtws','sansha'],
		]
	},
	{//http://www.tvsbar.com
		site:'http://www.tvsbar.com',
		type: 'byPage',
		format:[
			'http://www.tvsbar.com/cctv/%s.html',
			'http://www.tvsbar.com/smg/%s.html'
			],
		flags:[
			['13','15','7','8','9','1103','11','12','18','19','6','4','3','1','16','17','4955'],
			['86','123','1712','874','137','161','183','228','249','444','475','500','523','317','589','608','681','715','739','725','763','1164','844','858','214','893','252','768','152','912','1695','1601','909','1154'],//北京、江苏、内蒙古、新疆、浙江已失效，其中内蒙古是数据源解析失败
		]
	},
];

//加载指定频道
function loadchannel(select){
	if(select.selectedIndex<=0)return;

	//清空选择
	$('select#source').get(0).selectedIndex=0;
	$('select#source').change();

	var groupIdx=$(select).find('option:selected').parent().index()-1;
	var itemIdx=$(select).val();
	//手动清除列表
	clearlist();
	for(var i=0;i<channelFlag.length;i++){
		if(groupIdx>channelFlag[i].flags.length-1) continue;//没有该数组
		if(isMobile && channelFlag[i].mode==='pc') continue;//仅限PC访问，手机访问时隐藏
		var _channel=channelFlag[i].flags[groupIdx][itemIdx];
		if(!_channel)continue;//没有该频道
		var _channels=_channel.split('/');
		if(channelFlag[i].type==='byPage'){
			//byPage 解析地址
			for(var t=0;t<_channels.length;t++){
				if(channelFlag[i].site.endsWith('haoqu.net')){
					loadHaoqu(channelFlag[i].format[groupIdx].replace('%s',_channels[t]), $('#tv_list dl dd').length==0);
				}else if(channelFlag[i].site.endsWith('tvsbar.com')){
					loadTvsbar(channelFlag[i].format[groupIdx].replace('%s',_channels[t]), $('#tv_list dl dd').length==0);
				}else if(channelFlag[i].site.endsWith('66zhibo.net')){
					load66zhibo(channelFlag[i].format[groupIdx].replace('%s',_channels[t]), $('#tv_list dl dd').length==0);
				}else{
				}
			}
		}else if(channelFlag[i].type==='byIframe'){
			//byIframe 替换iframe
			for(var t=0;t<_channels.length;t++){
				//...
			}
		}else if(channelFlag[i].type==='byLink'){
			var tv_list=[];
			for(var t=0;t<_channels.length;t++){
				var bool=true;
				var url=channelFlag[i].format[groupIdx].replace('%s',_channels[t]);
				if(_channels[t].startsWith('special-')){
					url=channelFlag[i].special[_channels[t].substr('special-'.length)]
				}
				try{
					$.getScript(url,function(msg,status){
						if(status!='success'){
							bool=false;
						}
					})
				}catch(err){
					bool=false;
				}
				if(bool){
					//byLink 直接解析播放地址
					tv_list.push({
						name: channelFlag[i].name+(url.endsWith('hd.m3u8')?'高清':''),
						url: url,
						type: channelFlag[i]._type,
					})
				}
			}
			load(tv_list, $('#tv_list dl dd').length==0);
		}else if(channelFlag[i].type.startsWith('byCCTV')){
			var tv_list=[];
			for(var t=0;t<_channels.length;t++){
				tv_list.push({
					name: channelFlag[i].name,
					url: _channels[t],
					type: channelFlag[i].type
				})
				tv_list.push({
					name: channelFlag[i].name+'-回播',
					url: _channels[t],
					type: channelFlag[i].type+'Back',//byCCTVBack
				})
			}
			load(tv_list, $('#tv_list dl dd').length==0);
		}else {
			//单独的
			var tv_list=[];
			for(var t=0;t<_channels.length;t++){
				tv_list.push({
					name: /.*hd\d*/.test(_channels[t])?(channelFlag[i].name+'-高清'):channelFlag[i].name,
					url: _channels[t],
					type: channelFlag[i].type
				})
			}
			load(tv_list, $('#tv_list dl dd').length==0);
		}
	}
}

//各大卫视官方源\其他源
var tvchannels={
	anhui:{//访问m3u8地址、iframe，均报403,
		//name:'安徽卫视',
		//iframe:'http://nettv.ahtv.cn/live/index.html?jumpchannel=ahws',
		
		//url中的参数是通过post 'http://newlive.ahtv.cn/index/getSign' -d {catalog: /pull.bdflv.ahtv.cn/live/ahws2}获得
		//sign_url:'http://newlive.ahtv.cn/index/getSign',
		//postData:{catalog: '/pull.bdflv.ahtv.cn/live/ahws2'},
		//url_format:'http://pull.bdflv.ahtv.cn/live/ahws2.flv?secret=%s&timestamp=%s',
		//url_format_field:['sign','time'],//根据该顺序进行字段替换
	},
	beijing:{
		name:'北京卫视',
		iframe:'https://www.btime.com/btv/btvsy_index',
		iframe_style:'margin-top:-70px;height: 627px;',
		url: ['http://101.89.132.136/live/tm-btv1hd-800k.m3u8','http://by4.nty.tv189.cn/tm-btv1hd-800k.m3u8'],
	},
	bingtuan:{
		name:'兵团卫视',
		iframe:'http://www.btzx.com.cn/special/bofang/btzxjmd/index.shtml',
		iframe_style:'margin-top:-80px;height:2500px',
		object_blank:'<object pluginspage="http://www.macromedia.com/go/getflashplayer"classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,3,0,0"width="100%"height="100%"id="chfkuqbecsmgcfyrti"name="chfkuqbecsmgcfyrti"align="middle"><param name="allowScriptAccess"value="always"><param name="allowFullScreen"value="true"><param name="quality"value="high"><param name="bgcolor"value="#000"><param name="movie"value="http://www.btzx.com.cn/cms/upFile/btzx/ckplayer/ckplayer.swf"><param name="flashvars"value="variable=player&amp;volume=0.8&amp;autoplay=1&amp;live=1&amp;video=http%3A%2F%2F222.82.234.246%3A1935%2Flive%2Fweishi.stream%2Fplaylist.m3u8&amp;playbackrate=1"><embed allowscriptaccess="always"allowfullscreen="true"quality="high"bgcolor="#000"src="http://www.btzx.com.cn/cms/upFile/btzx/ckplayer/ckplayer.swf"flashvars="variable=player&amp;volume=0.8&amp;autoplay=1&amp;live=1&amp;video=http%3A%2F%2F222.82.234.246%3A1935%2Flive%2Fweishi.stream%2Fplaylist.m3u8&amp;playbackrate=1"width="100%"height="100%"id="chfkuqbecsmgcfyrti"name="chfkuqbecsmgcfyrti"align="middle"type="application/x-shockwave-flash"pluginspage="http://www.macromedia.com/go/getflashplayer"></object>',
		object_blank:'../tv/blank.html',
		url: ['http://v.btzx.com.cn:1935/live/weishi.stream/playlist.m3u8','rtmp://v.btzx.com.cn/live/weishi.stream'],
	},
	chonqqing:{
		name:'重庆卫视',
		iframe:'http://www.cbg.cn/live/1ndex.shtml',
		iframe_style:'margin-top: -246px;margin-left: -20px;height: 717px;width: 790px;|left: 25%;position: relative;',	
		url:['http://sjlivecdn9.cbg.cn/202002222156/app_2/_definst_/ls_2.stream/chunklist.m3u8']
	},
	dongfang:{
		name:'东方卫视',
		//官网关闭
		//http://www.dragontv.cn/
	},
	dongnan:{
		name:'东南卫视',
		iframe:'http://live.fjtv.net/setv/',
		iframe_style:'margin-top: -140px;height: 693px;',
		//通过该接口获取真实m3u8地址，报403
		//drm_url:'http://v.fjtv.net/m2o/player/drml.php?url=http%3A%2F%2Fstream5%2Efjtv%2Enet%2Fdnpd%2Fhd%2Flive%2Em3u8',
		object_html:'<object type="application/x-shockwave-flash"data="http://player.hoge.cn/player.swf"width="100%"height="100%"id="m2o_player"style="visibility: visible;"><param name="allowFullScreen"value="true"><param name="bgcolor"value="#000000"><param name="allowscriptaccess"value="always"><param name="flashvars"value="autoplay=1&amp;channelId=5&amp;config=fjtvlive.xml&amp;sidebarMode=7"></object>',
		object_blank:'../tv/blank.html',
	},
	gansu:{
		name:'甘肃卫视',
		iframe:'http://www.gstv.com.cn/folder3/',
		iframe_style:'margin-top: -217px;height: 752px;',
		object_html:'<object type="application/x-shockwave-flash"data="http://player.hoge.cn/player.swf"width="100%"height="100%"id="m2o_player"style="visibility: visible;"><param name="allowFullScreen"value="true"><param name="bgcolor"value="#000000"><param name="allowscriptaccess"value="always"><param name="wmode"value="transparent"><param name="flashvars"value="channelId=2&amp;config=139live.xml&amp;sidebarMode=3&amp;autoplay=1"></object>',
	},
	guangdong:{
		name:'广东卫视',
		iframe:'http://star.gdtv.cn/',
		//通过该接口获取真实m3u8地址，报403
		//drm_url:'http://live.grtn.cn/drm.php?url=http%3A%2F%2Fstream1%2Egrtn%2Ecn%2Fgdws%2Fsd%2Flive%2Em3u8',
		iframe_style:'margin-top: -281px;margin-left: -110px;height: 771px;',		
		object_html:'<object type="application/x-shockwave-flash"data="http://player.hoge.cn/player.swf"width="100%"height="100%"id="m2o_player"style="visibility: visible;"><param name="allowFullScreen"value="true"><param name="bgcolor"value="#000000"><param name="allowscriptaccess"value="always"><param name="wmode"value="transparent"><param name="flashvars"value="channelId=25&amp;config=132live.xml&amp;sidebarMode=3&amp;autoplay=1"></object>',
	},
	guangxi:{
		name:'广西卫视',
		//'X-Frame-Options' : 'deny'
		//iframe:'http://tv.gxtv.cn/tv-1.html',
		object_html:'<object type="application/x-shockwave-flash"id="ArcMediaPlayback"name="ArcMediaPlayback"align="middle" data="http://tv.gxtv.cn/player/ArcMediaPlayback.swf"width="100%"height="100%"><param name="quality"value="high"><param name="bgcolor"value="000000"><param name="allowscriptaccess"value="always"><param name="allowfullscreen"value="true"><param name="wmode"value="opaque"><param name="flashvars"value="src=http://hls.cdn.liangtv.cn/live/0c4ef3a44b934cacb8b47121dfada66c/d7e04258157b480dae53883cc6f8123b.m3u8&amp;encrypted=true&amp;ciphertext=A2CjY%2F3mmpHPYAO6J%2F5dxdfW801TDcqyrTO8Wfxe55IFb9hNitUn6vwKqiowAMx3&amp;autoPlay=true&amp;hideControlBarLiveTracker=true&amp;controlBarAutoHide=false"></object>',
		
	},
	guizhou:{
		name:'贵州卫视',
		//包含https资源，不允许加载
		//iframe:'http://www.gzstv.com/tv/ch01',
		//解析：https://api.gzstv.com/v1/tv/ch01/?remote_address=%20100.125.70.17&fields=description,title,stream_url,image,author
		parse_fun:function(fun){
			$.getJSON('https://api.gzstv.com/v1/tv/ch01/?remote_address=%20100.125.70.17&fields=description,title,stream_url,image,author',function(msg){
				if(typeof fun==='function')fun(msg.stream_url);
			})
		},
	},
	hebei:{
		name:'河北卫视',
		iframe:'http://www.hebtv.com/pc/wlzb',
		iframe_style:'margin-top: -210px;height: 787px;',
		url:['http://weblive.hebtv.com/live/hbws_bq/index.m3u8','http://live5.plus.hebtv.com/hbws/playlist.m3u8'],
	},
	henan:{
		name:'河南卫视',
		iframe:'http://www.hntv.tv/live/index.shtml',		
		//解析http://www.hntv.tv/soms4/servlet/FlashInterfaceServlet?function=GetLiveProgramInfo&channelId=135' 获得meta值
	},
	heilongjiang:{
		name:'黑龙江卫视',
		//原视频无法加载，暂无法测试iframe
		iframe:'http://www.hljtv.com/live/',
		//crossxml加载失败，等待重试
		object_html:'<object type="application/x-shockwave-flash"data="https://playerv1.hoge.cn/player.swf"width="100%"height="100%"id="m2o_player"style="visibility: visible;"><param name="allowFullScreen"value="true"><param name="bgcolor"value="#000"><param name="allowscriptaccess"value="always"><param name="flashvars"value="channelId=3&amp;config=177live.xml&amp;sidebarmode=7&amp;autoplay=1"></object>',
		object_blank:'../tv/blank.html',		
	},
	hubei:{
		name:'湖北卫视',
		//http://news.hbtv.com.cn/app/tv/157
		iframe:'http://app.cjyun.org/video/videojs/index?site_id=10008&live_type=1&id=157&thumb=&next=&autostart=&type=&sid=10008&customid=15&channel=',
		url:['http://live.cjyun.org/hubeitv/s10008-live-hbws.m3u8'],
	},
	hunan:{
		name:'湖南卫视',
		url:['http://36526.hlsplay.aodianyun.com/tv_radio_36526/tv_channel_555.m3u8']
	},
	jilin:{
		name:'吉林卫视',
		iframe:'http://www.jlntv.cn/newpc/wlt/live/index.php?channel_id=9',
		iframe_style:'margin-top: -90px;height: 701px;|height: 110%;',
		object_html:'<object type="application/x-shockwave-flash"data="https://playerv1.hoge.cn/player.swf"width="100%"height="100%"id="m2o_player"style="visibility: visible;"><param name="allowFullScreen"value="true"><param name="bgcolor"value="#000000"><param name="allowscriptaccess"value="always"><param name="flashvars"value="channelId=9&amp;config=123live.xml&amp;sidebarMode=7&amp;autoPlay=1"></object>',
		object_blank:'../tv/blank.html',
	},
	jiangsu:{
		name:'江苏卫视',
		iframe:'http://live.jstv.com/',
		iframe_style:'margin-top: -250px;height: 1000px;margin-left: -55px;',
		url:['http://221.6.85.150:9000/live/jsws_800/jsws_800.m3u8']
	},
	jiangxi:{
		name:'江西卫视',
		iframe:'http://www.jxntv.cn/live/',
		//m3u8地址：http://live.jxtvcn.com.cn/live-jxtv/tv_jxtv1.m3u8?token=fd7bd8059019cc2f145bce5a204e4439&t=1582426602
		//其中token和t均由 jsonp方式请求：https://app.jxntv.cn/Qiniu/liveauth/getAuth.php?t=1582426600
		parse_fun:function(fun){
			$.getJSON('https://app.jxntv.cn/Qiniu/liveauth/getAuth.php',function(msg){
				if(typeof fun==='function')fun(msg.stream_url);
			})
		},
	},
	liaoning:{
		name:'辽宁卫视',
		//
	},
	neimenggu:{
		name:'内蒙古卫视',
		//http://www.nmtv.cn/folder125/folder256/folder469/
	},
	ningxia:{
		name:'宁夏卫视',
		//http://www.nxtv.com.cn/live/wsh/
	},
	qinghai:{
		name:'青海卫视',
		//http://www.qhbtv.com/new_index/live/folder2646/
	},
	shandong:{
		name:'山东卫视',
		//http://v.iqilu.com/live/sdtv/
	},
	shan1xi:{
		name:'山西卫视',
		//http://www.sxrtv.com/live/
	},
	shan3xi:{
		name:'北京卫视',
		//http://live.snrtv.com/
	},
	shenzhen:{
		name:'陕西卫视',
		//https://sztv.cutv.com/dianshi.shtml?id=7867
	},
	sichuan:{
		name:'四川卫视',
		//http://www.sctv.com/live/
		url:'http://m3u8.sctv.com/tvlive/SCTV0/index.m3u8',//有跨域问题
		disable:false,
	},
	tianjin:{
		name:'北京卫视',
	},
	xizang:{
		name:'北京卫视',
		//http://www.vtibet.com/ds/dszb/
		url:['rtmp://video.vtibet.com/masvod/hanyuTV_q1']
	},
	xiamen:{
		name:'厦门卫视',
		//http://live.xmtv.cn/xmstar/		
	},
	xinjiang:{
		name:'新疆卫视',
		//http://www.xjtvs.com.cn/hy/zb/index.shtml
	},
	yunnan:{
		name:'云南卫视',
		//http://live.yntv.cn/v2/index.html
		//'<object vid="137" id="player_area" type="application/x-shockwave-flash" data="http://live.yntv.cn/v2/defaultSkin/Loader.swf" style=" width: 100%; height: 100%;" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,47,0"><param value="http://live.yntv.cn/v2/defaultSkin/Loader.swf" name="movie"><param value="true" name="allowfullscreen"><param value="always" name="allowscriptaccess"><param value="direct" name="wmode"><param value="Channel_ID=137&amp;Skin_ID=&amp;" name="flashvars"><embed id="player_area_embed" src="http://live.yntv.cn/v2/defaultSkin/Loader.swf" width="100%" height="100%" quality="high" type="application/x-shockwave-flash" wmode="direct" allowscriptaccess="always" allowfullscreen="true" flashvars="Channel_ID=137&amp;Skin_ID=&amp;" pluginspage="http://www.macromedia.com/go/getflashplayer"></object>'
		//'<embed id="player_area_embed"src="http://live.yntv.cn/v2/defaultSkin/Loader.swf"width="100%"height="100%"quality="high"type="application/x-shockwave-flash"wmode="direct"allowscriptaccess="always"allowfullscreen="true"flashvars="Channel_ID=137&amp;Skin_ID=&amp;"pluginspage="http://www.macromedia.com/go/getflashplayer">'
	},
	zhejiang:{
		name:'浙江卫视',
		//http://tv.cztv.com/live1/ http://v.xigo.tv/test/
		url:['http://ali.m.l.cztv.com/channels/lantian/channel01/1080p.m3u8'],
		ss:[360,720,1080]
	},
	sansha:{
		name:'三沙卫视',
		//http://tv.hnntv.cn/live/sslive/
		//解析http://tv.hnntv.cn/m2o/player/drmx.php?url=http%3A%2F%2Fstream3%2Ehnntv%2Ecn%2Fssws%2Fsd%2Flive%2Em3u8
		//playByVideoHtml('<object type="application/x-shockwave-flash" data="http://player.hoge.cn/player.swf" width="100%" height="100%" id="m2o_player" style="visibility: visible;"><param name="allowFullScreen" value="true"><param name="bgcolor" value="#000000"><param name="allowscriptaccess" value="always"><param name="flashvars" value="width=660&amp;height=500&amp;channelId=7&amp;config=188live.xml&amp;sidebarMode=7"></object>')
	}
}

//解析真实m3u8地址：广东卫视、三沙卫视
function loadByDrm(js_url){
	corsApi(js_url,function(msg){
		var m3u8=decodeURIComponent(msg);
		if(m3u8.startsWith('://')){
			m3u8=m3u8.substr(3)
		}
		console.log(m3u8)
	})
}

//通过Sign获取真实m3u8地址：
function loadBySign(tv_channel){
	if(!tv_channel.url){//没有url的时候，才会去请求，请求以后会写入url值
		corsApi(tv_channel.sign_url,'post', tv_channel.postData,function(msg){
			var fields=tv_channel.url_format_field;
			var url=tv_channel.url_format;
			for(var i=0;i<fields.length;i++){
				url=url.replace('%s',eval('msg.'+fields[i]));
			}
			tv_channel.url=url;
		})
	}
}


//老婆专属频道
var loverchannels={
	name:'老婆专属频道',
	group:{
		hunan:{//湖南卫视
			name:'湖南卫视',
			source:[
				{
					name:'北邮-高清',
					url:'http://ivi.bupt.edu.cn/hls/hunanhd.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'咪咕高清源1',
					url:'hunwshd1',
					type:'byMigu',
					mode:'pc',
				},
				{
					name:'咪咕高清源2',
					url:'hunwshd2',
					type:'byMigu',
					mode:'pc',
				},
				{
					name:'咪咕高清源3',
					url:'hunwshd3',
					type:'byMigu',
					mode:'pc',
				},
				{
					name:'CCTV源',
					url:'hunan',
					type:'byCCTV',
					mode:'pc',
				},
				{
					group:true,
					url:'http://www.tvsbar.com/hntv/317.html',
					type:'tvsbar.com',
					mode:'pc|mobile',
				},
			],
		},
		zhejiang:{//浙江卫视
			name:'浙江卫视',
			source:[
				{
					name:'hao5.net源',
					url:'http://cctvtxyh5ca.liveplay.myqcloud.com/wstv/011_2/index.m3u8',
					type:'hao5.net',
					mode:'pc',
				},
				{
					name:'北邮-高清',
					url:'http://ivi.bupt.edu.cn/hls/zjtv.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'CCTV源',
					url:'zhejiang',
					type:'byCCTV',
					mode:'pc',
				},
				{
					group:true,
					url:'http://www.tvsbar.com/zjtv/1601.html',
					type:'tvsbar.com',
					mode:'pc|mobile',
				},
			],
		},
		dongfang:{//东方卫视
			name:'东方卫视',
			source:[
				{
					name:'腾讯云2',
					url:'http://cctvksh5ca.v.kcdnvip.com/wstv/dongfang_2/index.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'kksmg',
					url:'http://hw-stream.kksmg.com/live/dtvf76c11e8.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'hao5.net源',
					url:'http://cctvtxyh5ca.liveplay.myqcloud.com/wstv/dongfang_2/index.m3u8',
					type:'hao5.net',
					mode:'pc',
				},
				{
					name:'北邮',
					url:'http://ivi.bupt.edu.cn/hls/dftv.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'北邮-高清',
					url:'http://ivi.bupt.edu.cn/hls/dfhd.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'咪咕源',
					url:'dfws',
					type:'byMigu',
					mode:'pc',
				},
				{
					name:'CCTV源',
					url:'dongfang',
					type:'byCCTV',
					mode:'pc',
				},
				{
					group:true,
					url:'http://www.tvsbar.com/smg/874.html',
					type:'tvsbar.com',
					mode:'pc|mobile',
				},
			],
		},
		jiangsu:{//江苏卫视
			name:'江苏卫视',
			source:[
				{
					name:'上海电信-512k',
					url:'http://by4.nty.tv189.cn/tm-jswshd-512k.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'上海电信-800k',
					url:'http://by4.nty.tv189.cn/tm-jswshd-800k.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'上海电信-4000k',
					url:'http://by4.nty.tv189.cn/tm-jswshd-4000k.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'云南广电',
					url:'http://www.ynbit.cn:1935/jstv/livestream/playlist.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'GSTV',
					url:'http://221.6.85.150:9000/live/jsws_800/jsws_800.m3u8',
					mode:'pc',
				},
				{
					name:'上海电信',
					url:'http://hebcx.chinashadt.com:2036/live/10006.stream/playlist.m3u8',
					mode:'pc',
				},
				{
					name:'zjkp',
					url:'http://116.199.5.51:8114/index.m3u8?FvSeid=1&Fsv_ctype=LIVES&Fsv_otype=1&Provider_id=&Pcontent_id=.m3u8&Fsv_chan_hls_se_idx=5',
					mode:'pc',
				},
				{
					name:'ynntv',
					url:'http://www.ynbit.cn:1935/jstv/livestream/playlist.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'lnnt',
					url:'http://61.161.250.43:8114/hls/index.m3u8?FvSeid=1&Fsv_ctype=lives&Fsv_otype=1&Provider_id=&Pcontent_id=&Fsv_chan_hls_se_idx=1',
					mode:'pc|mobile',
				},
				{
					name:'QNCUCC',
					url:'http://gzqn.chinashadt.com:1935/live/JSWS.stream_360p/playlist.m3u8',
					mode:'pc',
				},
				{
					name:'北邮',
					url:'http://ivi.bupt.edu.cn/hls/jstv.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'北邮-高清',
					url:'http://ivi.bupt.edu.cn/hls/jshd.m3u8',
					mode:'pc|mobile',
				},
				{
					name:'咪咕源',
					url:'jsws',
					type:'byMigu',
					mode:'pc',
				},
				{
					group:true,
					url:'http://www.tvsbar.com/jstv/608.html',
					type:'tvsbar.com',
					mode:'pc|mobile',
				},
			],
		},
	}
}

//加载老婆专属频道
function loadLoverChannels(){
	clearlist();
	var tv_list=[];
	for(var ch in loverchannels.group){
		var group=loverchannels.group[ch];
		for(var i=0;i<group.source.length;i++){
			if(isMobile && group.source[i].mode.indexOf('mobile')==-1){//移动端访问,要屏蔽掉非mobile的源
				continue;
			}
			if(group.source[i].group){
				var _list=[];
				if(group.source[i].type==='tvsbar.com'){
					_list=fromTvsbar(group.source[i].url);
				//}else if(group.source[i].type==='66zhibo.net'){
				//	load66zhibo(group.source[i].url,false);
				}
				for(var c in _list){
					_list[c].group_title=group.name;
				}
				tv_list=tv_list.concat(_list);
			}else{
				tv_list.push({
					name:group.source[i].name,
					url: group.source[i].url,
					type:group.source[i].type,
					group_title:group.name,
				});
			}
		}
	}
	load(tv_list)
}

//获取节目表
function showEpgInfo(channel){
	if(!channel||channel==='')return;
	var date = dateFormat('YYYYmmdd', new Date());
	var serviceId=channel.startsWith('cctv')?'tvcctv':'shiyi';
	$.getJSON('http://api.cntv.cn/epg/getEpgInfoByChannelNew?c='+channel+'&serviceId='+serviceId+'&d='+date+'&cb=?',function(msg){
		var showName = (eval('msg.data.'+channel+'.isLive'));
		if(showName){
			document.title = '电视直播【'+showName+'】';
		}else{
			document.title = '电视直播';
		}
	})
}
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        'Y+': date.getFullYear().toString(),        // 年
        'm+': (date.getMonth() + 1).toString(),     // 月
        'd+': date.getDate().toString(),            // 日
        'H+': date.getHours().toString(),           // 时
        'M+': date.getMinutes().toString(),         // 分
        'S+': date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        };
    };
    return fmt;
}
function fromTvsbar(url){
	//解析所有线路
	function _lines(value){
		var parser=new DOMParser();
		var htmlDoc=parser.parseFromString(value, 'text/html');
		var m3u8_links=$(htmlDoc).find('#detail-content li a');
		var tab_links=$(htmlDoc).find('#detail-tab li a');
		var tv_list=[];
		m3u8_links.each(function(i,e){
			var group_title=tab_links.eq($(e).parent().parent().index()).text();
			if(isMobile && group_title.startsWith('PC'))return;//如果移动端访问，去掉限PC的线路
			tv_list.push({
				name:e.title,
				url:$(e).attr('href'),
				group_title:group_title,
				type:'tvsbar.com'
			})
		})
		return tv_list;
	}
	//随机使用跨域请求api
	var result=syncGetApi(url, 'html');
	return _lines(result);
}
