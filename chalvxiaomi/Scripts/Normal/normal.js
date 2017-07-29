/*为什么选择我们*/
$(function () {
	$('.bubbleInfo').each(function () {
		var distance = 0;
		var time = 0;
		var hideDelay = 0;

		var hideDelayTimer = null;

		var beingShown = false;
		var shown = false;
		var trigger = $('.trigger', this);
		var info = $('.popup', this).css('opacity', 0);


		$([trigger.get(0), info.get(0)]).mouseover(function () {
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			if (beingShown || shown) {
				// don't trigger the animation again
				return;
			} else {
				// reset position of info box
				beingShown = true;

				info.css({
					
					display: 'block'
				}).animate({
					top: '-=' + distance + 'px',
					opacity: 1
				}, time, 'swing', function() {
					beingShown = false;
					shown = true;
				});
			}

			return false;
		}).mouseout(function () {
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			hideDelayTimer = setTimeout(function () {
				hideDelayTimer = null;
				info.animate({
					top: '-=' + distance + 'px',
					opacity: 0
				}, time, 'swing', function () {
					shown = false;
					info.css('display', 'none');
				});

			}, hideDelay);

			return false;
		});
	});
});




/*服务介绍*/
$(function(){
	var spLength = $('.slide_point span').length,
		scimgWidth = $(window).width(),
		sulWidth = scimgWidth * spLength,
		sNum = 0;
		$(".slide_cont ul").width(sulWidth);
		$(".slide_cont ul li").width(scimgWidth);
	//var sTimer = setInterval(moveSlide,2000);
	function moveSlide(){
			sNum++;
			if (sNum >= spLength) {
				sNum = 0;
			};
			showPics(sNum);
		}
	//鼠标移入下方的块进行滚动
	$('.slide_point span').click(function(){
			//clearInterval(sTimer);
			sNum = $(this).index();
			showPics(sNum);
		});
	//图片自动滚动
	function showPics(sNum){
		$(".slide_point span").eq(sNum).addClass("cur_point").siblings().removeClass("cur_point");
		$(".slide_cont ul").animate({
			"margin-left" : -scimgWidth * sNum 
		});

	}
});


/*下拉导航*/
jQuery(document).ready(function(){
	var qcloud={};
	$('[_t_nav]').hover(function(){
		var _nav = $(this).attr('_t_nav');
		clearTimeout( qcloud[ _nav + '_timer' ] );
		qcloud[ _nav + '_timer' ] = setTimeout(function(){
		$('[_t_nav]').each(function(){
		$(this)[ _nav == $(this).attr('_t_nav') ? 'addClass':'removeClass' ]('nav-up-selected');
		});
		$('#'+_nav).stop(true,true).slideDown(200);
		}, 150);
	},function(){
		var _nav = $(this).attr('_t_nav');
		clearTimeout( qcloud[ _nav + '_timer' ] );
		qcloud[ _nav + '_timer' ] = setTimeout(function(){
		$('[_t_nav]').removeClass('nav-up-selected');
		$('#'+_nav).stop(true,true).slideUp(200);
		}, 150);
	});
});

/*在线客服和意见反馈*/
$(function(){
	var tophtml="<div id=\"izl_rmenu\" class=\"izl-rmenu\"><a href=\"#\" class=\"btn btn-qq\"></a><a href=\"../Member/feedback.html\"><div class=\"btn btn-wx\"></div></a><div class=\"btn btn-top\"></div></div>";
	$("#top").html(tophtml);
	$("#izl_rmenu").each(function(){
		$(this).find(".btn-wx").mouseenter(function(){
			$(this).find(".pic").fadeIn("fast");
		});
		$(this).find(".btn-wx").mouseleave(function(){
			$(this).find(".pic").fadeOut("fast");
		});
		$(this).find(".btn-top").click(function(){
			$("html, body").animate({
				"scroll-top":0
			},"fast");
		});
	});
	var lastRmenuStatus=false;
	$(window).scroll(function(){//bug
		var _top=$(window).scrollTop();
		if(_top>200){
			$("#izl_rmenu").data("expanded",true);
		}else{
			$("#izl_rmenu").data("expanded",false);
		}
		if($("#izl_rmenu").data("expanded")!=lastRmenuStatus){
			lastRmenuStatus=$("#izl_rmenu").data("expanded");
			if(lastRmenuStatus){
				$("#izl_rmenu .btn-top").slideDown();
			}else{
				$("#izl_rmenu .btn-top").slideUp();
			}
		}
	});
});

/*我的差旅左边导航*/
$(function(){
	$(".subNav").click(function(){
		$(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
		$(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
		$(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(500);
	})	
})