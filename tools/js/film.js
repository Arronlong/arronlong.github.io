//分词
function split2Words(str){
	var result = $.ajax({
		url:'http://api.yesapi.cn/?service=App.Scws.GetWords&app_key=CEE4B8A091578B252AC4C92FB4E893C3&sign=CB7602F3AC922808AF5D475D8DA33302&text='+str,
		async:false,
		type:'get'
	});
	return JSON.parse(result.responseText).data.words.map(function(item,index,self){
		return item.word;
	});
}

//logo
var logos={
	//https://r1.ykimg.com/051000005A5D5F06ADC0AE209E02516E?x-oss-process=image/resize,w_530/format,webp/interlace,1
	youku: 'https://r1.ykimg.com/051000005A5D5E3CADC0AE1B09011DC4',
	iqiyi: 'https://r1.ykimg.com/051000005A5D5C49ADC0AE2B780A41E7',
	sohu: 'https://r1.ykimg.com/051000005A5D5D6FADC0AE6BC9059433',
	qq:'https://r1.ykimg.com/051000005A5D5F56ADC0AE18190B4E05',
	imgo:'https://r1.ykimg.com/051000005A5D5F06ADC0AE209E02516E',//芒果TV
	m1905:'https://r1.ykimg.com/051000005A65A64CADC0AED5960E3981',//电影网
	cctv:'https://r1.ykimg.com/051000005A65A708ADC0AECA4B00B3DE',//CCTV
	letv:'https://r1.ykimg.com/051000005A5D5EADADC0AE2B780900E4',//乐视
}

//优酷-全网搜索
function searchByYouku(kw,pageNum,fun){
	var search_url='https://cors.arron.workers.dev/https://search.youku.com/api/search?keyword='+kw + encodeURIComponent('&pg='+pageNum);
	$.getJSON(search_url,function (msg){
	//corsApi(search_url,function (msg){
		var videos=[];
		for(var data of msg.pageComponentList){
			//console.log(data); 
			var video=parseYouku(data);
			//console.log(video);
			videos.push(video);
		}
		if(typeof fun=='function')fun(videos);
	});

	function parseYouku(data){
		if(data.commonData){//官方视频
			var video = {
				userVideo: false,//是否为用户上传视频
				title: data.commonData.titleDTO.displayName, //青春有你 第二季
				thumbUrl: data.commonData.posterDTO.vThumbUrl,//封面
				url: data.commonData.leftButtonDTO.action.value, //http:/iqiyi.com/xxx
				feature: data.commonData.feature, //"2020 · 综艺 · 中国 · 共12集"		
				notice: data.commonData.notice, //"嘉宾:蔡徐坤 LISA Jony J 陈嘉桦"
				episode: 1==data.commonData.episodeType,//是否为多集
				episodeTotal: data.commonData.episodeTotal, //集数
				highlightWord: data.commonData.highlightWord, //高亮字
				stripeBottom: data.commonData.stripeBottom, //更新至x集
				showId:data.commonData.showId,//节目id，通过showId获取电视剧详情
				source:{//播放源
					img: data.commonData.sourceImg,
					name: data.commonData.sourceName,
				},
				more:[]
			};
			for(var key of data.componentKeyList){
				for(var _data of data.componentMap[key].data){
					if(_data.url){//仅显示更多的
						video.more.push({
							title: _data.showVideoStage,
							url: _data.url,
						});
					}
				}
			}
			return video;
			
		}else{//用户上传视频
			var video = []
			for(var key of data.componentKeyList){
				for(var _data of data.componentMap[key].data){
					video.push({
						userVideo: true,
						title: _data.titleDTO.displayName,
						thumbUrl: _data.screenShotDTO.thumbUrl,
						url: 'https://v.youku.com/v_show/id_'+_data.videoId+'.html',
						userName: _data.userName,
						publishTime: _data.publishTime,
						duration: _data.screenShotDTO.rightBottomText,
						vid: _data.videoId,
					});
				}
			}
			return video.length==1?video[0]:video;
		}
	}
}

//查询电视剧集详情
function showSerises(url,fun){
	var url='https://z1.m1907.cn/api/v/?z=e090d9a71dfabaeefd49ff1c6afcdfae&jx='+url
}

//查询电视剧集详情
function showSerisesByYouku(showId,fun){
	var url='https://search.youku.com/api/search?appScene=show_episode&showIds='+showId;
	corsApi(url,function (msg){
		var serises=[];
		for(var data of msg.serisesList){
			//console.log(data); 
			serises.push({
				title: data.displayName,//第17期 : 潘玮柏帅气舞姿引欢呼
				seq: data.showVideoStage,//第17期
				time: data.stripeBottom,
				vid: data.videoId,
				img: data.thumbUrl,
				url: 'https://v.youku.com/v_show/id_'+data.videoId+'.html'
			});
		}
		if(typeof fun=='function')fun(serises);
	});
}

