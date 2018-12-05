//---------------------------------------------------------------------
//     【以下为各特定网站解析+播放相关】依赖tv.js
//
//		直播解析网站：
//		http://tv.cntv.cn/live/shenzhen //中央电视台
//		http://www.kankanzhibo.com/pindaodaquan/ //看看直播
//		http://www.hao5.net/ //直播网
//		http://www.haoqu.net/ http://www.66zhibo.net/ //66直播
//		http://m.miguvideo.com/wap/resource/migu/live/live-list.jsp 咪咕视频源
//		http://www.zuiaishiting.com/tv/ //最爱视听
//		http://www.zhiboba.org/dianshitai/ //CC直播吧
//		http://www.meitiantv.com/tv/ //直播网
//		https://live.wasu.cn/ //华数TV
//		http://www.tvsbar.com/	//爱视传媒
//		http://www.cietv.com/ //易视网
//		https://www.tvmao.com/ //电视猫
//		CCTV直播，可回看：
//		http://www.kankanzhibo.com/player/embed.php?playurl=http://player.cntv.cn/standard/live_HLSDRM20180606.swf?v=180.171.5.8.9.6.3.9&vdnSID=&vdnIP=&vdnCountryCode=&vdnProvinceCode=&vdnCityCode=&vdnISPCode=&tai=liaoning&ChannelID=dongfang&videoTVChannel=liaoning&P2PChannelID=pd://cctv_p2p_hdliaoning
//
//---------------------------------------------------------------------
function register(){
	//注册各视频源解析播放处理
	register_playfunction('haoqu.net', play_haoqu);
	register_playfunction('tvsbar.com', play_tvsvar);
	register_playfunction('66zhibo.net', play_66zhibo);
	register_playfunction('byMigu', play_migu);
	register_playfunction('byCCTV', function(channel){//仅直播
		resetIframe('../tv/cctv.html?channel='+channel);
	});
	register_playfunction('byCCTVBack', function(channel){//回看+直播
		//var url='http://www.kankanzhibo.com/player/embed.php?playurl=http://player.cntv.cn/standard/live_HLSDRM20180606.swf?tai=btv1&ChannelID='+channel+'&videoTVChannel='+channel+'&P2PChannelID=pd://cctv_p2p_hd'+channel;
		//resetIframe(url);
		resetIframe('../tv/cctv_back.html?channel='+channel);
	});
	register_playfunction('hao5.net', function(m3u8){
		//player.src='../video/play.html?url='+encodeURIComponent(m3u8);
		//直接加载m3u8比较慢，用原始的快很多
		playByEmbed(m3u8);
	});
}
register();

//好趣网：http://www.haoqu.net/
function loadHaoqu(url,clear=true){
	asyncApi(url,function(msg){
		if(!msg)return;
		var list = msg.match(/<li data-player="([\d]+)" [^>]*><span class="s">([^<]*)<\/span><\/li>/g);
		var tv_list=[];
		for(var i=0;i<list.length;i++){
			var item=list[i].match(/<li data-player="([\d]+)" [^>]*><span class="s">([^<]*)<\/span><\/li>/);
			var url=item[1];
			var name = item[2];
			if(name.indexOf('回看')>0)continue;//暂时跳过此项
			if(name.indexOf('时移')>0)continue;//暂时跳过此项
			tv_list.push({type:'haoqu.net',name:name,url:url});
		}
		load(tv_list,clear);
	},'html');	
}
//播放haoqu.net源
function play_haoqu(id){
	function _play(msg){
		var signal = msg.match(/signal\s*=\s*'([^']*)'/g)[0];
		var item=signal.match(/signal\s*=\s*'([^']*)'/)[1].split('$');//会拆分为频道源、m3u8_url、类型
		var name = item[0];
		var m3u8_url=item[1];
		var type=item[2];
		if(type==='iframe'){
			if(m3u8_url.indexOf('.m3u8')>0){
				m3u8_url = m3u8_url.replace(/[^=]*=/,'');
				playByM3u8(m3u8_url);
			}else{
				$('iframe').contents().find('body').html(syncGetApi(m3u8_url,'html'))
			}
		}else if(type==='flv'){
			playByEmbed(m3u8_url);
		}else{
			playByM3u8(m3u8_url);
		}
	}
	syncGetApi('http://www.haoqu.net/e/extend/tv.php?id='+id, _play, 'html');
}

