//------------------------------------------------------------
//	解析平台地址：https://jx.htv009.com/?url=
//	JSON接口地址：https://user.htv009.com/json?url=
//
//------------------------------------------------------------

var _site={}
_site['youku.com']='youku';
_site['iqiyi.com']='iqiyi';
_site['qq.com']='qq';
_site['mgtv.com']='mgtv';
_site['sohu.com']='sohu';
_site['leshi.com']='leshi';
_site['bilibili.com']='bilibili';

function getSite(url){
	if(url=='')return;
	var host = url.replace(/https?:\/\//,'').split("/")[0].toLowerCase().split('.').slice(-2).join('.');
	return _site[host];
}

//获取具体接口地址
function getUrl(url){
	
	if(url=='')return;
	//获取站点对应的api列表对象
	var site_apis = eval('_'+getSite(url));

	if(site_apis && site_apis.length>0){
		if(location.search.indexOf('auto_play_next=true')>0 && site_apis.auto_play_next.length>0){
			//使用自动播放下一级的接口
			site_apis = site_apis.auto_play_next;
		}
		//随机获取其中一个地址
		return site_apis[parseInt(Math.random()*site_apis.length)].url+url;
	}else{
		//517解析:爱奇艺、优酷、乐视、芒果、搜狐、PPTV、华数tv、1905、咪咕、m3u8，MP4
		return 'http://cn.bjbanshan.cn/jx.php?url='+url;
	}
}

//16进制转字符串
function decodeFromHex(hex){
	return hex.replace(/\\x([a-fA-Z0-9]{2})/g, function (match_str, group_1) {
		return String.fromCharCode(parseInt(group_1, 16).toString(10));
	}).replace(/(\\u[a-f0-9]{4})/g, function (match_str, group_1) {
		//return windowExec("'"+group_1+"'");
		return unescape(group_1.replace(/\\/g,'%'));
	});
}

var jiexi_apis=[
	{
		url: 'https://v.7cyd.com/vip/?url=',
		title: '稳定高速无广告',
		sites: ['iqiyi','youku','qq','mgtv','sohu','leshi','bilibili'],
		switchLine:true,//支持路线切换
		searchByKW:true,//支持自主搜索视频
	},
	{
		url: 'https://data.qianyicp.com/vip/?url=',
		title: '全看解析',
		sites: ['iqiyi','youku','mgtv','sohu','leshi','bilibili'],
		switchLine:true,//支持路线切换
		searchByKW:true,//支持自主搜索视频
	},
	{
		url: 'http://jx.xyyh.xyz/?v=',
		title: '知网解析',
		sites: ['qq','mgtv','sohu','leshi','bilibili'],
		switchLine:true,//支持路线切换
		searchByKW:true,//支持自主搜索视频
	},
	{
		url: 'https://z1.m1907.cn/?jx=',
		title: 'm1907解析',
		sites:['youku','qq','mgtv','sohu','leshi'],
		searchByKW:true,//支持自主搜索视频
	},
	{
		url: 'https://jx.iztyy.com/svip/?url=',
		title: '云逸解析',
		sites:['iqiyi','youku','qq','mgtv','sohu','leshi'],
		searchByKW:true,
	},
	{
		url: 'http://www.xiaolangyun.com/?url=',
		title: '宝贝',
		sites:['iqiyi','youku','qq','mgtv','sohu','leshi'],
		searchByKW:true,
	},
	{
		url: 'https://jsap.attakids.com/?url=',
		title: '思古解析',
		sites:['iqiyi','youku','qq','mgtv','sohu','leshi'],
	},
	{
		url: 'https://jx.ergan.top/?url=',
		title: '二干解析',
		sites:['iqiyi','youku','qq','mgtv','sohu'],
	},
	{
		url: 'https://yun.guoyuvip.com/Yun.php?url=',
		title: '云视频系统',
		sites: ['iqiyi','youku','qq','sohu'],
	},
	{
		url: 'https://jx.htv009.com/?url=',
		title: '解析大师',
		sites: ['iqiyi','youku','qq','mgtv','sohu'],
	},
	{
		url: 'https://www.jiexila.com/?url=',
		title: '解析La',
		sites: ['youku','qq','sohu','leshi'],
		switchLine:true,
	},
	{
		url: 'https://jx.dy-jx.cn/?url=',
		title: '高科技云解析',
		sites: ['iqiyi','youku','qq','sohu'],
		switchLine:true,
	},
	{
		url: 'https://so.mcncn.cn/?url=',
		title: '梦城解析',
		sites:['qq','mgtv','sohu','leshi'],
		switchLine:true,
		autoPlayNext:true,
		searchByKW:true,
	},
	{
		url: 'http://jx.oopw.top/?url=',//'http://api.oopw.top/?url='
		title: '大亨影院解析',
		sites:['iqiyi','qq','mgtv','sohu','leshi','bilibili'],
		switchLine:true,
		searchByKW:true,
	},
	{
		url: 'http://jx.bwcxy.com/?v=',
		title: '初心解析',
		sites:['youku','qq','sohu','leshi','bilibili'],
		switchLine:true,
		searchByKW:true,
	},
	{
		url: 'http://jx.rdhk.net/?v=',
		title: 'Hk解析',
		sites:['mgtv','leshi'],
		switchLine:true,
	},
	{
		url: 'https://jx.fo97.cn/?url=',//https://play.fo97.cn/?url=
		title: '60解析',
		sites:['qq','mgtv','leshi','bilibili'],
	},
	{
		url: 'https://jx.sinbinchina.com/?v=',//'http://yun.360dy.wang/jx.php?url=',
		title: '360智能解析',
		sites:['mgtv','sohu','leshi'],
	},
	{
		url: 'https://www.kpezp.cn/jlexi.php?url=',
		title: '小蒋极致解析',
		sites:['iqiyi','qq','mgtv','sohu','leshi'],
	},
	{
		url: 'https://jx.ivito.cn/?url=',
		title: '维多解析',
		sites:['qq','mgtv','sohu','leshi','bilibili'],
	},
	{
		url: 'https://api.tv920.com/vip/?url=',
		title: 'TV920解析',
		sites:['qq','mgtv','sohu','leshi','bilibili'],
		switchLine:true,
	},
	{
		url: 'http://nitian9.com/?url=',
		title: '逆天解析',
		sites:['youku','mgtv','leshi'],
	},
	{
		url: 'http://jx.xyplay.vip/?url=',
		title: 'XyPlayer解析',
		sites:['youku','qq','mgtv','sohu','leshi'],
		switchLine:true,
		autoPlayNext:true,
	},
	{
		url: 'http://api.lhh.la/vip/?url=',
		title: '豪华啦',
		sites:['qq','mgtv','sohu','leshi','bilibili'],
	},
	{
		url: 'https://jx40.net/url=',
		title: '40解析',
		sites:['youku','qq','sohu'],
	},
	{
		url: 'http://api.8bjx.cn/?url=',
		title: '8B解析',
		sites:['youku','qq','mgtv','sohu','leshi'],
	},
	{
		url: 'https://www.ckmov.vip/api.php?url=',
		title: '解析系统',
		sites:['youku','mgtv','sohu'],
	},
	{
		url: 'http://k8aa.com/jx/index.php?url=',
		title: '超清干货',
		sites:['youku','qq'],
		switchLine:true,
	},
	{
		url: 'https://vip.bljiex.com/?v=',
		title: 'bl解析',
		sites:['youku','qq','mgtv','sohu','leshi'],
		switchLine:true,
		searchByKW:true,
	},
	{
		url: 'http://cn.bjbanshan.cn/jx.php?url=',
		title: '517解析',
		sites: ['iqiyi','youku','qq','sohu'],
	},
	{
		url: 'http://jx.618ge.com/?url=',
		title: '618戈',
		sites:['youku','qq','mgtv','sohu','leshi','bilibili'],
		switchLine:true,
	},
	{
		url: 'http://www.33tn.cn/?url=',
		title: '爸比解析',
		sites:['youku','qq','mgtv','sohu','leshi'],
	},
	{
		url: 'http://jx.1ff1.cn/?url=',
		title: '1ff1解析',
		sites:['qq','mgtv','sohu','leshi'],
	},
	{
		url: 'http://vip.116kan.com/?url=',
		title: '116kan',
		sites:['youku','mgtv','sohu'],
		switchLine:true,
		searchByKW:true
	},
	{
		url: 'http://jx.hongyishuzhai.com/index.php?url=',
		title: '弦易阁',
		sites:['iqiyi','youku','mgtv','sohu','leshi'],
		switchLine:true,
		searchByKW:true
	},
	{
		url: 'http://55jx.top/?url=',
		title: '55解析',
		sites: ['youku','mgtv','leshi'],
	},
	{
		url: ' https://jx.000180.top/jx/?url=',
		title: '180解析',
		sites:['youku','mgtv','sohu'],
		switchLine:true,
	},
	{
		url: 'http://19g.top/?url=',
		title: '19解析',
		sites: ['youku','mgtv','leshi'],
	},
	{
		url: 'http://py.ha12.xyz/sos/index.php?url=',
		title: 'ha12解析',
		sites: ['youku','mgtv','sohu','leshi'],
	},
	{
		url: 'http://fateg.xyz/?url=',
		title: '清风明月',
		sites: ['iqiyi','youku','qq'],
		switchLine:true,
	},
	{
		url: 'https://www.administratorw.com/admin.php?url=',//'https://www.administratorw.com/video.php?url=',
		title: '无名小站',
		sites: ['youku','mgtv','sohu','leshi'],
		switchLine:true,
	},
	{
		url: 'http://jx.598110.com/index.php?url=',
		title: '通用视频解析接口',
		sites:['iqiyi','youku','qq'],
		switchLine:true,
	},
	{
		url: 'http://www.1717yun.com/jx/ty.php?url=',
		title: '通用vip接口3',
		sites: ['youku','mgtv','sohu'],
	},
	{
		url: 'https://cdn.yangju.vip/k/?url=',
		title: '调试测试接口',
		sites:['youku','mgtv','sohu'],
	},
	{
		url: 'http://vip.jlsprh.com/v/4.php?url=',
		title: '视频在线播放',
		sites: ['iqiyi'],
		switchLine:true,
	},
	{
		url: 'http://jx.api.163ren.com/vod.php?url=',
		title: 'Yun Parse',
		sites:['mgtv','sohu','leshi'],
	},
	{
		url: 'http://2gty.com/apiurl/yun.php?url=',
		title: '爱跟智能视频解析',
		sites:['bilibili'],
		switchLine:true,
		autoPlayNext:true,
	},
	{
		url: 'http://okjx.cc/?url=',
		title: 'OK解析',
		sites:['youku','mgtv','sohu','leshi'],
		switchLine:true,
	},
	{
		url: 'http://api.bingdou.net/?url=',
		title: '冰豆解析',
		sites:['youku','mgtv','sohu','leshi','bilibili'],
		switchLine:true,
		autoPlayNext:true,
		searchByKW:true,
	},
	{
		url: 'https://vip.jaoyun.com/index.php?url=',
		title: '简傲云解析',
		sites:['youku','sohu','leshi'],
	},
	{
		url: 'https://api.927jx.com/vip/?url=',
		title: '超清晰解析接口',
		sites:['youku','mgtv','sohu','leshi'],
	},
	{
		url: 'https://www.urlkj.com/?url=',
		title: '视频解析系统',
		sites:['mgtv','sohu','leshi'],
	},
	{
		url: 'http://jx.kukan.vip/?url=',
		title: '酷看全网视频解析',
		sites:['mgtv','sohu','leshi','bilibili'],
	},
	{
		url: 'https://jiexi.380k.com/?url=',
		title: '黑云解析',
		sites:['iqiyi','youku','mgtv','sohu','leshi','bilibili'],
		switchLine:true,
	},
	{
		url: 'http://vip.wandhi.com/?v=',
		title: 'Wandhi解析',
		sites:['youku','mgtv','sohu','leshi'],
		switchLine:true,
		searchByKW:true,
	},
];