//查询电视剧集详情
function showSerisesByIqiyi(showId, fun, pageNum=1, arr){
	var url='https://pub.m.iqiyi.com/h5/main/videoList/album/?albumId='+showId+'&size=20&page='+pageNum+'&needVipPrevue=true';
	$.getJSON(url,function (msg){
		var serises=arr||[];
		for(var data of msg.data.videos){
			//console.log(data); 
			serises.push({
				title: data.shortTitle,//无心法师3第21集
				subTitle: data.subTitle,//21集 无心青鸾许终生
				vt: data.vt,//无心青鸾许终生
				seq: data.pd,//21
				time: data.publishTime,//发布时间
				vid: data.vid,
				img: data.imageUrl,
				url: data.pageUrl,
			});
		}
		if(msg.data.totalPages>pageNum){
			showSerisesByIqiyi(showId, fun, pageNum+1, serises);
		}else{
			if(typeof fun=='function')fun(serises);
		}
	});
}

//爱奇艺搜索-全网
function searchByIqiyi(kw, pageNum, fun, channel){
	var search_url = 'https://search.video.iqiyi.com/o?if=html5&key='+kw+'&pageSize=20&pageNum='+pageNum;
	if(channel) search_url += '&channel_name='+channel;
	$.getJSON(search_url,function(msg){
		var videos=[];
		for(var data of msg.data.docinfos){
			//console.log(data); 
			var video=parseIqiyi(data);
			//console.log(video);
			videos.push(video);
		}
		//console.log(videos);
		if(typeof fun=='function')fun(videos);
	})

	/* 
		logo集合图片
		https://www.iqiyipic.com/common/fix/site-v4/search-page/qy-search-player-source_42.png?ver=20191202
		logo位置偏移 
	*/
	function parseIqiyi(data){
		if(data.albumDocInfo.videoDocType == 1){//官方视频
			var video = {
				userVideo: false,//是否为用户上传视频
				title: data.albumDocInfo.albumTitle, //青春有你 第二季
				thumbUrl: data.albumDocInfo.albumImg,//封面
				url: data.albumDocInfo.albumLink, //详情页
				//url: data.albumDocInfo.videoinfos.slice(0).itemLink, //第一集
				channel: data.albumDocInfo.channel,//频道
				director: data.albumDocInfo.director,//导演、主持人
				star: data.albumDocInfo.star,//明星
				releaseDate: data.albumDocInfo.releaseDate,//上线日期
				episode: data.albumDocInfo.series, //是否为多集
				episodeTotal: data.albumDocInfo.itemTotalNumber, //集数
				showId: data.albumDocInfo.albumId,//用于获取详细列表
				stripeBottom: '更新至第'+data.albumDocInfo.videoinfos.slice(-1)[0].playedNumber+'集(期)', //更新至x
				source:{//播放源
					img: logos[data.albumDocInfo.siteId],//'https://www.iqiyipic.com/common/fix/site-v4/search-page/qy-search-player-source_42.png?ver=20191202',
					name: data.albumDocInfo.siteName,
				},
				more:[]
			};
			if(data.albumDocInfo.bookSummary){
				video.book = {//关联的图书信息
					name:data.albumDocInfo.bookSummary.title,
					img:data.albumDocInfo.bookSummary.image_url,
					description:data.albumDocInfo.bookSummary.description,
					authors:data.albumDocInfo.bookSummary.author,
					url:'https://wenxue.iqiyi.com/book/detail-'+data.albumDocInfo.bookSummary.id+'.html',
				}
			}
			for(var _data of data.albumDocInfo.videoinfos){
				video.more.push({
					title: _data.itemTitle.replace(video.title,''),
					url: _data.itemLink,
					vid: _data.vid,
					seq: _data.playedNumber,//集序号
					subTitle:_data.subTitle,
				});
			}
			return video;
			
		}else{//用户上传视频
			var _data=data;
			return {
				userVideo: true,
				title: _data.albumDocInfo.albumTitle,
				thumbUrl: _data.albumDocInfo.albumImg,
				url: _data.albumDocInfo.albumLink,
				userName: _data.albumDocInfo.videoinfos?_data.albumDocInfo.videoinfos[0].uploader_name:'',
				publishTime: _data.albumDocInfo.videoinfos?_data.albumDocInfo.videoinfos[0].year:'',
			};
		}
	}
}

//资源网站：
function searchBy919yy(){
	var search_url='https://www.919yy.com/mov/api.php?wd='+kw+'&cb=?';
	var video_url='https://www.919yy.com/mov/api.php?flag=0&id=96953&cb=?';
}

//输入提示By优酷
function suggestByYouku(query,fun){
	var suggest_url='https://tip.soku.com/searches/soku/kubox/v4/by_keyword.json?query='+query+"&jsoncallback=?";
	$.getJSON(suggest_url,function(msg){
		var arr=[];
		var t=0;
		for(var word of msg.s){
			//if(t>=5)break;
			arr.push({
				i:++t,
				w:word.w,
			})
		}
		if(typeof fun=='function')fun(arr);
	})
}

//输入提示By爱奇艺
function suggestByIqiyi(query, fun){
	var suggest_url='https://suggest.video.iqiyi.com/?if=mobile&key='+query+"&callback=?";
	$.getJSON(suggest_url,function(msg){
		//console.log(msg);
		var arr=[];
		var t=0;
		for(var word of msg.data){
			arr.push({
				i:++t,
				w:word.name,
			})
		}
		if(typeof fun=='function')fun(arr);
	})
}