//66直播网：http://www.66zhibo.net/
function load66zhibo(url,clear=true){
	asyncApi(url,function(msg){
		if(!msg)return;
		var list = msg.match(/<li data-player="([\d]+)" [^>]*><span class="s">([^<]*)<\/span><\/li>/g);
		var paras=msg.match(/gid='\d+',\s*v='[^']*'/)[0];
		var tv_list=[];
		for(var i=0;i<list.length;i++){
			var item=list[i].match(/<li data-player="([\d]+)" [^>]*><span class="s">([^<]*)<\/span><\/li>/);

			var url=item[1]+'&'+paras.replace(',','&').replace(/'/g,'');
			var name = item[2];
			if(name.indexOf('回看')>0)continue;//暂时跳过此项
			if(name.indexOf('时移')>0)continue;//暂时跳过此项
			tv_list.push({type:'66zhibo.net',name:name,url:url});
		}
		load(tv_list,clear);
	},'html');	
}

//播放haoqu.net源
function play_66zhibo(id){
	function _play(msg){
		var signal = msg.match(/signal\s*=\s*'([^']*)'/g)[0];
		var item=signal.match(/signal\s*=\s*'([^']*)'/)[1].split('$');//会拆分为频道源、m3u8_url、类型
		var name = item[0];
		var m3u8_url=item[1];
		var type=item[2];
		if(type==='iframe'){
			if(m3u8_url.indexOf('.m3u8')>0){
				m3u8_url = m3u8_url.replace(/[^=]*=/,'');
				playByM3u8(m3u8_url);
			}else{
				$('iframe').contents().find('body').html(syncGetApi(m3u8_url,'html'))
			}
		}else if(type==='flv'){
			playByEmbed(m3u8_url);
		}else{
			playByM3u8(m3u8_url);
		}
	}
	syncGetApi('http://www.66zhibo.net/e/extend/tv.php?id='+id, _play, 'html');
}

//爱视传媒网：http://www.tvsbar.com/ 
function loadTvsbar(url,clear=true){
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
		load(tv_list,clear);
	}
	//随机使用跨域请求api
	asyncApi(url, _lines, 'html');
}

