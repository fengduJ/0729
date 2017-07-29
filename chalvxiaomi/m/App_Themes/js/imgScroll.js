;
window.Swipe=function(element,options){
	if(!element)return null;
	var _this=this;
	this.options=options||{};
	this.index=this.options.startSlide||0;
	this.speed=this.options.speed||300;
	this.callback=this.options.callback||function(){};
	this.delay=this.options.auto||0;
	this.container=element;
	this.element=this.container.children[0];
	this.container.style.overflow='hidden';
	this.element.style.listStyle='none';
	this.element.style.margin=0;
	this.setup();
	this.begin();
	if(this.element.addEventListener){
		this.element.addEventListener('touchstart',this,false);
		this.element.addEventListener('touchmove',this,false);
		this.element.addEventListener('touchend',this,false);
		this.element.addEventListener('touchcancel',this,false);
		this.element.addEventListener('webkitTransitionEnd',this,false);
		this.element.addEventListener('msTransitionEnd',this,false);
		this.element.addEventListener('oTransitionEnd',this,false);
		this.element.addEventListener('transitionend',this,false);
		window.addEventListener('resize',this,false)
	}
};
Swipe.prototype={
	setup:function(){
		this.slides=this.element.children;
		this.length=this.slides.length;
		if(this.length<2)return null;
		this.width=Math.ceil(("getBoundingClientRect"in this.container)?this.container.getBoundingClientRect().width:this.container.offsetWidth);
		if(this.width===0&&typeof window.getComputedStyle==='function'){
			this.width=window.getComputedStyle(this.container,null).width.replace('px','')
		}
		if(!this.width)return null;
		var origVisibility=this.container.style.visibility;
		this.container.style.visibility='hidden';
		this.element.style.width=Math.ceil(this.slides.length*this.width)+'px';
		var index=this.slides.length;
		while(index--){
			var el=this.slides[index];
			el.style.width=this.width+'px';
			el.style.display='table-cell';
			el.style.verticalAlign='top'
		}
		this.slide(this.index,0);
		this.container.style.visibility=origVisibility
	}
	,slide:function(index,duration){
		var style=this.element.style;
		if(duration==undefined){
			duration=this.speed
		}
		style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration=duration+'ms';
		style.MozTransform=style.webkitTransform='translate3d('+ -(index*this.width)+'px,0,0)';
		style.msTransform=style.OTransform='translateX('+ -(index*this.width)+'px)';
		this.index=index
	}
	,getPos:function(){
		return this.index
	}
	,prev:function(delay){
		this.delay=delay||0;
		clearTimeout(this.interval);
		if(this.index)this.slide(this.index-1,this.speed);
		else this.slide(this.length-1,this.speed)
	}
	,next:function(delay){
		this.delay=delay||0;
		clearTimeout(this.interval);
		if(this.index<this.length-1)this.slide(this.index+1,this.speed);
		else this.slide(0,this.speed)
	}
	,begin:function(){
		var _this=this;
		this.interval=(this.delay)?setTimeout(function(){
			_this.next(_this.delay)
		}
		,this.delay):0
	}
	,stop:function(){
		this.delay=0;
		clearTimeout(this.interval)
	}
	,resume:function(){
		this.delay=this.options.auto||0;
		this.begin()
	}
	,handleEvent:function(e){
		switch(e.type){
			case'touchstart':this.onTouchStart(e);
			break;
			case'touchmove':this.onTouchMove(e);
			break;
			case'touchcancel':case'touchend':this.onTouchEnd(e);
			break;
			case'webkitTransitionEnd':case'msTransitionEnd':case'oTransitionEnd':case'transitionend':this.transitionEnd(e);
			break;
			case'resize':this.setup();
			break
		}
	}
	,transitionEnd:function(e){
		if(this.delay)this.begin();
		this.callback(e,this.index,this.slides[this.index])
	}
	,onTouchStart:function(e){
		this.start={
			pageX:e.touches[0].pageX,pageY:e.touches[0].pageY,time:Number(new Date())
		};
		this.isScrolling=undefined;
		this.deltaX=0;
		this.element.style.MozTransitionDuration=this.element.style.webkitTransitionDuration=0;
		e.stopPropagation()
	}
	,onTouchMove:function(e){
		if(e.touches.length>1||e.scale&&e.scale!==1)return;
		this.deltaX=e.touches[0].pageX-this.start.pageX;
		if(typeof this.isScrolling=='undefined'){
			this.isScrolling=!!(this.isScrolling||Math.abs(this.deltaX)<Math.abs(e.touches[0].pageY-this.start.pageY))
		}
		if(!this.isScrolling){
			e.preventDefault();
			clearTimeout(this.interval);
			this.deltaX=this.deltaX/((!this.index&&this.deltaX>0||this.index==this.length-1&&this.deltaX<0)?(Math.abs(this.deltaX)/this.width+1):1);
			this.element.style.MozTransform=this.element.style.webkitTransform='translate3d('+(this.deltaX-this.index*this.width)+'px,0,0)';
			e.stopPropagation()
		}
	}
	,onTouchEnd:function(e){
		var isValidSlide=Number(new Date())-this.start.time<250&&Math.abs(this.deltaX)>20||Math.abs(this.deltaX)>this.width/2,isPastBounds=!this.index&&this.deltaX>0||this.index==this.length-1&&this.deltaX<0;
		if(!this.isScrolling){
			this.slide(this.index+(isValidSlide&&!isPastBounds?(this.deltaX<0?1:-1):0),this.speed)
		}
		e.stopPropagation()
	}
};

