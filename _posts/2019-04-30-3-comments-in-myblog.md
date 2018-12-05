---
layout: post
title:  "为博客配置三种评论插件"
date:   2019-04-30 15:02:40 +0800
categories: blog
tags: blog
author: 龙轩
---

* 目录
{:toc}

自搭建博客开始，就在找各种评论插件，先选择的是Disqus，但它有个最大的限制就是被墙了，这会导致好多人无法评论~

然后又开始找当前可用的评论系统，聚合类的如畅言、来必力，基于github Issue的如gitment、gitalk、vssue等等。下面分别来介绍一下。**这里只做简单介绍，具体配置方式网上资料太多了，这里不会再赘述。**





## 多说[暂停服务]

多说的功能还是很强大的，加上很早之前就有了各种社交途径的分享，很受大家喜爱。虽然多说在2017年6月1日正式停止，但是还是纪念下多说吧。虽然我没有用过，但是我在一些技术交流群中还是听到很多人在说多说。

![](https://cdn.jsdelivr.net/gh/Arronlong/cdn/blogImg/20200625195407.png)

## 聚合类-畅言

畅言，搜狐出品，业内领先的社会化评论系统，支持PC和移动端两种接入方式，充分满足了当前各大网站对于用户登录、评论、分享 、审核等方面的需求。官网：[Go>>](<https://changyan.kuaizhan.com/>)

- 优势
  - 支持多种账号登录
  - 技术领先：三重过滤机制
  - 后台管理：实时的数据统计、快捷数据导出
  - 后台设置：先发后审  or 先审后发

- 缺点
  - 要求备案号
  - 不支持facebook，twitter，github等任何国外的平台
  - 某些博主反馈说评论管理很不方便（后台账号不能用来评论，所以博主在评论还得重新注册，好傻呀是不是~）
  - 管理评论的chrome插件过期不维护

![](https://cdn.jsdelivr.net/gh/Arronlong/cdn/blogImg/20200625195447.png)

## 聚合类-来必力

来必力是韩国的产品，体验还不错。该产品主要分为中文、英文、韩文三个版本，用户可以根据语言选择对应的版本。 
LiveRe目前有两个版本。 官网：[Go>>](<https://www.livere.com/>)

- 优势（City 版-免费版本）
  - 使用社交网站账户登录，免去注册过程
  - 提高用户的参与和沟通意愿
  - 管理/删除我的评论内容
  - 提供管理页面，管理网站文章及评论内容
- 缺点
  - 评论管理真的很low，而且不好用
  - 不能设置先发后审or先审后发

![](https://cdn.jsdelivr.net/gh/Arronlong/cdn/blogImg/20200625195509.png)

## Disqus

Disqus是一家第三方社会化评论系统，主要为网站主提供评论托管服务。国外网站用的比较多~，所以首次建博初期，基本上都是配置Disqus，可以说是标配了。但是你很快会发现在天朝经常加载不起来，当然解决方案网上也有，就是用代理的方式实现。

图片就不放了~

## gitment、gitalk、vssue

是同一类，都是基于github issue创建的。

gitment，仅支持GitHub 账号。项目地址：<https://github.com/imsun/gitment>，项目貌似不再维护了~

Gitalk 是一个基于 GitHub Issue 和 Preact 开发的评论插件，仅支持GitHub 账号。项目地址：<https://github.com/gitalk/gitalk>

- 使用 GitHub 登录
- 支持多语言 [en, zh-CN, zh-TW, es-ES, fr, ru]
- 支持个人或组织
- 无干扰模式（设置 distractionFreeMode 为 true 开启）
- 快捷键提交评论 （cmd\|ctrl + enter）


vssue，项目地址：<https://github.com/meteorlxy/vssue>，支持代码托管平台（如 Github、Gitlab、Bitbucket、Coding 等平台）

---

好了，简单介绍过后，我最终选择了同时使用 gitalk+来必力+Disqus 三种评论插件，而且可以根据需要,，通过设置`enable`来随时关闭任意评论插件。效果如下：

![](https://cdn.jsdelivr.net/gh/Arronlong/cdn/blogImg/20200625195600.png)

具体配置，分为三步，

在_config.yml的配置如下：

```yml
# comments
# 三种评论插件，使用bootstrap tab插件来选择，通过各自的enable属性来确认是否启用
gitalk: #国内大神自行开发，基于github issue，项目地址：https://github.com/gitalk/gitalk
  enable: true
  clientID: #oauth application的clientID
  clientSecret: #oauth application的clientSecret
  repo: #用户名.github.io或者是一个存放评论的仓库
  owner: #github用户名
  admin: #github用户名
  
livere: #来必力，韩国的社会化评论系统，支持QQ、微信、微博、百度、微博等大部分国内社区账号
  enable: true
  livere_uid: #自己申请的uid
  
disqus: #国外用的最多的三方评论系统
  enable: true
  shortname: #自己申请的账号
```

修改comments.html文件，添加三种评论插件的代码，会自动通过`site.xxx.enable`来决定加载的插件。

```html
<script src="https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script>
<script src="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<div class="comments">{% raw %}
	<ul id="myTab" class="nav nav-tabs">
		{% if site.gitalk.enable %}
			<li class="active">
				<a href="#gitalk" data-toggle="tab">
					 Gitalk-github账号评论
				</a>
			</li>
		{% endif %}
		{% if site.livere.enable %}
			<li>
				<a href="#laibili" data-toggle="tab">
					来必力-QQ|微信|微博|百度|豆瓣账号评论
				</a>
			</li>
		{% endif %}
		{% if site.disqus.enable %}
			<li>
				<a href="#disqus" data-toggle="tab">
					Disqus评论
				</a>
			</li>
		{% endif %}
	</ul>
	<div id="myTabContent" class="tab-content">
		<div class="tab-pane fade in" id="gitalk">
			<!-- Gitalk 评论 start  -->
			{% if site.gitalk.enable %}
			
			#gitalk的核心代码
			
			{% endif %}
			<!-- Gitalk end -->
		</div>
		<div class="tab-pane fade in" id="laibili">
			{% if site.livere.enable %}
			<!-- 来必力City版安装代码 -->
			
			#来必力的核心代码
			
			<!-- City版安装代码已完成 -->       
			{% endif %}
		</div>
		<div class="tab-pane fade in" id="disqus">
			{% if site.disqus.enable %}
			
			#Disqus核心代码
			
			{% endif %}
		</div> {% endraw %}
	</div>
</div>
<script>
$("div.tab-pane.fade").first().addClass("active");
</script>
```

在此评论页面模板上，本来是用Bootstrap Tab插件来做的，只是Bootstrap.css“污染”了网站其他样式，所以把相关的css样式复制出来了，放到了_post.scss文件的最下方：

```css
.comments ul {
	margin-top:0;
	margin-bottom:10px;
}
.comments .nav {
	padding-left:0;
	margin-bottom:0;
	list-style:none;
}
.comments .nav>li {
	position:relative;
	display:block;
}
.comments .nav>li>a {
	position:relative;
	display:block;
	padding:10px 15px;
}
.comments .nav-tabs {
    border-bottom: 1px solid #ddd;
	display: table;
}
.comments .nav-tabs>li {
	float:left;
	margin-bottom:-1px;
}
.comments .nav-tabs>li>a {
	margin-right:2px;
	line-height:1.42857143;
	border:1px solid transparent;
	border-radius:4px 4px 0 0;
}
.comments .nav-tabs>li.active>a,.comments .nav-tabs>li.active>a:focus,.comments .nav-tabs>li.active>a:hover {
    color: #555;
    cursor: default;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
}
.comments .tab-content>.tab-pane {
	display:none;
}
.comments .tab-content>.active {
    display: block;
}
.comments .fade.in {
    opacity: 1;
}
.comments .fade {
    opacity: 0;
    -webkit-transition: opacity .15s linear;
    -o-transition: opacity .15s linear;
    transition: opacity .15s linear;
}
```