//播放http://www.tvsbar.com/源
function play_tvsvar(id){
	function _play(value){
		var parser=new DOMParser();
		var htmlDoc=parser.parseFromString(value, 'text/html');
		var text=$(htmlDoc).find('#cms_player script').first().text();
		try{eval(text)}catch(err){}
		switch(cms_player.name){
			case '5g':
				//参考：http://www.tvsbar.com/Public/player/5g.js，直接使用对方的play页面
				//playByIframe('http://www.tvsbar.com/Public/player/video.html?videourl='+cms_player.url)
				//break;
			case '4g':
				//参考：http://www.tvsbar.com/Public/player/4g.js，加载video+source标签
				//playByVideoHtml('<video id="ckplayer_a1" width="100%" height="100%"  controls="controls" autoplay="autoplay"><source src="'+cms_player.url+'"></video>');
				//break;
			case 'jw':
				//参考：http://www.tvsbar.com/Public/player/jw.js
				//直接通过iframe src='http://www.tvsbar.com/Public/player/m3u8.html?id='+cms_player.url进行加载
			case 'jwplayer'://m3u8
				//参考：http://www.tvsbar.com/Public/player/jwplayer.js
				//直接通过iframe src='http://api.5itv.org/public/player/ckx.html?id='+cms_player.url进行加载
				play(cms_player.url);
				break;
			
			case 'ckplayer':
				//参考：http://www.tvsbar.com/Public/player/ckplayer.js，
				//直接通过iframe src='http://api.5itv.org/tv/video/play.html?id='+cms_player.url+'&t=flv'进行加载
			case 'aliprism'://阿里云
				//参考：http://www.tvsbar.com/Public/player/aliprism.js，
				//直接通过iframe src='http://www.tvsbar.com/Public/player/aliprism.html?id='+cms_player.url进行加载
			case 'swf'://flash
				//参考：http://www.tvsbar.com/Public/player/swf.js
				//通过直接加载embed标签
				playByEmbed(cms_player.url);
				break;
				
			case 'tz':
				//参考：http://www.tvsbar.com/Public/player/tz.js，直接就是外展引用
				playByIframe(cms_player.url);
				break;
				
			case 'cntv':
				//cctv各频道的线路：http://www.tvsbar.com/Public/player/cntv/cctv.js
				playByIframe('http://www.tvsbar.com/Public/player/cntv/tv/cctv.html?id='+cms_player.url);
				break;
				
			case 'hbgd':
				//部分频道线路：http://api.5itv.org/tv/hbgd.js
				playByIframe('http://api.5itv.org/tv/hbgd.html?id='+cms_player.url);
				break;
				
			default:
				//自动加载对应js，并加载最终的iframe
				asyncApi('http://www.tvsbar.com/Public/player/'+cms_player.name+'.js',function(data){
					eval(data.replace(new RegExp('document.write','ig'), 'window.ifmsrc='));
					ifmsrc=ifmsrc.replace(/\s+src="\//,' src="http://www.tvsbar.com/');
					console.log(ifmsrc)
					playByVideoHtml(ifmsrc);
				},'html');
				break;
		}
	}
	syncGetApi('http://www.tvsbar.com'+id, _play, 'html')
}


//播放咪咕源
function play_migu(_channel,ele){
	var contId=migu(_channel);
	//超、高、标清接口asyncApi：http://webapi.miguvideo.com/gateway/playurl/v3/play/playurl?contId=608807420&clientId=migu&rateType=3
	//标清接口$.getJSON：http://h5.miguvideo.com/playurl/v1/play/playurlh5?contId=608807420&clientId=migu&rateType=2
	//rateType:1-标清,2-高清,3-超清，参数中添加，会选择最高清晰度的那个,不过超清太卡了，默认改为高清吧
	asyncApi('http://webapi.miguvideo.com/gateway/playurl/v3/play/playurl?rateType=3&clientId=migu&contId='+contId,function(msg){
		if(msg.code ==='200'){
			var m3u8_url = msg.body.urlInfo.url.replace('http://h5live.gslb.cmvideo.cn','http://mgzb.live.miguvideo.com:8088').replace('http://gslbmgsplive.miguvideo.com','http://mgzb.live.miguvideo.com:8088');
			playByEmbed(m3u8_url);
		}else{
			alert(msg.message);
			if($(ele).parent('dd').next().length>0) $(ele).parent('dd').next().children('a').trigger('click');
			ele.remove();
		}
	},'json')
}

//加载migu.js，用于获取咪咕的视频直播资源,数据来源如下：
//http://www.hao5.net/app/migu.js
//https://www.right.com.cn/forum/forum.php?mod=viewthread&tid=845178
function migu(tvurl){
	var contId;
	if(tvurl=='cctv1'){contId='608807427'} //CCTV1综合
	if(tvurl=='cctv1hd'){contId='608807420'} //CCTV1综合高清
	if(tvurl=='cctv2'){contId='635492309'} //CCTV2财经
	if(tvurl=='cctv2hd'){contId='631780532'} //CCTV2财经高清
	if(tvurl=='cctv3'){contId='609017193'} //CCTV3综艺
	if(tvurl=='cctv3hd'){contId='624878271'} //CCTV3综艺高清
	if(tvurl=='cctv4'){contId='608807424'} //CCTV4中文国际
	if(tvurl=='cctv4hd'){contId='631780421'} //CCTV4中文国际高清
	if(tvurl=='cctv5'){contId='641886657'} //CCTV5体育
	if(tvurl=='cctv5hd'){contId='641886683'} //CCTV5体育高清
	if(tvurl=='cctv5p'){contId='641886733'} //CCTV5+体育赛事
	if(tvurl=='cctv5phd'){contId='641886773'} //CCTV5+体育赛事高清
	if(tvurl=='cctv6'){contId='608919883'} //CCTV6电影
	if(tvurl=='cctv6hd'){contId='624878396'} //CCTV6电影高清
	if(tvurl=='cctv7'){contId='609018153'} //CCTV7军事农业
	if(tvurl=='cctv8'){contId='609154254'} //CCTV8电视剧
	if(tvurl=='cctv8hd'){contId='624878356'} //CCTV8电视剧高清
	if(tvurl=='cctv9'){contId='608920109'} //CCTV9纪录
	if(tvurl=='cctv10'){contId='608880731'} //CCTV10科教
	if(tvurl=='cctv10hd'){contId='624878405'} //CCTV10科教高清
	if(tvurl=='cctv11'){contId='609017121'} //CCTV11戏曲
	if(tvurl=='cctv12'){contId='609017191'} //CCTV12社会与法
	if(tvurl=='cctv13'){contId='608807423'} //CCTV13新闻
	if(tvurl=='cctv14'){contId='609017204'} //CCTV14少儿
	if(tvurl=='cctv14hd'){contId='624878440'} //CCTV14少儿高清
	if(tvurl=='cctv15'){contId='608807408'} //CCTV15音乐
	if(tvurl=='cctv17'){contId='660321844'} //CCTV15音乐
	if(tvurl=='gfjs'){contId='623338073'} //CCTV国防军事
	if(tvurl=='hjjc'){contId='623364608'} //CCTV怀旧剧场
	if(tvurl=='fyjc'){contId='623338051'} //CCTV风云剧场
	if(tvurl=='fyyy'){contId='623338072'} //CCTV风云音乐
	if(tvurl=='sjdl'){contId='623338083'} //CCTV世界地理
	if(tvurl=='whjp'){contId='623338084'} //CCTV文化精品
	if(tvurl=='fxzl'){contId='630310927'} //CCTV发现之旅
	if(tvurl=='fyzq'){contId='621984939'} //CCTV风云足球
	if(tvurl=='ystq'){contId='603842910'} //CCTV央视台球
	if(tvurl=='gefwq'){contId='621984921'} //CCTV高尔夫网球
	if(tvurl=='cgtn'){contId='609017205'} //CGTN
	if(tvurl=='cgtnjl'){contId='609006487'} //CGTN纪录
	if(tvurl=='cgtna'){contId='609154345'} //CGTN阿拉伯语
	if(tvurl=='cgtnf'){contId='609006476'} //CGTN法语
	if(tvurl=='cgtne'){contId='609006450'} //CGTN西班牙语
	if(tvurl=='cgtnr'){contId='609006446'} //CGTN俄语
	if(tvurl=='cetv1'){contId='649531772'} //CETV1中教1台
	if(tvurl=='cetv1hd'){contId='649531734'} //CETV1中教1台高清
	if(tvurl=='cetv2'){contId='649532169'} //CETV2中教2台
	if(tvurl=='cetv3'){contId='649531756'} //CETV3中教3台
	if(tvurl=='cetv4'){contId='649531725'} //CETV4中教4台

	if(tvurl=='bjws'){contId='630287661'} //北京卫视
	if(tvurl=='bjws2'){contId='609154074'} //北京卫视
	if(tvurl=='bjwshd'){contId='630287636'} //北京卫视高清
	if(tvurl=='dfws'){contId='651625930'} //东方卫视
	if(tvurl=='cqws'){contId='630288006'} //重庆卫视
	if(tvurl=='tjws'){contId='631094458'} //天津卫视
	if(tvurl=='tjwshd'){contId='631159184'} //天津卫视高清
	if(tvurl=='hljws'){contId='630288601'} //黑龙江卫视
	if(tvurl=='hljwshd'){contId='608779861'} //黑龙江卫视
	if(tvurl=='jlws'){contId='630288397'} //吉林卫视
	if(tvurl=='lnws'){contId='623583504'} //辽宁卫视
	if(tvurl=='lnwshd'){contId='630291707'} //辽宁卫视高清
	if(tvurl=='nmws'){contId='630287015'} //内蒙古卫视
	if(tvurl=='nxws'){contId='630287436'} //宁夏卫视
	if(tvurl=='gsws'){contId='630287549'} //甘肃卫视
	if(tvurl=='qhws'){contId='630287272'} //青海卫视
	if(tvurl=='sxws'){contId='630287233'} //陕西卫视
	if(tvurl=='hbws'){contId='630292528'} //河北卫视
	if(tvurl=='sxiws'){contId='630289043'} //山西卫视
	if(tvurl=='ahws'){contId='630971260'} //安徽卫视
	if(tvurl=='ahwshd'){contId='644933992'} //安徽卫视高清
	if(tvurl=='hnws'){contId='635489820'} //河南卫视
	if(tvurl=='hubws'){contId='630288760'} //湖北卫视
	if(tvurl=='hubwshd'){contId='630292423'} //湖北卫视高清
	if(tvurl=='hunwshd1'){contId='619858170'} //湖南卫视高清
	if(tvurl=='hunwshd2'){contId='621826681'} //湖南卫视高清
	if(tvurl=='hunwshd3'){contId='609153594'} //湖南卫视高清
	if(tvurl=='jxws'){contId='630290852'} //江西卫视
	if(tvurl=='jsws'){contId='623899540'} //江苏卫视
	if(tvurl=='jswshd'){contId='623899368'} //江苏卫视高清
	if(tvurl=='dnws'){contId='651642156'} //东南卫视
	if(tvurl=='xmws'){contId='630285654'} //厦门卫视
	if(tvurl=='gdws'){contId='608831538'} //广东卫视
	if(tvurl=='gdwshd'){contId='608831231'} //广东卫视高清
	if(tvurl=='szws'){contId='624303317'} //深圳卫视
	if(tvurl=='szwshd'){contId='624303319'} //深圳卫视高清
	if(tvurl=='gxws'){contId='634055160'} //广西卫视
	if(tvurl=='ynws'){contId='630291417'} //云南卫视
	if(tvurl=='gzws'){contId='631094827'} //贵州卫视
	if(tvurl=='scws'){contId='630288361'} //四川卫视
	if(tvurl=='xjws'){contId='635385783'} //新疆卫视
	if(tvurl=='btws'){contId='630288004'} //兵团卫视
	if(tvurl=='xzws'){contId='630291593'} //西藏卫视
	if(tvurl=='lyws'){contId='633215355'} //旅游卫视

	if(tvurl=='bjty'){contId='641874369'} //北京体育
	if(tvurl=='cmpd'){contId='637445057'} //车迷频道
	if(tvurl=='shdy'){contId='637444975'} //四海钓鱼
	if(tvurl=='izy'){contId='608793463'} //i综艺
	if(tvurl=='inyt'){contId='608796940'} //in乐台
	if(tvurl=='eyl'){contId='608796678'} //e娱乐

	if(tvurl=='dfdy'){contId='623674834'} //东方电影高清
	if(tvurl=='dycj'){contId='601234494'} //第一财经
	if(tvurl=='dycj2'){contId='608780988'} //第一财经
	if(tvurl=='shxwzh'){contId='624303015'} //上海新闻综合
	if(tvurl=='shxwzhhd'){contId='617290046'} //上海新闻综合高清
	if(tvurl=='shxwzhhd2'){contId='617290050'} //上海新闻综合高清
	if(tvurl=='shdsj'){contId='618954718'} //上海电视剧
	if(tvurl=='shdsjhd'){contId='617290047'} //上海电视剧高清
	if(tvurl=='shyl'){contId='624303013'} //上海娱乐
	if(tvurl=='shylhd'){contId='617289988'} //上海娱乐高清
	if(tvurl=='shxs'){contId='618894190'} //上海星尚
	if(tvurl=='shxs2'){contId='618954743'} //上海星尚
	if(tvurl=='shxshd'){contId='617289989'} //上海星尚高清
	if(tvurl=='shxshd2'){contId='617289991'} //上海星尚高清
	if(tvurl=='shysrw'){contId='618894165'} //上海艺术人文
	if(tvurl=='shysrw2'){contId='618894134'} //上海艺术人文
	if(tvurl=='shysrw3'){contId='618954640'} //上海艺术人文
	if(tvurl=='shjs'){contId='618954695'} //上海纪实
	if(tvurl=='shjs2'){contId='617289997'} //上视纪实
	if(tvurl=='shjshd'){contId='617289999'} //上视纪实高清
	if(tvurl=='shics'){contId='618894223'} //上海ICS
	if(tvurl=='shics2'){contId='618954688'} //上海ICS
	if(tvurl=='xdkt'){contId='618894200'} //炫动卡通
	if(tvurl=='xdkt2'){contId='618894210'} //炫动卡通
	if(tvurl=='xdkt3'){contId='618954663'} //炫动卡通
	if(tvurl=='fztd'){contId='631095330'} //法治天地
	if(tvurl=='yxfy'){contId='623674816'} //游戏风云 
	if(tvurl=='qjs'){contId='623674483'} //全纪实
	if(tvurl=='wxty'){contId='610998357'} //五星体育
	if(tvurl=='xsj'){contId='623674901'} //新视觉

	if(tvurl=='nhxw'){contId='639176324'} //宁河新闻
	if(tvurl=='nhxw2'){contId='625586032'} //宁河新闻

	if(tvurl=='zxzh'){contId='639176324'} //忠县综合
	if(tvurl=='djzh'){contId='630333405'} //垫江综合

	if(tvurl=='gsjj'){contId='630641844'} //甘肃经济
	if(tvurl=='gsds'){contId='630641756'} //甘肃都市
	if(tvurl=='gsgg'){contId='630641625'} //甘肃公共
	if(tvurl=='gsse'){contId='630641633'} //甘肃少儿
	if(tvurl=='gswhys'){contId='630641855'} //甘肃文化影视
	if(tvurl=='gspzsh'){contId='630641529'} //甘肃品质生活
	if(tvurl=='gsydds'){contId='630641593'} //甘肃移动电视
	if(tvurl=='zxzh'){contId='637620045'} //漳县综合

	if(tvurl=='mxxwzh'){contId='644781881'} //眉县新闻综合

	if(tvurl=='sdetv'){contId='609154353'} //SDETV山东教育

	if(tvurl=='sxjjzx'){contId='628472942'} //山西经济资讯
	if(tvurl=='sxys'){contId='628472887'} //山西影视
	if(tvurl=='sxkj'){contId='628472792'} //山西科教
	if(tvurl=='sxgg'){contId='628472786'} //山西公共
	if(tvurl=='sxse'){contId='628472619'} //山西少儿
	if(tvurl=='sxhh'){contId='628473059'} //山西黄河
	if(tvurl=='zghh'){contId='628472544'} //中国黄河

	if(tvurl=='esxwzh'){contId='638811570'} //恩施新闻综合
	if(tvurl=='esgg'){contId='638811568'} //恩施公共
	if(tvurl=='cb1'){contId='638811454'} //赤壁-1
	if(tvurl=='cb2'){contId='638811534'} //赤壁-2
	if(tvurl=='ezxw'){contId='638811390'} //鄂州新闻
	if(tvurl=='ezgg'){contId='638561534'} //鄂州公共
	if(tvurl=='syxw'){contId='632898786'} //十堰新闻
	if(tvurl=='sygg'){contId='632898816'} //十堰公共
	if(tvurl=='syjjly'){contId='632898808'} //十堰经济旅游
	if(tvurl=='cyzh'){contId='640773533'} //长阳综合
	if(tvurl=='xggg'){contId='638557579'} //孝感公共
	if(tvurl=='xtshwt'){contId='632898853'} //仙桃生活文体
	if(tvurl=='snjtv'){contId='640773522'} //神农架电视台

	if(tvurl=='jyjs'){contId='623604663'} //金鹰纪实
	if(tvurl=='ldzh'){contId='631951605'} //娄底综合
	if(tvurl=='ldgg'){contId='625935114'} //娄底公共
	if(tvurl=='hhxwzh'){contId='645517209'} //怀化新闻综合
	if(tvurl=='hhgg'){contId='645517223'} //怀化公共
	if(tvurl=='hzxwzh'){contId='650216404'} //汉中新闻综合
	if(tvurl=='hzgg'){contId='650217163'} //汉中公共
	if(tvurl=='hzjy'){contId='650216862'} //汉中教育

	if(tvurl=='jscs'){contId='626064714'} //江苏城市
	if(tvurl=='jszy'){contId='626065193'} //江苏综艺
	if(tvurl=='jsggxw'){contId='626064693'} //江苏公共新闻
	if(tvurl=='jsjy'){contId='628008321'} //江苏教育
	if(tvurl=='jsgj'){contId='626064674'} //江苏国际
	if(tvurl=='jsys'){contId='626064697'} //江苏影视
	if(tvurl=='jstyxx'){contId='626064707'} //江苏体育休闲
	if(tvurl=='jsxx'){contId='626881786'} //江苏学习
	if(tvurl=='hxgw'){contId='626064668'} //好享购物
	if(tvurl=='jslz'){contId='626064675'} //江苏靓妆
	if(tvurl=='ymkt'){contId='626064703'} //优漫卡通
	if(tvurl=='njxwzh'){contId='629243982'} //南京新闻综合
	if(tvurl=='njkj'){contId='629243936'} //南京教科
	if(tvurl=='nj18'){contId='629243989'} //南京十八
	if(tvurl=='wxxwzh'){contId='639737327'} //无锡新闻综合
	if(tvurl=='czxwzh'){contId='639731892'} //常州新闻综合
	if(tvurl=='yzxwzh'){contId='639731888'} //扬州新闻综合
	if(tvurl=='szxwzh'){contId='639731952'} //苏州新闻综合
	if(tvurl=='tzxwzh'){contId='639731818'} //泰州新闻综合
	if(tvurl=='ycxwzh'){contId='639731825'} //盐城新闻综合
	if(tvurl=='haxwzh'){contId='639731826'} //淮安新闻综合
	if(tvurl=='zjxwzh'){contId='639731783'} //镇江新闻综合
	if(tvurl=='xzxwzh'){contId='639731747'} //徐州新闻综合
	if(tvurl=='sqxwzh'){contId='639731832'} //宿迁新闻综合
	if(tvurl=='lygxf'){contId='639731715'} //连云港先锋

	if(tvurl=='zjse'){contId='611318244'} //浙江少儿
	if(tvurl=='hzys'){contId='611373913'} //杭州影视
	if(tvurl=='hzzh'){contId='611354772'} //杭州综合

	if(tvurl=='gdty'){contId='624303497'} //广东体育
	if(tvurl=='jjkt'){contId='614952364'} //嘉佳卡通

	if(tvurl=='gyds'){contId='639177932'} //贵阳都市
	if(tvurl=='gyfz'){contId='639176544'} //贵阳法制
	if(tvurl=='gylysh'){contId='639177347'} //贵阳旅游生活

	if(tvurl=='lczh'){contId='638811394'} //隆昌综合
	if(tvurl=='zgjy'){contId='649531734'} //中国教育
	return contId;
}



//解析中国邮电大学直播导航页面内容
function loadYoudian(){
	/*
	 * 北京邮电大学（官方）：http://ivi.bupt.edu.cn/
	 */
	asyncApi('http://ivi.bupt.edu.cn/',function(msg){
		var list = msg.match(/<p>.*<\/p>\s+<a .*<\/a>&nbsp;\s+<a .* href="[^"]*".*>移动端<\/a>/g);
		var tv_list=[];
		for(var i=0;i<list.length;i++){
			var item=list[i].match(/<p>(.*)<\/p>\s+<a .*<\/a>&nbsp;\s+<a .* href="([^"]*)".*>移动端<\/a>/);
			var name=item[1];
			var m3u8_url = 'http://ivi.bupt.edu.cn'+item[2].replace('/n','').trim(); 
			tv_list.push({name:name,url:m3u8_url});
		}
		load(tv_list);
	},'html');	
}