$(function(){
	function imgSlideInit(sId){
		var oSlider=$(sId),nav=oSlider.next(),id=sId.substr(1),count=1;
		id=new Swipe(document.getElementById(id),{
			startSlide:0,auto:4000,speed:400,callback:function(event,index,elem){
				var oImg=oSlider.find('img'),len=oImg.length,maxCount=len-2;
				nav.find('.i_point').removeClass('active');
				nav.find('.i_point').eq(index).addClass('active');
				if(count<=maxCount){
					if(index>=1&&index<=maxCount){
						var currImg=oImg.eq(index+1),src=currImg.attr('data-src');
						currImg.attr('src',src)
					}
					count++
				}
			}
		})
	}
	function tabSlideInit(sId){
		var oSlider=$(sId),nav=oSlider.prev(),id=sId.substr(1),obj=sId.substr(1);
		obj=new Swipe(document.getElementById(id),{
			startSlide:0,speed:200,callback:function(event,index,elem){
				var oLi=nav.find('li');
				if(oLi.length>1){
					nav.find('li.on').removeClass('on');
					oLi.eq(index).addClass('on')
				}
			}
		});
		nav.find('li').click(function(){
			var i=nav.find('li').index(this);
			obj.slide(i,200)
		})
	}
	function SSEchange(){
		var list=$('.stockBox').find('.stock_text'),len=list.length;
		if(len<2)return;
		if(SSEtimer)clearInterval(SSEtimer);
		SSEtimer=setInterval(function(){
			list.addClass("hidden").eq(iNow).removeClass("hidden");
			iNow++;
			if(iNow==len){
				iNow=0
			}
		}
		,3000)
	}
	function addOnscroll(fn){
		if(typeof window.onscroll=='function'){
			var tempFn=window.onscroll;
			window.onscroll=function(){
				tempFn();
				fn()
			}
		}
		else{
			window.onscroll=function(){
				fn()
			}
		}
	}
	function imgLoading(){
		addOnscroll(function(){
			var b=$(".nav_content_item[data-role=lazy]");
			$.each(b,function(l,j){
				var c=$(j).index();
				var d=$(j).parents(".nav_content_list").eq(0).prev();
				var f=d.find(".on");
				var o=(f.size()>0)?f.index():0;
				if(c!=o&&d.find("li").length>1){
					return
				}
				var h=document.documentElement.scrollTop||document.body.scrollTop;
				var g=document.documentElement.clientHeight;
				var e=j.getBoundingClientRect().top;
				var k=e-h;
				if(e<0||(e>0&&k<=1.5*g)){
					var m=$(j).find("img");
					if(!j.getAttribute("data-unload")){
						$.each(m,function(i,n){
							var q=n.getAttribute("data-src");
							n.src=q
						});
						j.setAttribute("data-unload",0)
					}
				}
			})
		})
	}
	function TabBindEvent(index){
		setTimeout(function(){
			var id='#floor'+index;
			tabSlideInit(id);
			index=parseInt(index)+1;
			var nextId='#floor'+index;
			if(index<=13&&$(nextId).length>0){
				TabBindEvent(index)
			}
		}
		,200)
	}
	setTimeout(function(){
		imgSlideInit('#imgSlide');
		TabBindEvent(1)
	}
	,400)
})