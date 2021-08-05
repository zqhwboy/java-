/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /gh/BNDong/Cnblogs-Theme-SimpleMemory@1.3.2/src/script/base.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function Base(){const t=this,e=new myTools,n=!!$("#topics").length;let o=new ToProgress(window.cnblogsConfig.progressBar,"#bottomProgressBar"),i=0,s={setMenuIntroduceTId:null,setMenuCalendarTId:null,setSidebarSearchTId:null,setSidebarScorerankTId:null,setMenuSidebarTId:null,setMenuToptagsTId:null,setMenuClassifyTId:null,setMenuArticleCategoryTId:null,setMenuRecordTId:null,setMenuArticleTId:null,setMenuTopviewTId:null,setMenuTopDiggPostsTId:null,setMenuRecentCommentsTId:null,setHomeRightMenuTId:null,setNotHomeRightMenuTId:null,setCnzzTId:null,setAmazingTId:null,setCatalogTId:null,blogPostCategoryTId:null,entryTagTId:null,commentTId:null};this.init=function(){t.loadingBeforeInit(),t.endLoading(),t.loadingAfterInit(),window.cnblogsConfig.hook.pageInitEnd(t)},this.loadingBeforeInit=function(){setTimeout(t.clearIntervalAll,3e4),""!==window.cnblogsConfig.fontIconExtend&&e.dynamicLoadingCss(window.cnblogsConfig.fontIconExtend),n?t.notHomeInit():t.homeInit()},this.loadingAfterInit=function(){n?t.notHomeInitAfter():t.homeInitAfter(),t.addFooter(),window.cnblogsConfig.bgAnimationRendered&&require(["RibbonsEffect"]);let o=$('link[rel="shortcut icon"]');if(o.length)o.attr("href",window.cnblogsConfig.webpageIcon);else{let t=document.createElement("link");t.rel="shortcut icon",t.href=window.cnblogsConfig.webpageIcon,document.getElementsByTagName("head")[0].appendChild(t)}$(window).scroll(function(){t.scrollMonitor()}),$(window).resize(function(){t.resizeMonitor()}),$("#homeTopTitle").text(window.cnblogsConfig.blogUser),$("#menuWrap").optiscroll({forceScrollbars:!0,maxTrackSize:20,preventParentScroll:!0});let i=window.cnblogsConfig.blogAvatar?window.cnblogsConfig.blogAvatar:"https://cdn.jsdelivr.net/gh/BNDong/Cnblogs-Theme-SimpleMemory@master/img/webp/default_avatar.webp";$("#menuBlogAvatar").append("<img src='"+i+"'>"),t.htmlTitle(),t.setMenuUserInfoImg();let a=t.setMenuData();s.setMenuIntroduceTId=window.setInterval(a.setIntroduce,1e3),s.setMenuCalendarTId=window.setInterval(a.setCalendar,1e3),s.setSidebarSearchTId=window.setInterval(a.setSidebarSearch,1e3),s.setSidebarScorerankTId=window.setInterval(a.setSidebarScorerank,1e3),s.setMenuSidebarTId=window.setInterval(a.setSidebar,1e3),s.setMenuToptagsTId=window.setInterval(a.setToptags,1e3),s.setMenuClassifyTId=window.setInterval(a.setClassify,1e3),s.setMenuArticleCategoryTId=window.setInterval(a.setArticleCategory,1e3),s.setMenuArticleTId=window.setInterval(a.setArticle,1e3),s.setMenuRecordTId=window.setInterval(a.setRecord,1e3),s.setMenuTopviewTId=window.setInterval(a.setTopview,1e3),s.setMenuTopDiggPostsTId=window.setInterval(a.setTopDiggPosts,1e3),s.setMenuRecentCommentsTId=window.setInterval(a.setRecentComments,1e3),a.setCustomData(),$(".m-list-title-select").click(function(){$(this).parents(".m-list-title").next(".m-icon-list").slideToggle(500)}),window.cnblogsConfig.switchDayNight.enable&&t.setDayNightControl(),window.cnblogsConfig.advertising&&($("#ad_c1").show(),$("#ad_c2").show(),$("#ad_t1").show(),$("#ad_t2").show(),$("#cnblogs_c1").show(),$("#cnblogs_c2").show(),$("#under_post_kb").show(),$("#under_post_news").show()),e.consoleText(window.cnblogsConfig.consoleList,"banner")},this.clearIntervalAll=function(){$.each(s,function(t){null!=s[t]&&window.clearInterval(s[t])})},this.clearIntervalTimeId=function(t){null!=t&&window.clearInterval(t)},this.scrollMonitor=function(){let t=$("#home").offset().top-40,n=$(document).scrollTop(),s=$("#open-button"),a=$("#sideToolbar"),l=$(".main-header").outerHeight(),c=e.getScrollPercent(),r=$("#toUpDown"),d=$("#toUpDownI"),g=$(".toUpDownSpan");o.setProgress(c),l<=n?a.hasClass("sideToolbarFix")||a.addClass("sideToolbarFix"):a.removeClass("sideToolbarFix"),t<=n?(d.rotate({animateTo:0}),r.attr("data","up"),g.text("返回顶部")):(d.rotate({animateTo:-180}),r.attr("data","down"),g.text("跳至底部")),i<n?t<=n&&(s.hasClass("menu-button-scroll")||(s.addClass("menu-button-scroll"),s.text(""))):t>=n&&s.hasClass("menu-button-scroll")&&(s.removeClass("menu-button-scroll"),s.text("MENU")),i=n},this.resizeMonitor=function(){const e=parseFloat(document.body.clientWidth),n=$("#sideToolbar");if(t.setDomHomePosition(),n.length>0){let t=$("#mainContent").outerWidth(!0),o=$("#sideCatalog"),i=o.outerWidth(!0),s=(e-t)/2-(i=i>220?i:242)-50,a=$(".catalog-btn"),l=$(".main-header").outerHeight();n.css({top:l+5+"px",right:(s>0?s:0)+"px"}),e<=1350?(o.hide(),o.find("ul.nav li").length>0?a.show():a.hide()):(a.hide(),o.find("ul.nav li").length>0?o.show():o.hide())}},this.rightMenuMous=function(t,n){let o=$(t),i=$(n);o.find("i").on({mouseover:function(){!$(this).hasClass("icon-zhiding")&&$(this).rotate({animateTo:-60,duration:250,callback:function(){$(this).rotate({animateTo:60,duration:250,callback:function(){$(this).rotate({animateTo:-30,duration:150,callback:function(){$(this).rotate({animateTo:30,duration:150,callback:function(){$(this).rotate({animateTo:0,duration:100})}})}})}})}})}}),o.on({mouseover:function(){(()=>{let t="";switch(n){case".rightBuryitSpan":t=$("#bury_count").text();break;case".rightDiggitSpan":t=$("#digg_count").text()}""!==t&&o.attr("clickflg","false"),""!==t&&i.text(t)})(),i.stop().fadeIn(300)},mouseout:function(){i.stop().fadeOut(300)},click:function(){switch(n){case".rightBuryitSpan":case".rightDiggitSpan":"false"===$(this).attr("clickflg")&&($(this).attr("clickflg","true"),i.text("提交中."),setTimeout("$('"+n+"').text('提交中..')",300),setTimeout("$('"+n+"').text('提交中...')",600),setTimeout("$('"+n+"').text('更新中.')",900),setTimeout("$('"+n+"').text('更新中..')",1200),setTimeout("$('"+n+"').text('更新中...')",1500),".rightBuryitSpan"===n?setTimeout("$('"+n+"').text($('#bury_count').text())",1800):setTimeout("$('"+n+"').text($('#digg_count').text())",1800));break;case".attentionSpan":if("false"===$(this).attr("clickflg")){setTimeout(function(){"关注成功"===$.trim($("#p_b_follow").text())&&(o.attr("clickflg","true"),i.text("已关注"),o.find("i").removeClass("icon-dianzan").addClass("icon-dianzan1"))},1500)}break;case".toUpDownSpan":if("down"===$(this).attr("data")){let t=$(document).height(),n=$(window).height();e.actScroll(t-n,900)}else e.actScroll(0,900)}}})},this.endLoading=function(){$("body").css("overflow","auto"),pageLoading.spinner.setComplete(),$("div#loading").hide(),$('a[name="top"]').hide(),window.cnblogsConfig.hook.afterLoading(t,pageLoading)},this.htmlTitle=function(){let e,n,o,i=document.title;void 0!==document.hidden?(e="hidden",n="visibilitychange"):void 0!==document.mozHidden?(e="mozHidden",n="mozvisibilitychange"):void 0!==document.webkitHidden&&(e="webkitHidden",n="webkitvisibilitychange"),void 0===document.addEventListener&&void 0===document[e]||document.addEventListener(n,function(){o&&clearTimeout(o),document[e]?(o=setTimeout(function(){document.title=window.cnblogsConfig.webpageTitleOnblur+" - "+i.split(" - ")[0]},window.cnblogsConfig.webpageTitleOnblurTimeOut),window.cnblogsConfig.hook.pageLabelChanges(t,window.cnblogsConfig.webpageTitleOnblur)):(document.title=window.cnblogsConfig.webpageTitleFocus,o=setTimeout(function(){document.title=i},window.cnblogsConfig.webpageTitleFocusTimeOut),window.cnblogsConfig.hook.pageLabelChanges(t,window.cnblogsConfig.webpageTitleFocus))},!1)},this.setDomHomePosition=function(){$("#home").css("margin-top",$(".main-header").outerHeight()+"px")},this.setPageAnimationControl=function(){if(window.cnblogsConfig.homeTopAnimationRendered||window.cnblogsConfig.essayTopAnimationRendered||window.cnblogsConfig.bgAnimationRendered){let t='<div id="pageAnimationOffOn" data="off">';t+='<span id="pageAnimationOffOnIcon" class="iconfont icon-shandian"></span>',t+='<span id="pageAnimationOffOnText">隐藏页面特效</span>',t+="</div>",$("body").prepend(t),$("#pageAnimationOffOn").click(function(){"off"===$(this).attr("data")?($("body").find("canvas").hide(),$("#pageAnimationOffOnIcon").rotate({animateTo:-360}),$("#pageAnimationOffOnText").text("显示页面特效"),$(this).attr("data","on")):($("body").find("canvas").show(),$("#pageAnimationOffOnIcon").rotate({animateTo:360}),$("#pageAnimationOffOnText").text("隐藏页面特效"),$(this).attr("data","off"))})}},this.setDayNightControl=function(){let n,o=parseInt((new Date).getHours()),i=$("head"),s="cnblogs_config_isNight";switch(e.getCookie(s)){case"day":n="daySwitch";break;case"night":n="";break;default:n=window.cnblogsConfig.switchDayNight.auto.enable?o>=window.cnblogsConfig.switchDayNight.auto.nightHour?"":o>=window.cnblogsConfig.switchDayNight.auto.dayHour?"daySwitch":"":"daySwitch"}let a='<div id="dayNightSwitch" class="generalWrapper">    <div class="onOff '+n+'">        <div class="star star1"></div>        <div class="star star2"></div>        <div class="star star3"></div>        <div class="star star4"></div>        <div class="star star5"></div>        <div class="star sky"></div>        <div class="sunMoon">            <div class="crater crater1"></div>            <div class="crater crater2"></div>            <div class="crater crater3"></div>            <div class="cloud part1"></div>            <div class="cloud part2"></div>        </div>    </div></div>';$("body").prepend(a),n||i.append('<link type="text/css" id="baseDarkCss" rel="stylesheet" href="'+getJsDelivrUrl("base.dark.css")+'">'),$("#dayNightSwitch .onOff").click(function(){$(this).hasClass("daySwitch")?(window.cnblogsConfig.hook.dayNightControl(t,"night"),e.setCookie(s,"night",14400),$(this).removeClass("daySwitch"),i.append('<link type="text/css" id="baseDarkCss" rel="stylesheet" href="'+getJsDelivrUrl("base.dark.css")+'">')):(window.cnblogsConfig.hook.dayNightControl(t,"day"),e.setCookie(s,"day",14400),$(this).addClass("daySwitch"),$("head link#baseDarkCss").remove())})},this.setMenuData=function(){function n(t,e){let n="<div><ul>",o=/^[1-9]+[0-9]*$/;return t.each(function(i){let s=$(t[i]),a=s.text()===s.html()?{}:$(s.html()),l=$.trim(s.text()).split(".");o.test(l[0])&&l.splice(0,1);let c=$.trim(l.join(".")),r='<span class="iconfont '+e+'" style="color: #888;font-size: 14px;margin-right: 5px;"></span>';a.length>0&&a.html(r+c),n+="<li>"+(a.length>0?a.prop("outerHTML"):"<a href='javascript:void(0);'>"+r+c+"</a>")+"</li>"}),n+="</ul></div>"}return{setIntroduce:function(){let n=$("#profile_block").html(),o=$("#introduce");"string"==typeof n&&""===o.html()&&(o.html(e.htmlFiltrationScript(n)),t.clearIntervalTimeId(s.setMenuIntroduceTId))},setCalendar:function(){let e=$("#blogCalendar"),n=$("#blog-calendar"),o=$("#calendar-box");if(e.length>0&&""===o.html()){let e='<div id="blog-calendar">'+n.html()+"</div>";n.remove(),o.html(e),$("#blog-calendar").css("visibility","visible"),t.clearIntervalTimeId(s.setMenuCalendarTId)}},setSidebarSearch:function(){let e=$("#sidebar_search_box"),n=$("#sb-sidebarSearchBox");e.length>0&&""===n.html()&&(n.html('<div id="sb_widget_my_zzk" class="div_my_zzk"><input id="q" type="text" onkeydown="return zzk_go_enter(event);" class="input_my_zzk"></div>').prev(".m-list-title").show(),t.clearIntervalTimeId(s.setSidebarSearchTId))},setSidebarScorerank:function(){let e=$("#sidebar_scorerank ul li"),o=$("#sb-sidebarScorerank");e.length>0&&""===o.html()&&(o.html(n(e,"icon-collection_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setSidebarScorerankTId))},setSidebar:function(){let e=$("#sidebar_recentposts ul li"),o=$("#sb-sidebarRecentposts");e.length>0&&""===o.html()&&(o.html(n(e,"icon-time_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuSidebarTId))},setToptags:function(){let e=$("#sidebar_toptags ul li"),o=$("#sb-toptags");e.length>0&&""===o.html()&&(o.html(n(e,"icon-label_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuToptagsTId))},setClassify:function(){let e=$("#sidebar_postcategory ul li"),o=$("#sb-classify");e.length>0&&""===o.html()&&(o.html(n(e,"icon-marketing_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuClassifyTId))},setArticleCategory:function(){let e=$("#sidebar_articlecategory ul li"),o=$("#sb-ArticleCategory");e.length>0&&""===o.html()&&(o.html(n(e,"icon-marketing_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuArticleCategoryTId))},setArticle:function(){let e=$("#sidebar_articlearchive ul li"),o=$("#sb-articlearchive");e.length>0&&""===o.html()&&(o.html(n(e,"icon-document_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuArticleTId))},setRecord:function(){let e=$("#sidebar_postarchive ul li"),o=$("#sb-record");e.length>0&&""===o.html()&&(o.html(n(e,"icon-task_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuRecordTId))},setTopview:function(){let e=$("#TopViewPostsBlock ul li"),o=$("#sb-topview");e.length>0&&""===o.html()&&(o.html(n(e,"icon-browse_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuTopviewTId))},setTopDiggPosts:function(){let e=$("#TopDiggPostsBlock ul li"),o=$("#sb-topDiggPosts");e.length>0&&""===o.html()&&(o.html(n(e,"icon-like_fill")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuTopDiggPostsTId))},setCustomData:function(){let t=window.cnblogsConfig.menuCustomList;Object.keys(t).length>0&&$.each(t,function(t,e){let n='<div class="m-list-title" style="display: block;"><span>'+t+"</span></div>";n+='<div class="m-icon-list"><div><ul>',$.each(e.data,function(t,o){n+='<li><a href="'+o[1]+'">',n+='<span class="iconfont '+e.icon+'" style="color: #888;font-size: 14px;margin-right: 5px;"></span>',n+=o[0]+"</a></li>"}),n+="</ul></div></div>",$("#menuCustomList").append(n)})},setRecentComments:function(){let e=$("#sidebar_recentcomments ul"),n=$("#sb-recentComments");e.length>0&&""===n.html()&&(n.html(function(t,e){let n,o,i,s="<div><ul>",a=/^[1-9]+[0-9]*$/;if(t.find("li").length>2){if(n=t.find("li.recent_comment_title"),o=t.find("li.recent_comment_body"),i=t.find("li.recent_comment_author"),n.length!==o.length||n.length!==i.length)return;n.each(function(t){let l=$(n[t]),c=l.text()===l.html()?{}:$(l.html()),r=$.trim(l.text()).split(".");a.test(r[0])&&r.splice(0,1);let d=$.trim(r.join(".")),g='<span class="iconfont '+e+'" style="color: #888;font-size: 15px;margin-right: 5px;"></span>';c.length>0&&c.html(g+d),s+="<li>"+(c.length>0?c.prop("outerHTML"):"<a href='javascript:void(0);'>"+g+d+"</a>")+'<div style="padding-left: 1.5em;color: #777;position: relative;top: -5px;">'+$(o[t]).text()+'</div><div style="text-align: right;color: #444;position: relative;top: -10px;">'+$(i[t]).text()+"</div></li>"})}return s+="</ul></div>"}(e,"icon-pinglunzu")).prev(".m-list-title").show(),t.clearIntervalTimeId(s.setMenuRecentCommentsTId))}}},this.setMenuUserInfoImg=function(){window.cnblogsConfig.menuUserInfoBgImg&&$(".introduce-box").css({background:"#000 url("+window.cnblogsConfig.menuUserInfoBgImg+") center no-repeat","background-size":"100%"})},this.addFooter=function(){const n=$("#footer"),o="https://github.com/"+window.cnblogsConfig.GhUserName+"/"+window.cnblogsConfig.GhRepositories+"/tree/"+window.cnblogsConfig.CnVersions,i="https://github.com/"+window.cnblogsConfig.GhUserName+"/"+window.cnblogsConfig.GhRepositories+"/tree/"+window.cnblogsConfig.GhVersions;let a=n.text();n.html('<div class="footer-box"></div>');let l=$(".footer-box");switch((window.cnblogsConfig.bottomText.left||window.cnblogsConfig.bottomText.right)&&l.append('<div class="footer-text">[ '+window.cnblogsConfig.bottomText.left+'<span class="footer-text-icon"><span class="iconfont '+window.cnblogsConfig.bottomText.iconFont.icon+'" style="color: '+window.cnblogsConfig.bottomText.iconFont.color+";font-size: "+window.cnblogsConfig.bottomText.iconFont.fontSize+';"></span></span>'+window.cnblogsConfig.bottomText.right+" ]</div>"),l.append('<div><span id="blogRunTimeSpan"></span><span class="my-face">ღゝ◡╹)ノ♡</span></div>'),window.setInterval(function(){let t=e.getRunDate(window.cnblogsConfig.blogStartDate?window.cnblogsConfig.blogStartDate:"2019-01-01");$("#blogRunTimeSpan").text("This blog has running : "+t.daysold+" d "+t.hrsold+" h "+t.minsold+" m "+t.seconds+" s")},500),l.append('<div id="blogrollInfo"></div>'),function(){if(window.cnblogsConfig.bottomBlogroll.length>0){let t=window.cnblogsConfig.bottomBlogroll,e="友情链接：";for(let n=0;n<t.length;n++)e+='<a href="'+t[n][1]+'" target="_blank">'+t[n][0]+"</a>",n<t.length-1&&(e+='<span style="margin: 0 3px;">/</span>');$("#blogrollInfo").html(e)}}(),l.append("<div>"+a+"</div>"),l.append('<div id="cnzzInfo"></div>'),s.setCnzzTId=window.setInterval(function(){let e=$(".id_cnzz_stat_icon a");if(e.length>0){let n=[],o=$(e[1]).text().split("|");$.each(o,function(t){let e=$.trim(o[t]);""!==e&&(e=e.replace("今日","Today").replace("昨日","Yesterday").replace("[",":").replace("]",""),n.push(e))}),n.push($(e[2]).text().replace("当前在线","Online").replace("[",":").replace("]","")),$("#cnzzInfo").text(n.join(" | ")),t.clearIntervalTimeId(s.setCnzzTId)}},1e3),l.append('<div id="themeInfo"></div>'),$("#themeInfo").html('Theme version: <a href="'+o+'" target="_blank" style="color: #888;text-decoration: underline;">'+window.cnblogsConfig.CnVersions.substring(0,7)+'</a> / Loading theme version: <a href="'+i+'" target="_blank" style="color: #888;text-decoration: underline;">'+window.cnblogsConfig.GhVersions.substring(0,7)+"</a>"),parseInt(window.cnblogsConfig.footerStyle)){case 1:n.prepend('<div class="footer-image"></div>').addClass("footer-t1");break;case 2:default:n.prepend('<footer><footer-background><figure class="clouds"></figure><figure class="background"></figure><figure class="foreground"></figure></footer-background></footer>'),$("#footer .footer-text").css({"padding-bottom":"0","border-bottom":"none","margin-bottom":"0"})}},this.homeInit=function(){let n,o=window.cnblogsConfig.homeTopImg;n=o.length>0?o.length>1?o[e.randomNum(0,o.length-1)]:o[0]:"",$(".main-header").css({background:"#222 url("+encodeURI(n)+")  center center no-repeat","background-size":"cover"}),t.setHitokoto(),t.scrollMonitor(),t.setDomHomePosition()},this.homeInitAfter=function(){t.setHomePost(),t.setEntryPost(),$(".scroll-down").click(function(){let t;t=$("#home").offset().top+10,e.actScroll(t,1e3)}),s.setHomeRightMenuTId=window.setInterval(t.addHomeRightMenu,1e3),window.cnblogsConfig.homeTopAnimationRendered&&require(["circleMagic"],function(){$(".main-header").circleMagic(window.cnblogsConfig.homeTopAnimation)})},this.setHomePost=function(){let e=$("#main .c_b_p_desc_readmore"),n=$("#main .postTitle");e.text("阅读全文 »"),$.each(n,function(){let e=$(this),n=e.text(),o=e.nextAll(".postDesc:eq(0)").text();e.after(t.getPostMetaHtml(o)),/\[置顶\]/.test(n)&&e.append('<span class="postSticky">置顶</span>'),e.find("a").text(n.replace("[置顶]",""))})},this.setEntryPost=function(){let e=$("#main .entrylistPosttitle");$.each(e,function(){let e=$(this),n=e.nextAll(".entrylistItemPostDesc:eq(0)").text();e.after(t.getPostMetaHtml(n))})},this.setHitokoto=function(){let n=window.cnblogsConfig.homeBannerText,o=$("#hitokoto");if($.isArray(n)&&n.length>0){let t=e.randomNum(0,n.length-1);return o.text(n[t]).css("display","-webkit-box"),!0}if("string"==typeof n&&""!==n)return o.text(n).css("display","-webkit-box"),t.setDomHomePosition(),!0;let i=["每一个不曾起舞的日子，都是对生命的辜负。","公主死去了，屠龙的少年还在燃烧","我们听过无数的道理，却仍旧过不好这一生。","生如夏花之绚烂，死如秋叶之静美。","但凡不能杀死你的，最终都会使你更强大。","好看的皮囊千篇一律，有趣的灵魂万里挑一。","青春是一本太仓促的书，我们含着泪，一读再读。","教育就是当一个人把在学校所学全部忘光之后剩下的东西。","孤独不是一种脾性，而是一种无奈。","有时候你以为天要塌下来了，其实是自己站歪了。","温柔正确的人总是难以生存，因为这世界既不温柔，也不正确。","死并非生的对立面，而作为生的一部分永存。","不要努力成为一个成功者，要努力成为一个有价值的人。","不要因为走得太远，忘了我们为什么出发。","你的问题主要在于读书不多而想得太多。","岁月不饶人，我亦未曾饶过岁月。","当你凝视深渊时，深渊也在凝视着你。","有的人25岁就死了，只是到75岁才埋葬"],s={};switch(window.cnblogsConfig.homeBannerTextType){case"one":s={async:!0,crossDomain:!0,url:"https://sentence.iciba.com/index.php?callback=onecallback&c=dailysentence&m=getdetail&title="+e.getNowFormatDate(),method:"POST",dataType:"jsonp",headers:{"content-type":"application/x-www-form-urlencoded"},data:{TransCode:"030111",OpenId:"123456789",Body:""}},$.ajax(s).done(function(n){if(0===n.errno)o.text(n.note).css("display","-webkit-box"),$("#hitokotoAuthor").text(n.content).show();else{let t=e.randomNum(0,i.length-1);o.text(i[t]).css("display","-webkit-box")}return t.setDomHomePosition(),!1});break;case"jinrishici":default:s={async:!0,crossDomain:!0,url:"https://v2.jinrishici.com/one.json",method:"GET"},$.ajax(s).done(function(n){if(n&&"success"===n.status)o.text(n.data.content).css("display","-webkit-box"),$("#hitokotoAuthor").text("《"+n.data.origin.title+"》 - "+n.data.origin.dynasty+" - "+n.data.origin.author).show();else{let t=e.randomNum(0,i.length-1);o.text(i[t]).css("display","-webkit-box")}return t.setDomHomePosition(),!1})}},this.addHomeRightMenu=function(){const e=$("#rightMenu");if(e.length>0){let n='<div id="toUpDown" data="up"><span class="rightMenuSpan toUpDownSpan">返回顶部</span><div id="toUpDownI"><i class="iconfont icon-zhiding"></i></div></div>';e.prepend(n),t.rightMenuMous("#toUpDown",".toUpDownSpan");let o=""!==$("#p_b_follow").text()?$("#p_b_follow a").attr("onclick"):"",i="";i=!o||o.indexOf("unfollow")>0?'<div id="attention" clickflg="true"><span class="rightMenuSpan attentionSpan">已关注</span><i class="iconfont icon-dianzan1"></i></div>':'<div id="attention" onclick="'+o.replace("unfollow","follow")+'" clickflg="false"><span class="rightMenuSpan attentionSpan">关注</span><i class="iconfont icon-dianzan"></i></div>',e.prepend(i),t.rightMenuMous("#attention",".attentionSpan"),t.scrollMonitor(),t.clearIntervalTimeId(s.setHomeRightMenuTId)}},this.notHomeInit=function(){const e=$("#cb_post_title_url").text();$("#sbTitle").text(e),$(".inner").css("max-width","100vw"),t.setArticleInfoAuthor(),s.blogPostCategoryTId=window.setInterval(t.setArticleInfoClass,1e3),s.entryTagTId=window.setInterval(t.setArticleInfoTag,1e3),t.setDomHomePosition()},this.notHomeInitAfter=function(){t.setNotHomeTopImg(),$("#bookListFlg").length>0&&t.setBookList(),t.setCodeHighlighting(),t.baguetteBox(),require(["title","marvin","articleStatement"],function(){s.setCatalogTId=window.setInterval(t.initCatalog,1e3),t.scrollMonitor(),$("#sideCatalog-catalog").mCustomScrollbar({theme:"minimal-dark",axis:"yx"})}),s.setNotHomeRightMenuTId=window.setInterval(t.addNotHomeRightMenu,1e3),t.setCommentStyle()},this.setArticleInfoAuthor=function(){$("#articleInfo").append('<p class="article-info-text"></p>');let e=window.setInterval(function(){if("..."!==$("#post_view_count").text()&&"..."!==$("#post_comment_count").text()){let n=$(".postDesc").show().text();$("#articleInfo p.article-info-text").html(t.getPostMetaHtml(n)),t.clearIntervalTimeId(e)}},1e3)},this.getPostMetaInfo=function(t){t=t.replace(/[\r\n]/g,"");let e=$("#digg_count"),n=t.match(/.*posted\s*@\s*([0-9\-:\s]{16}).*阅读\s*\(([0-9]*)\).*评论\s*\(([0-9]*)\).*推荐\s*\(([0-9]*)\).*/)||t.match(/.*posted\s*@\s*([0-9\-:\s]{16}).*阅读\s*\(([0-9]*)\).*评论\s*\(([0-9]*)\).*/)||t.match(/.*posted\s*@\s*([0-9\-:\s]{16}).*/);return{date:void 0===n[1]?"1970-01-01 00:00":n[1],vnum:void 0===n[2]?"0":n[2],cnum:void 0===n[3]?"0":n[3],tnum:void 0===n[4]?e.length?e.text():"0":n[4]}},this.getPostMetaHtml=function(e){let n=t.getPostMetaInfo(e);return'<span class="postMeta"><i class="iconfont icon-time1"></i>发表于 '+n.date+'<i class="iconfont icon-browse"></i>阅读：'+n.vnum+'<i class="iconfont icon-interactive"></i>评论：'+n.cnum+'<i class="iconfont icon-hot"></i>推荐：'+n.tnum+"</span>"},this.setArticleInfoClass=function(){let e=$("#BlogPostCategory").find("a");e.length>0&&($.each(e,function(){let t=$(this);t.prepend('<span class="iconfont icon-marketing_fill"></span>'),$("#articleInfo").append('<a href="'+t.attr("href")+'" target="_blank"><span class="article-info-tag article-tag-class-color">'+t.text()+"</span></a>")}),t.clearIntervalTimeId(s.blogPostCategoryTId))},this.setArticleInfoTag=function(){let e=$("#EntryTag").find("a");e.length>0&&($.each(e,function(){let t=$(this);t.prepend('<span class="iconfont icon-label_fill"></span>'),$("#articleInfo").append('<a href="'+t.attr("href")+'" target="_blank"><span class="article-info-tag article-tag-color">'+t.text()+"</span></a>")}),t.clearIntervalTimeId(s.entryTagTId))},this.initCatalog=function(){const e=$("#sideToolbar");e.length>0&&(e.prepend('<span class="catalog-btn catalog-btn-shadow"><i class="iconfont icon-mulu"></i></span>').fadeIn(300),$(".catalog-btn").click(function(){let t=$(".sideCatalogBg");t.is(":hidden")?(t.fadeIn(300),$(this).removeClass("catalog-btn-shadow")):(t.fadeOut(300),$(this).addClass("catalog-btn-shadow"))}),t.resizeMonitor(),t.clearIntervalTimeId(s.setCatalogTId))},this.setNotHomeTopImg=function(){let t,n=window.cnblogsConfig.essayTopImg;if(t=n.length>0?n.length>1?n[e.randomNum(0,n.length-1)]:n[0]:"",$(".main-header").css({height:"40vh",background:"#222 url("+encodeURI(t)+")  center center no-repeat","background-size":"cover"}),$("#homeTopTitle").hide(),$(".scroll-down").hide(),$("#home").css("margin-top","40vh"),$("#cb_post_title_url").addClass("post-del-title"),window.cnblogsConfig.essayTopAnimationRendered){if(window.cnblogsConfig.essayTopAnimation.colorsRandom){let t=[];t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),t.push(e.getRandomColor()),window.cnblogsConfig.essayTopAnimation.colors=t}require(["TweenMax_MyTween"],function(){initCanvas("notHomeTopCanvas"),start()})}},this.baguetteBox=function(){const t=$("#cnblogs_post_body"),e=$("#cnblogs_post_body img");t.length>0&&e.length>0&&$.each(e,function(t){let n=$(e[t]);n.hasClass("code_img_closed")||n.hasClass("code_img_opened")||n.wrap('<a data-fancybox="gallery" href="'+n.attr("src")+'"></a>')}),require(["fancybox"])},this.setBookList=function(){if(window.cnblogsConfig.bookList.length>0){let t=$("#cnblogs_post_body"),e="";$.each(window.cnblogsConfig.bookList,function(t){let n=window.cnblogsConfig.bookList[t];e+="<h1>"+n.title+"</h1>",$.each(n.books,function(t){let o=n.books[t];e+='<div class="books-item">    <span class="books-item-span">        <div class="_1P9uD _3D3vq">            <div class="_2aw_6">'+(t+1)+'</div>        </div>        <div class="_28asT">            <svg>                <image xlink:href="'+o.cover+'" x="0" y="0" width="100%" height="100%"></image>            </svg>        </div>        <div class="_34CGc">            <div class="_2girK">                <div>                    <div class="_1P9dH">'+(o.name?o.name:"")+"                    </div>"+(o.formerNname?'<div class="_3Oa5I"><span class="_6Y7v3">原名：</span>'+o.formerNname+"</div>":"")+(o.author?'<div class="_3Oa5I"><span class="_6Y7v3">作者：</span>'+o.author+"</div>":"")+(o.translator?'<div class="_3Oa5I"><span class="_6Y7v3">译者：</span>'+o.translator+"</div>":"")+(o.press?'<div class="_3Oa5I"><span class="_6Y7v3">出版社：</span>'+o.press+"</div>":"")+(o.year?'<div class="_3Oa5I"><span class="_6Y7v3">出版年：</span>'+o.year+"</div>":"")+"                </div>            </div>        </div>    </span></div>"})}),t.append(e)}},this.setCodeHighlighting=function(){let n=$(".post pre"),o=$(".cnblogs_code span"),i=window.cnblogsConfig.essayCodeHighlightingType.toLowerCase(),s=window.cnblogsConfig.essayCodeHighlighting.toLowerCase();switch(i){case"highlightjs":l(1),e.dynamicLoadingCss("https://cdn.jsdelivr.net/gh/"+window.cnblogsConfig.GhUserName+"/"+window.cnblogsConfig.GhRepositories+"@"+window.cnblogsConfig.GhVersions+"/src/style/highlightjs/"+s+".min.css"),require(["highlightjs"],function(){$(".post pre").each(function(t,e){-1!==$.inArray(s,["github-gist","googlecode","grayscale","idea","isbl-editor-light","qtcreator_light","tomorrow","vs","xcode","arduino-light","ascetic","color-brewer","lightfair"])&&n.css("background-color","#f6f8fa"),hljs.highlightBlock(e)})});break;case"prettify":l(1),function(){switch(n.addClass("prettyprint"),s){case"prettify":require(["codePrettify"],function(){$("pre").css("background-color","#f6f8fa").css("border","0")});break;case"desert":require(["codeDesert"]);break;case"sunburst":require(["codeSunburst"]);break;case"obsidian":require(["codeObsidian"]);break;case"doxy":require(["codeDoxy"]);break;default:a()}}();break;case"cnblogs":default:l(2),a()}function a(){o.css("background-color","#f6f8fa"),n.css({"background-color":"#f6f8fa","overflow-x":"auto"}),$("code.hljs").each(function(){let t=$(this);t.after(t.html()),t.remove()})}function l(o){window.cnblogsConfig.hook.beforeCodeHighlighting(t);let i="font-family:"+window.cnblogsConfig.essayCode.fontFamily+" !important; font-size: "+window.cnblogsConfig.essayCode.fontSize+" !important;";window.cnblogsConfig.codeMaxHeight&&(i+="max-height: 70vh;"),n.css("cssText",i),$.each(n,function(t){let n,i=$(this),s="pre-"+e.randomString(6),a="";switch(o){case 1:n=i.text().split("\n");break;case 2:n=i.html().split("\n")}i.html('<code-pre class="code-pre" id="'+s+'"></code-pre>'),$.each(n,function(t){let i=t===n.length-1,s=i?"":"\n";switch(i?n[t]&&"</code>"!==n[t]&&(a+='<code-line class="line-numbers-rows"></code-line>'):a+='<code-line class="line-numbers-rows"></code-line>',o){case 1:a+=e.HTMLEncode(n[t])+s;break;case 2:a+=n[t]+s}});let l=$("#"+s);l.append(a),window.cnblogsConfig.codeLineNumber&&l.addClass("code-pre-line")}),window.cnblogsConfig.codeLineNumber&&$(".line-numbers-rows").show()}!function(){e.dynamicLoadingCss(getJsDelivrUrl("jquery.mCustomScrollbar.css"));let n=window.setInterval(function(){if($(".post pre span").length>0){let e;switch($(".post pre").mCustomScrollbar({theme:"minimal-dark",axis:"yx"}),i){case"highlightjs":e=$(".hljs-comment").css("color"),$(".mCSB_dragger_bar").css("background-color",e);break;case"prettify":e=$(".com").css("color"),$(".mCSB_dragger_bar").css("background-color",e);break;case"cnblogs":e="rgb(153, 153, 153)"}$("code-box button").css("color",e),t.clearIntervalTimeId(n)}},500)}(),$(".cnblogs_code_toolbar").remove(),require(["clipboard"],function(){n.each(function(t){let n=$(this),o=e.randomString(6);n.wrap('<code-box id="'+o+'" style="position: relative;display: block;"></code-box>'),n.attr("id","pre-"+o);let i='<button code-id="'+o+'" type="button" class="clipboard code-copay-btn" data-clipboard-action="copy" data-clipboard-target="#pre-'+o+'" aria-label="复制代码" ><i class="iconfont icon-fuzhi1"></i></button>';$("#"+o).prepend(i)}),$("code-box button").click(function(){$(this).find("i").removeClass("icon-fuzhi1").addClass("icon-right"),setTimeout("$('code-box button[code-id="+$(this).attr("code-id")+"] i').removeClass('icon-right').addClass('icon-fuzhi1')",1500)}),$("code-box").on({mouseover:function(){$(this).find("button").css({opacity:1,visibility:"visible"})},mouseout:function(){$(this).find("button").css({opacity:0,visibility:"hidden"})}}),new ClipboardJS(".clipboard")}),window.cnblogsConfig.hook.afterCodeHighlighting(t)},this.setCommentStyle=function(){s.commentTId=window.setInterval(function(){$(".feedbackItem").length>0&&(!function(){let t=$(".feedbackItem");if(t.length>0){$.each(t,function(t){let e=$(this),n=e.find(".feedbackCon"),o=e.find(".feedbackListSubtitle"),i=n.length?n.find(".blog_comment_body"):[],s="",a=i.length?i.attr("id").split("_"):void 0;if(a&&a.length>0){let t=a[a.length-1],n=t.toString().match(/[0-9]/g);$.isArray(n)&&(t=n.join(""));let o=$("#comment_"+t+"_avatar"),i=o.length>0?$.trim(o.text()):"https://cdn.jsdelivr.net/gh/BNDong/Cnblogs-Theme-SimpleMemory@master/img/webp/default_avatar.webp",l=$("#a_comment_author_"+t),c=l.length?l.attr("href"):"javascropt:void(0);";s='<div class="feedbackAvatar"><a href="'+c+'" target="_blank"><img src="'+i+'"/></a></div>',e.prepend(s)}o.length&&o.find(".louzhu").length&&o.addClass("feedbackListSubtitle-louzhu")}),$(t[0]).css("padding-top","0"),$(t[t.length-1]).css("padding-bottom","0");let e="font-family:"+window.cnblogsConfig.essayCode.fontFamily+" !important; font-size: "+window.cnblogsConfig.essayCode.fontSize+" !important; border-radius: 5px;padding: 10px;";"cnblogs"===window.cnblogsConfig.essayCodeHighlightingType&&(e+="color: #000;"),$("head").append("<style>.feedbackCon pre {"+e+"background-color: "+$(".postBody pre").css("background-color")+" !important;}</style>")}}(),t.clearIntervalTimeId(s.commentTId))},1e3)},this.addNotHomeRightMenu=function(){let e=$("#rightMenu");if(e.length>0){if(0===$("#toUpDown").length&&0===$("#attention").length&&t.addHomeRightMenu(),$("#div_digg").length>0){let n='<div id="rightBuryit" clickflg="false" onclick="'+$(".buryit").attr("onclick")+'"><span class="rightMenuSpan rightBuryitSpan">'+$("#bury_count").text()+'</span><i class="iconfont icon-buzan"></i></div>';e.prepend(n),t.rightMenuMous("#rightBuryit",".rightBuryitSpan");let o='<div id="rightDiggit" clickflg="false" onclick="'+$(".diggit").attr("onclick")+'"><span class="rightMenuSpan rightDiggitSpan">'+$("#digg_count").text()+'</span><i class="iconfont icon-zan1"></i></div>';e.prepend(o),t.rightMenuMous("#rightDiggit",".rightDiggitSpan")}if(window.cnblogsConfig.reward.enable&&(window.cnblogsConfig.reward.alipay||window.cnblogsConfig.reward.wechatpay)){let n='<div id="rightDashang" clickflg="false"><span class="rightMenuSpan rightDanshanSpan"><div class="ds-pay">'+(window.cnblogsConfig.reward.alipay?'<div class="ds-alipay"><img src="'+window.cnblogsConfig.reward.alipay+'"><span>Alipay</span></div>':"")+(window.cnblogsConfig.reward.wechatpay?'<div class="ds-wecat"><img src="'+window.cnblogsConfig.reward.wechatpay+'"><span>WeChat</span></div>':"")+'</div></span><i class="iconfont icon-dashang2"></i></div>';e.prepend(n),t.rightMenuMous("#rightDashang",".rightDanshanSpan")}if(window.cnblogsConfig.weChatOfficialAccounts){let n='<div id="rightGzh" clickflg="false"><span class="rightMenuSpan rightGzhSpan"><div class="ds-pay"><div class="ds-gzh"><img src="'+window.cnblogsConfig.weChatOfficialAccounts+'"><span>公众号</span></div></div></span><i class="iconfont icon-gongzhonghaoerweima"></i></div>';e.prepend(n),t.rightMenuMous("#rightGzh",".rightGzhSpan")}t.clearIntervalTimeId(s.setNotHomeRightMenuTId)}}}
//# sourceMappingURL=/sm/a78c250ac92b4e354f6fafe17f6cf7558a021e8614ce0abca79cd696a4c85f9e.map