//解析中国邮电大学直播导航页面内容
function loadCCTV(){
	//以下频道列表在该页面源码中获得 http://tv.cntv.cn/live/chongqing
    var chs = {'央视频道':[['cctv1','CCTV-1 综合','1','央视','央视频道','1'],['cctv2','CCTV-2 财经','1','央视','央视频道','2'],['cctv3','CCTV-3 综艺','1','央视','央视频道','3'],['cctv4','CCTV-4 (亚洲)','1','央视','央视频道','4'],['cctveurope','CCTV-4 (欧洲)','1','央视','央视频道','5'],['cctvamerica','CCTV-4 (美洲)','1','央视','央视频道','6'],['cctv5','CCTV-5 体育','1','央视','央视频道','7'],['cctv6','CCTV-6 电影','1','央视','央视频道','8'],['cctv7','CCTV-7 军事农业','1','央视','央视频道','9'],['cctv8','CCTV-8 电视剧','1','央视','央视频道','10'],['cctvjilu','CCTV-9 纪录','1','央视','央视频道','11'],['cctv10','CCTV-10 科教','1','央视','央视频道','13'],['cctv11','CCTV-11 戏曲','1','央视','央视频道','14'],['cctv12','CCTV-12 社会与法','1','央视','央视频道','15'],['cctv13','CCTV-13 新闻','1','央视','央视频道','16'],['cctvchild','CCTV-14 少儿','1','央视','央视频道','17'],['cctv15','CCTV-15 音乐','1','央视','央视频道','18'],['cctv5plus','CCTV体育赛事','1','北京','央视频道','24']],'卫视频道':[['anhui','安徽卫视','1','安徽','卫视频道','1'],['btv1','北京卫视','1','北京','卫视频道','2'],['bingtuan','兵团卫视','1','新疆','卫视频道','3'],['chongqing','重庆卫视','1','重庆','卫视频道','4'],['dongfang','东方卫视','1','上海','卫视频道','5'],['dongnan','东南卫视','1','福建','卫视频道','6'],['guangdong','广东卫视','1','广东','卫视频道','7'],['guangxi','广西卫视','1','广西','卫视频道','8'],['gansu','甘肃卫视','1','甘肃','卫视频道','9'],['guizhou','贵州卫视','1','贵州','卫视频道','10'],['hebei','河北卫视','1','河北','卫视频道','11'],['henan','河南卫视','1','河南','卫视频道','12'],['heilongjiang','黑龙江卫视','1','黑龙江','卫视频道','13'],['hubei','湖北卫视','1','湖北','卫视频道','14'],['jilin','吉林卫视','1','吉林','卫视频道','16'],['jiangxi','江西卫视','1','江西','卫视频道','18'],['liaoning','辽宁卫视','1','辽宁','卫视频道','20'],['travel','旅游卫视','1','海南','卫视频道','21'],['neimenggu','内蒙古卫视','1','内蒙古','卫视频道','22'],['ningxia','宁夏卫视','1','宁夏','卫视频道','23'],['qinghai','青海卫视','1','青海','卫视频道','24'],['shandong','山东卫视','1','山东','卫视频道','25'],['sdetv','山东教育台','1','山东','卫视频道','26'],['shenzhen','深圳卫视','1','广东','卫视频道','26'],['shan3xi','陕西卫视','1','陕西','卫视频道','27'],['shan1xi','山西卫视','1','山西','卫视频道','28'],['sichuan','四川卫视','1','四川','卫视频道','29'],['tianjin','天津卫视','1','天津','卫视频道','30'],['xizang','西藏卫视','1','西藏','卫视频道','31'],['xiamen','厦门卫视','1','福建','卫视频道','32'],['xinjiang','新疆卫视','1','新疆','卫视频道','33'],['xianggangweishi','香港卫视','0','香港','卫视频道','33'],['yanbian','延边卫视','1','吉林','卫视频道','34'],['yunnan','云南卫视','1','云南','卫视频道','35'],['hnss','三沙卫视','1','海南','卫视频道','1563']],'数字频道':[['zhongxuesheng','CCTV中学生','0','央视','数字频道','100001'],['cctvfxzl','CCTV发现之旅','1','央视','数字频道','36'],['xinkedongman','CCTV新科动漫','1','央视','数字频道','42'],['zhinan','CCTV电视指南','1','央视','数字频道','100002']],'城市频道':[['btv2','BTV文艺','1','北京','城市频道','401'],['btv3','BTV科教','1','北京','城市频道','402'],['btv4','BTV影视','1','北京','城市频道','403'],['btv5','BTV财经','1','北京','城市频道','404'],['btv6','BTV体育','1','北京','城市频道','405'],['btv7','BTV生活','1','北京','城市频道','406'],['btv8','BTV青少','1','北京','城市频道','407'],['btv9','BTV新闻','1','北京','城市频道','408'],['cztv1','潮州综合','0','广东','城市频道','701'],['cztv2','潮州公共','0','广东','城市频道','702'],['foshanxinwen','佛山新闻综合','0','广东','城市频道','703'],['shaoguanzonghe','韶关综合','0','广东','城市频道','709'],['zhuhaiyitao','珠海一套','1','广东','城市频道','712'],['zhuhaiertao','珠海二套','1','广东','城市频道','713'],['cdtv1','成都新闻综合','1','四川','城市频道','801'],['cdtv5','成都公共','1','四川','城市频道','803'],['hubeigonggong','湖北公共','0','湖北','城市频道','1102'],['hubeijiaoyu','湖北教育','0','湖北','城市频道','1103'],['hubeiyingshi','湖北影视','0','湖北','城市频道','1105'],['hubeijingshi','湖北经视','0','湖北','城市频道','1106'],['hubeigouwu','湖北购物','0','湖北','城市频道','1107'],['xiangyangtai','襄阳广播电视台','0','湖北','城市频道','1110'],['shijiazhuangsantao','石家庄三套','0','河北','城市频道','1405'],['nantongxinwen','南通新闻频道','0','江苏','城市频道','2002'],['nantongshejiao','南通社教频道','0','江苏','城市频道','2003'],['xiamen1','厦门一套','1','福建','城市频道','2301'],['xiamen2','厦门二套','1','福建','城市频道','2302'],['xiamen3','厦门三套','1','福建','城市频道','2303'],['xiamen4','厦门四套','1','福建','城市频道','2304'],['fyxw','阜阳新闻综合频道','0','安徽','城市频道','19560'],['fyds','阜阳都市频道','0','安徽','城市频道','19561'],['fygg','阜阳公共频道','0','安徽','城市频道','19562'],['fykj','阜阳教科农频道','0','安徽','城市频道','19563'],['tsbztv2','巴音郭勒蒙语频道','1','内蒙古','城市频道','100160'],['tsxjtv2','新疆维语综合频道','1','新疆','城市频道','122222'],['tsxjtv3','新疆哈语综合频道','1','新疆','城市频道','122223'],['tsxjtv5','新疆维语综艺频道','1','新疆','城市频道','122224'],['tsxjtv8','新疆哈语综艺频道','1','新疆','城市频道','122225'],['tsxjtv9','新疆维语经济生活频道','1','新疆','城市频道','122226'],['neimengwh','内蒙古文化频道','1','内蒙古','城市频道','1345678']]};
	var tv_list=[];
	for(ch in chs){
		for(c in chs[ch]){
			if(chs[ch][c][2] == '1'){
				tv_list.push({
					name:chs[ch][c][1],
					url: chs[ch][c][0],
					group_title:chs[ch][c][4],
					type:'byCCTV'
				});
			}
		}
	}
	load(tv_list);
}

//直接直播页
function loadIframe_Cietv_Com(tab='cctv5zaixianzhibo'){
	//[
	//	{desc:'cctv5zaixianzhibo',name:'央视频道'},
	//	{desc:'wangluodianshizhibo',name:'卫视频道'},
	//]
	asyncApi('http://www.cietv.com/'+tab,function(value){
		var parser=new DOMParser();
		var htmlDoc=parser.parseFromString(value, 'text/html');
		var text=$(htmlDoc).find('.play script').text();
		try{eval(text)}catch(err){}
		var src=eval('src');
		
		playByIframe(src);
		
	},'html')
}
