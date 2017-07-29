    
	
	$(function(){
		$("#forcontiy").kuCity();
	    $("#tocontiy").kuCity();
		//获取用户名 和公司id
		
		var User= JSON.parse(localStorage.getItem("objs"))
        	//console.log(User);
        	$("#username").html(User.TrueName);
        	$("#eld").html(User.EID);
		
		
		$("#time").dateSelect();
	  var obj=JSON.parse(sessionStorage.getItem('obj'));
	  //console.log(obj);
	  
	  if(obj.contiyfor){
	  	var forcontiy=obj.contiyfor;
	  }else{
	  	var forcontiy="上海"
	  };
	  if(obj.contiyto){
	  	var tocontiy=obj.contiyto;
	  }else{
	  	var tocontiy="北京";
	  }
	  var time=obj.data;
	  //console.log(obj.isDS)
	  if(obj.isDS){
	  	$(".serarch-type").find("a").eq(0).addClass("active").siblings().removeClass("active")
	  }else{
	  	$(".serarch-type").find("a").eq(1).addClass("active").siblings().removeClass("active")
	  }
	  var isDS=obj.isDS;
	  $(".serarch-type").find("a").click(function(){
	  	isDS=!isDS;
	  	$(this).addClass("active").siblings().removeClass("active")
	  })
	  
	  $("#tophref").html(forcontiy+"-"+tocontiy);
	  $("#forcontiy").val(forcontiy);
	  $("#tocontiy").val(tocontiy);
	  $("#time").val(time);
	  /*目的地的切换*/
	  $("#huan").click(function(){
			var huan="";
			huan=$("#tocontiy").val();
			$("#tocontiy").val($("#forcontiy").val());
			$("#forcontiy").val(huan);
			
		});


      //星期
	  var newtime=new Date(time);
	  var week =newtime.getDay();
	  var nowweek="";
	  function weeks(week){
	  	switch (week){
	  		case 0:nowweek="星期日";break;
	  		case 1:nowweek="星期一";break;
	  		case 2:nowweek="星期二";break;
	  		case 3:nowweek="星期三";break;
	  		case 4:nowweek="星期四";break;
	  		case 5:nowweek="星期五";break;
	  		case 6:nowweek="星期六";break;
	  	}
	  };
	  
	  weeks(week)
	  $("#text").html(forcontiy+"-"+tocontiy+"("+time+nowweek+")")
	 
	 //日期导航条的加载
	  for(i=0;i<70;i++){
		var nowweek="";
		var time=new Date();
	var times=new Date((+time)+(i*24*3600*1000))
	var week =times.getDay();
	var y =times.getFullYear();
	var m =parseInt(times.getMonth()+1);
	m=m>=10?m:"0"+m;
	var d =parseInt(times.getDate());
	d=d>=10?d:"0"+d;
	weeks(week)
	$("#timelist").append(
		'<li><a href="#"><span>'+m+'-'+d+'</span>'+nowweek+'</a></li>'
	)
	};
	
	
	
	  //左右切换时间导航条
	 var btnnumber=0; 
	$(".air-week-btn-prev").click(function(){
		btnnumber--;
		$(".air-week-btn-next").removeClass("disbland")
		if(btnnumber<=0){
			btnnumber=0;
			$(this).addClass("disbland")
		}else{
			$(this).removeClass("disbland");
		}
		$("#timelist").animate({
			left:-btnnumber*1099+"px"
		});
		//console.log(btnnumber)
	})
	
	$(".air-week-btn-next").click(function(){
		$(".air-week-btn-prev").removeClass("disbland");
		btnnumber++;
		if(btnnumber>=7){
			btnnumber=7;
			$(this).addClass("disbland")
		}else{
			$(this).removeClass("disbland");
		};
		$("#timelist").animate({
			left:-btnnumber*1099+"px"
		});
		//console.log(btnnumber)
	})
	
	  //判断日期同
	  function timesame(times){
	  	 $("#timelist").find("li").each(function(index){
	  	 	var n="2017"+"-"+$(this).find("span").html();
	  	 	
	  	 	if(times==n){
	  	 		$("#timelist").find("li").eq(index).addClass("active").siblings().removeClass("active");
	  	 		bdtime(times)
	  	 	}
	  	 });
	  	
	  }
	  timesame($("#time").val());
	  //判断时间导航条位置
        function bdtime(n){
        	var m1 ="2017"+"-"+$("#timelist").find("li").eq(0).find("span").html()
        	var newdate=Date.parse(new Date(m1));
        	var olddate=Date.parse(new Date(n));
        	var m =parseInt((olddate-newdate)/24/60/60/1000/7);
        	//console.log(m);
        	btnnumber=m;
        	if(m==0){
        	$(".air-week-btn-prev").addClass("disbland");	
        	}
             $("#timelist").css({
			   left:-m*1099+"px"
		    });
        }

	  //数据的切换
	$("#timelist").find("li").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
	  var n=$(this).find("span").html();
	  //console.log(n)
	  $("#time").val("2017"+"-"+n);
	  var newtime=new Date($("#time").val());
	    var week =newtime.getDay();
	    weeks(week);
	  $("#text").html($("#forcontiy").val()+"-"+$("#tocontiy").val()+"("+$("#time").val()+nowweek+")")
	  toobj()
	})
	 
	  
	  
	  
	  //请求数据 函数
	function toobj(){
		$(".train-load").show();
		$(".train-list").hide();
		 $(".searchlist-no").hide();
		 $("#ulList").html("");
		 var postData ={
    //请求头参数
    "RequestMetaInfo":{
        "SiteId": 1,//站点编号
        "TimeSpan": 1,//时间戳
        "Sign": 1//签名
    },
    //请求业务参数
    Data:{
    "FromStation":$("#forcontiy").val() , //出发城市 （必填）
    "ToStation": $("#tocontiy").val(), //到达城市（必填）
    "FromDate": $("#time").val() //出发日期（必填）
     }};
    $.ajax({
    url:'http://apitest.sec91.com/Train/DownLoadTrainLine',
    data:{data:JSON.stringify(postData)},
    dataType:'json',
    type:'post',
    success:function(data){
    	/*车次*/
    	if(data.ResponseMetaInfo.StatusCode=="0"){
    		$("#number").html(data.Data.DataList.length)
             //console.log(data);
             
            $(".searchlist-no").hide();
    		$(".train-list").show();
    		$(".train-load").hide();
    		//循环数据
           for(item of data.Data.DataList){
           	var h =parseInt(item.RunTime/60);
           	var m =parseFloat(item.RunTime-h*60);
           
        	$("#ulList").append(
        		'<li>'+
              '<table width="1178" border="0" cellspacing="0" cellpadding="0" class="train-loop-list-tab">'+
                '<tr>'+
                  '<td width="168"><p class="train-list-second"><strong class="trainCode">'+item.TrainCode+'</strong><span class="traintype">'+item.TrainType+'</span></p>'+
                    '<div class="train-list-stop" style="display:none"><a href="#">经停站<i></i></a> '+
                  '<td width="168"><p class="train-departure-time starttime">'+item.GoTime+'</p>'+
                    '<p class="endtime">'+item.ETime+'</p></td>'+
                  '<td width="168"><p><span id="start">'+item.SFTypeStart+'</span><span class="Strain">'+item.StationS+'</span></p>'+
                    '<p><span id="end">'+item.SFTypeEnd+'</span><span class="Etrain">'+item.StationE+'</span></p></td>'+
                  '<td width="168">'+h+'小时'+m+'分</td>'+
                  '<td width="219"><div class="train-list-price"><span class="traintype">无座</span><span><em>¥</em><span class="showno">'+item.WZ+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">硬座</span><span><em>¥</em><span class="showno">'+item.YZ+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">软座</span><span><em>¥</em><span class="showno">'+item.RZ+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">硬卧</span><span><em>¥</em><span class="showno">'+item.YW+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">软卧</span><span><em>¥</em><span class="showno">'+item.RW+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">高级软卧</span><span><em>¥</em><span class="showno">'+item.GJRW+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">二等座</span><span><em>¥</em><span class="showno">'+item.EDZ+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">一等座</span><span><em>¥</em><span class="showno">'+item.YDZ+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">特等座</span><span><em>¥</em><span class="showno">'+item.TZ+'</span></span></div>'+
                    '<div class="train-list-price"><span class="traintype">商务座</span><span><em>¥</em><span class="showno">'+item.SWZ+'</span></span></div></td>'+
                  '<td width="171"><div class="train-list-ticket">'+item.WZ_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.YZ_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.RZ_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.YW_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.RW_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.GJRW_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.EDZ_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.YDZ_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.TZ_Y+'</div>'+
                    '<div class="train-list-ticket">'+item.SWZ_Y+'</div></td>'+
                  '<td width="116"><div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div>'+
                    '<div class="train-list-book">'+
                      '<input type="button" value="预订" class="train-list-book-btn">'+
                    '</div></td>'+
                '</tr>'+
              '</table>'+
            '</li>'

        	)
        	
         }
           //跳转预订
           $(".train-list-book").find(".train-list-book-btn").click(function(){
           	var parents = $(this).parents("li");
           	var index = $(this).parent().index();
           	//console.log(index)
           	   var trains={
           	    	IsDS:isDS,
           	   	    Time:$("#time").val(),
           	   	    TrainNo:parents.find(".trainCode").html(),
           	   	    StartCity:parents.find(".Strain").html(),
           	   	    EndCity:parents.find(".Etrain").html(),
           	   	    STime:parents.find(".starttime").html(),
           	   	    Etime:parents.find(".endtime").html(),
           	   	    SeatType:parents.find(".train-list-price").eq(index).find(".traintype").html(),
           	   	    Price:parents.find(".train-list-price").eq(index).find(".showno").html()
           	   }
           	        // console.log(trains);
           	         
           	sessionStorage.setItem("train",JSON.stringify(trains));
           	/*var mm =JSON.parse(sessionStorage.getItem("train"));
           	console.log(mm)*/
           	   location='order.html';
           })
           
           //座位的显示隐藏
           $(".showno").each(function(index){
           	if($(this).html()){
           		$(this).show();
           		var price=$(".train-list-ticket").eq(index).html();
           		if(!price){
           			$(".train-list-ticket").eq(index).html(0);
           			$(".train-list-ticket").eq(index).css({color:"#999"});
           			$(".train-list-book").eq(index).find(".train-list-book-btn").attr("disabled","disabled");
           			$(".train-list-book").eq(index).find(".train-list-book-btn").addClass("disabled");
           		}else if(price>=100){
           			$(".train-list-ticket").eq(index).html("充足");
           		}
           	}else{
           		$(this).parent().parent().hide();
           		$(".train-list-ticket").eq(index).hide();
           		$(".train-list-book").eq(index).hide();
           	}
           });
           $("#ulList li").each(function(index){
           var wzprice= $(this).find(".train-list-ticket").eq(0).html();
           var Start=$(this).find("#start").html();
           var End=$(this).find("#end").html();
              switch (Start){
              	case "始":$(this).find("#start").css({background:"#588d01"});
              		break;
              	case "过":$(this).find("#start").css({background:"#2da1e7"});
              		break;
              	case "终":$(this).find("#start").css({background:"#ff6600"});
              		break;
              };
              switch (End){
              	case "始":$(this).find("#end").css({background:"#588d01"});
              		break;
              	case "过":$(this).find("#end").css({background:"#2da1e7"});
              		break;
              	case "终":$(this).find("#end").css({background:"#ff6600"});
              		break;
              }
           	if(wzprice==0){
           		$(this).find(".train-list-ticket").eq(0).hide();
           		$(this).find(".train-list-price").eq(0).hide();
           		$(this).find(".train-list-book").eq(0).hide();
           	}
           })
           sx();
    	}else{
    		$(".searchlist-no").show();
    		$(".train-load").hide();
    		$(".train-list").hide();
    	}

    }
   });
	}
	toobj()  
	  //搜索键
	 $("#button").click(function(){
	 	toobj();
	 	var newtime=new Date($("#time").val());
	    var week =newtime.getDay();
	    weeks(week);
	    timesame($("#time").val());
	  	$("#text").html($("#forcontiy").val()+"-"+$("#tocontiy").val()+"("+$("#time").val()+nowweek+")");
	  	$("#tophref").html($("#forcontiy").val()+"-"+$("#tocontiy").val());
	  	var newdate=new Date($("#time").val());
	  	var olddate= new Date();
	  	var m = parseInt((newdate-olddate)/24/3600/1000);
	  	//console.log(m);
	  	if(m>=6){
	  		$(".air-week-btn-prev").removeClass("disbland");
	  	}else{
	  		$(".air-week-btn-prev").addClass("disbland");
	  	};
	 })
	 
	 if(obj.isG){
	  	var isG=obj.isG;
	  	$(".isG").attr("checked","checked")
	  }else{
	  	 var isG=false;//高铁未选中状态
	  }
	 //筛选显示车次类型
	 var isT=false;//特快未选中状态
	 var isD=false;//动车未选中状态
	 var isQ=false;//其它未选中状态
	 /*var isS=false;
	 var isZ=false;
	 var isW=false;*/
	 var Gstr="高铁";
	 var Tstr="特快";
	 var Dstr="动车";
	  var Qstr="其他";
	 /*$(".isS").click(function(){//高铁选中状态
	 	isS=!isS;
	 	sx()
	 });
	 $(".isZ").click(function(){//高铁选中状态
	 	isZ=!isZ;
	 	sx()
	 });
	 $(".isW").click(function(){//高铁选中状态
	 	isW=!isW;
	 	sx()
	 });*/
	 $("#isG").click(function(){//高铁选中状态
	 	isG=!isG;
	 	sx()
	 });
	 $("#isT").click(function(){//特快选中状态
	 	isT=!isT;
	 	sx()
	 });
	 $("#isD").click(function(){//动车选中状态
	 	isD=!isD;
	 	sx()
	 });
	 $("#isQ").click(function(){//其它选中状态
	 	isQ=!isQ;
	 	console.log(2)
	 	sx()
	 });
	
	
	function sx(){	
		$("#ulList li").show();
	if(isG&&isD&&isT&&isQ){//全显示
		$("#ulList li").show();
	}else if(isG&&isD&&isQ){//显示 高铁 动车 其它
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Tstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isG&&isQ&&isT){// 显示  高铁 其它 特快 
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Dstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isD&&isQ&&isT){// 显示  动车 其它 特快 
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Gstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isG&&isT){//显示  高铁 特快
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			
	 			if(str!=Gstr&&str!=Tstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isG&&isD){//显示 高铁  动车
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			
	 			if(str!=Gstr&&str!=Dstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isG&&isQ){//显示 高铁 其它 
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Dstr&&str==Tstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isD&&isT){// 显示 动车 特快
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str!=Dstr&&str!=Tstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isD&&isQ){//显示 动车 其它 
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Gstr||str==Tstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isT&&isQ){// 显示  特快 其它 
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Gstr||str==Dstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isG){//显示 高铁
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str!=Gstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isT){//显示  特快
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str!=Tstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isD){// 显示 动车
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str!=Dstr){
	 				$(this).hide();
	 			}
	 		})
	}else if(isQ){// 显示  其它
		$("#ulList li").each(function(index){
	 			var str=$(this).find(".traintype").html();
	 			if(str==Dstr||str==Tstr||str==Gstr){
	 				$(this).hide();
	 				console.log(1)
	 			}
	 		})
	} 
	
	else{
		$("#ulList li").show();
	}
	}
	/*function sxtime(dom){
		
		var m =dom.find(".train-departure-time").html();
		    m.slie
		console.log(m)
	}*/
	 
	})
	