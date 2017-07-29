$(function(){
	//时间插件
	 $("#totime").dateSelect();
	 $("#backtime").dateSelect();
	
	//用户信息
	var User= JSON.parse(localStorage.getItem("objs"))
        	console.log(User);
        	$("#username").html(User.TrueName);
        	$("#eld").html(User.EID);
    var obj=JSON.parse(sessionStorage.getItem('Fligtobj'));
	  console.log(obj); 
	  var forcontiy=obj.contiyfor;
	  var tocontiy=obj.contiyto;
	  var totime=obj.todata;
	  var backtime=obj.backdata;
	  //因公因私
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
	  //单程 往返
	if(!obj.isbackgo){
	  $(".serarchlist-set").val("单程");
	  $(".backshow").hide()
	  }else{
	  	$(".serarchlist-set").val("往返");
	  	$(".backshow").show()
	  };
	  var isbackgo=obj.isbackgo;
	  $(".serarchlist-set").change(function(){
	  	if($(this).val()=="单程"){
	  		isbackgo=false;
	  		$(".backshow").hide();
	  		$("#backtime").val('')
	  	}else{
	  		isbackgo=true;
	  		$(".backshow").show()
	  	}
	  });
	  
	  $("#tophref").html(forcontiy+"-"+tocontiy);
	  $("#forcontiy").val(forcontiy);
	  $("#tocontiy").val(tocontiy);
	  $("#totime").val(totime);
	   $("#backtime").val(backtime);
	   
	     
	   $("#huan").click(function(){
			var huan="";
			huan=$("#tocontiy").val();
			$("#tocontiy").val($("#forcontiy").val());
			$("#forcontiy").val(huan);
			
		});
	   //城市三字码
	   function szm(m){
	   	 var obj =hotecity;
	   	 var A_H=obj.A_H;
	   	 var H_M=obj.H_M;
	   	 var M_W=obj.M_W;
	   	 var W_Z=obj.W_Z;
	   	 for(item of A_H){
	   	 	if(item.Name==m){
	   	 		return item.Value
	   	 	}
	   	 }
	   	for(item of H_M){
	   	 	if(item.Name==m){
	   	 		return item.Value
	   	 	}
	   	 }
	   	 for(item of M_W){
	   	 	if(item.Name==m){
	   	 		return item.Value
	   	 	}
	   	 }
	   	 for(item of W_Z){
	   	 	if(item.Name==m){
	   	 		return item.Value
	   	 	}
	   	 }
	   }
	 //星期
	  var newtime=new Date(totime);
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
	  $("#text").html(forcontiy+"-"+tocontiy+"&nbsp;&nbsp;"+$(".serarchlist-set").val()+"("+$("#totime").val()+nowweek+")")
	  
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
	
	function timesame(times){
	  	 $("#timelist").find("li").each(function(index){
	  	 	var n="2017"+"-"+$(this).find("span").html();
	  	 	
	  	 	if(times==n){
	  	 		$("#timelist").find("li").eq(index).addClass("active").siblings().removeClass("active");
	  	 		bdtime(times)
	  	 	}
	  	 });
	  	
	  }
	  timesame($("#totime").val());
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
	  $("#totime").val("2017"+"-"+n);
	  var newtime=new Date($("#totime").val());
	    var week =newtime.getDay();
	    weeks(week);
	 $("#text").html(forcontiy+"-"+tocontiy+"&nbsp;&nbsp;"+$(".serarchlist-set").val()+"("+$("#totime").val()+nowweek+")")
	  toobj()
	})
        
       //请求函数 
    function toobj(){
    	var  forcity = szm($("#forcontiy").val());
	   	var  tocity= szm($("#tocontiy").val());
	   	$(".air-load").show();
		$(".search-list-content").hide();
		 $(".searchlist-no").hide();
		 $("#fligList").html("");
    	var postData ={
    //请求头参数
    "RequestMetaInfo":{
        "SiteId": 1,//站点编号
        "TimeSpan": 1,//时间戳
        "Sign": 1//签名
    },
    //请求业务参数
    Data:{
    "SiteID": User.SiteID,//站点ID   (必填)
    "EID": User.EID,// 企业ID   (必填 计算返佣时需要)
    "StartCode": forcity,//起飞城市三字码  (必填)
    "EndCode": tocity,//到底城市三字码  (必填)
    "TakeOffDate": $("#totime").val(),//起飞日期 (必填)
    "IsCHD": false,//是否是查询儿童票  (必填)
    "AirLineCode": ""//航空公司二字码  (选填)
}};
$.ajax({
    url:'http://apitest.sec91.com/FlightApi/FlightQuery',
    data:{data:JSON.stringify(postData)},
    dataType:'json',
    type:'post',
    success:function(data){
        console.log(data);
        if(data.ResponseMetaInfo.StatusCode=="0"){
        	$("#number").html(data.Data.Flights.length);
        	$(".searchlist-no").hide();
    		$(".search-list-content").show();
    		$(".air-load").hide();
    		var item = data.Data.Flights;
    		for(i in  item){
    		var IsByPass = item[i].IsByPass?"经停":"直飞"
    		$("#fligList").append(
    			'<div class="search-lists" data-flig="'+item[i].AirLineCode+'">'+
          '<ul >'+
           ' <li>'+
            '  <table width="1180" border="0" cellspacing="0" cellpadding="0" class="searchlist-tab">'+
             '   <tr>'+
              '    <td width="212" class="search-list-air"><img src="http://b2b.51jp.cn/App_Themes/Images/airPic/'+item[i].AirLineCode+'.gif"><span class="din1">'+item[i].CarrinerName+'</span><strong class="din2">'+item[i].FlightNo+'</strong></td>'+
               '   <td width="130"><strong class="din3">'+item[i].OffTime+'</strong></td>'+
                '  <td width="255"><strong ><span class="din4">'+item[i].StartPortName+'</span><span class="din5">'+item[i].StartT+'</span></strong></td>'+
                 ' <td width="166"><span class="din6">'+item[i].Cabins[0].CabinName+'</span>(<span class="din13">'+item[i].Cabins[0].Cabin+'</span>)</td>'+
                  '<td width="114" rowspan="2" class="jijian-ranyou">￥<span class="din7">'+item[i].Tax+'</span >/￥<span class="din8">'+item[i].Oil+'</span></td>'+
                 ' <td width="135" align="right" class="search-list-price" ><strong><em>￥</em><span class="din9" data-redl="'+item[i].Cabins[0].RealFare+'">'+item[i].Cabins[0].Fare+'</span></strong></td>'+
                 ' <td width="168" rowspan="2"><p>'+
                 '<input type="button" class="search-list-btn buttonf" name="button2" value="预订">'+
                 '   </p>'+
                 '   <p><a href="javascript:;"  class="search-list-more">更多舱位<i></i></a><!--展开的时候该i加个样式class="arrow-upward"--></p></td>'+
                '</tr>'+
               ' <tr>'+
                '  <td class="search-list-model">机型： <span><span class="din14">'+item[i].PlaneType+'</span>('+item[i].PlaneModel+') '+
                 '   <!--机型--> '+
                  '  <span class="searchlist-model" style="display:none;">'+
                  '  <table width="500" border="0" cellspacing="0" cellpadding="0" class="order-flight-tab center">'+
                   '   <tr>'+
                    '    <td class="gray">计划机型</td>'+
                     '   <td class="gray">机型名称</td>'+
                      '  <td class="gray">类型</td>'+
                       ' <td class="gray">最少座位数</td>'+
                       ' <td class="gray">最多座位数</td>'+
                     ' </tr>'+
                     ' <tr>'+
                      '  <td>'+item[i].PlaneType+'('+item[i].PlaneModel+')</td>'+
                       ' <td>空中客车 A320</td>'+
                       ' <td>窄体</td>'+
                       ' <td>180</td>'+
                       ' <td>180</td>'+
                     ' </tr>'+
                   ' </table>'+
                    '</span> '+
                    '<!--机型结束--> '+
                    
                   ' </span></td>'+
                 ' <td class="din10">'+item[i].ArriveTime+'</td>'+
                 ' <td><span class="din11">'+item[i].EndPortName+'</span><span class="din12">'+item[i].EndT+'</span></td>'+
                 ' <td> '+item[i].Cabins[0].Discount+'折 </td>'+
                 ' <td align="right" class="search-list-price searchlist-ticket" >剩余'+item[i].Cabins[0].TicketCount+'张</td>'+
               ' </tr>'+
              '</table>'+
            '</li>'+
            '<div class="search-flight-more-box" style=" display:none;">'+
             ' <ul>'+
             ' </ul>'+
           ' </div>'+
         '<li class="search-flight-time">飞行时间： '+item[i].RunTime+' |  '+IsByPass+'</li>'+
         ' </ul>'+
        '</div>'
    		)
    		for(tmp of item[i].Cabins){
    			$(".search-flight-more-box ul").eq(i).append(
    				'<li class="search-flight-more-list">'+
                  '<table width="1180" border="0" cellspacing="0" cellpadding="0" class="searchlist-tab">'+
                   ' <tr>'+
                    '  <td width="212" class="search-list-air">&nbsp;</td>'+
                     ' <td width="130">&nbsp;</td>'+
                     ' <td width="255">&nbsp;</td>'+
                     ' <td width="166"><span class="sdin1">'+tmp.CabinName+'</span>(<span class="sdin2">'+tmp.Cabin+'</span>) </td>'+
                     ' <td width="114" rowspan="2" class="jijian-ranyou">￥<span class="sdin3">'+item[i].Tax+'</span>/￥<span class="sdin4">'+item[i].Oil+'</span></td>'+
                     ' <td width="135" align="right" class="search-list-price" ><strong><em>￥</em><span class="sdin5" data-ture="'+tmp.RealFare+'">'+tmp.Fare+'</span></strong></td>'+
                     ' <td width="168" rowspan="2"><p>'+
                      '    <input type="button" class="search-list-btn buttons" name="button2"  value="预订">'+
                      '  </p></td>'+
                   ' </tr>'+
                   ' <tr>'+
                    '  <td class="search-list-model">&nbsp;</td>'+
                     ' <td>&nbsp;</td>'+
                     ' <td>&nbsp;</td>'+
                     ' <td> '+tmp.Discount+'折 </td>'+
                     ' <td align="right" class="search-list-price searchlist-ticket">剩余'+tmp.TicketCount+'张</td>'+
                   ' </tr>'+
                  '</table>'+
               ' </li>'
    			)
    		}
    		};
    		//显示隐藏舱位
    		var ISshow=false;
    		$(".search-lists .search-list-more").click(function(){
    			ISshow=!ISshow;
    			if(ISshow){
    				$(this).find("i").addClass("arrow-upward")
    				$(this).parents('.search-lists').find(".search-flight-more-box").show();
    			}else{
    				$(this).parents('.search-lists').find(".search-flight-more-box").hide();
    				$(this).find("i").removeClass("arrow-upward")
    			}
    		});
          //一级预订
    		$(".buttonf").click(function(){
    		var parents=$(this).parents('.search-lists');
    		if(isbackgo){
    			var FlightType=1;
    		}else{
    			var FlightType=0;
    		};
    		
    		if(isDS){
    		var	TrevalType=1;
    		}else{
    		var	TrevalType=0;	
    		};
    	
    	var fligobj ={
    		      "AirLineCode":parents.attr("data-flig"),
    		      "Fare":parents.find(".din9").html(),
                 "FlightType": TrevalType, //订单航程类型（0单程 1往返 2联程）。（必填）
                  "TrevalType": TrevalType, // 差旅类型( 1因公  2因私)。 （必填）
                  "AdultRealFare":parents.find(".din9").attr("data-redl"), //  成人真实票面 (如果是往返或联程为两段的组合总的票面价)（必填）
                  "AdultTax":parents.find(".din7").html(), // 成人机建(如果是往返或联程为两段的总的基建)（必填）
                  "AdultOil":parents.find(".din8").html(), //  成人燃油(如果是往返或联程为两段的总的燃油)（必填）
                  "SAirportCode":szm($("#forcontiy").val()),//出发机场三字码(必填)。 
                  "SAirportName":parents.find(".din4").html(),//出发机场名称(必填)。 
                  "SCityName":$("#forcontiy").val(),//出发城市名称(必填)。 
                  "EAirportCode":szm($("#forcontiy").val()),//到达机场三字码(必填)。
                  "EAirportName":parents.find(".din11").html(),//到达机场三字码(必填)。
                  "ECityName":$("#tocontiy").val(),//到达机场三字码(必填)。
                  "STerminal":parents.find(".din5").html(),  // 出发航站楼(必填)
                  "ETerminal":parents.find(".din12").html(),  // 到达航站楼(必填)
                  "BeginDate":$("#totime").val(), // 出发日期(必填)
                  "BeginTime":parents.find(".din3").html(), // 出发时间(必填)
                  "ArriveDate":$("#backtime").val()||$("#totime").val(), // 到达日期(必填)
                  "ArriveTime":parents.find(".din10").html(), // 到达时间(必填)
                  "Cabin":parents.find(".din13").html() , // 舱位(必填)
                  "CabinName":parents.find(".din6").html() , //舱位名称(必填)
                  "FlightNo":parents.find(".din2").html(), //航班号(必填)
                  "AirLineName":parents.find(".din1").html(),//(必填)
                  "PlaneType":parents.find(".din14").html(), //机型(必填)
        }
        sessionStorage.setItem("fligdata",JSON.stringify(fligobj));
        location="order.html";
    	console.log(fligobj)	
    		})
    	//二级预订	
    		$(".buttons").click(function(){
    			var parents=$(this).parents('.search-lists');
    			var parent=$(this).parents(".search-flight-more-list")
    			
    		if(isbackgo){
    			var FlightType=1;
    		}else{
    			var FlightType=0;
    		};
    		
    		if(isDS){
    		var	TrevalType=1;
    		}else{
    		var	TrevalType=0;	
    		};
    		
    		var fligobj ={
    			"AirLineCode":parents.attr("data-flig"),
    		      "Fare":parent.find(".sdin5").html(),
                 "FlightType": TrevalType, //订单航程类型（0单程 1往返 2联程）。（必填）
                  "TrevalType": TrevalType, // 差旅类型( 1因公  2因私)。 （必填）
                  "AdultRealFare":parent.find(".sdin5").attr("data-ture"), //  成人真实票面 (如果是往返或联程为两段的组合总的票面价)（必填）
                  "AdultTax":parent.find(".sdin3").html(), // 成人机建(如果是往返或联程为两段的总的基建)（必填）
                  "AdultOil":parent.find(".sdin4").html(), //  成人燃油(如果是往返或联程为两段的总的燃油)（必填）
                  "SAirportCode":szm($("#forcontiy").val()),//出发机场三字码(必填)。 
                  "SAirportName":parents.find(".din4").html(),//出发机场名称(必填)。 
                  "SCityName":$("#forcontiy").val(),//出发城市名称(必填)。 
                  "EAirportCode":szm($("#forcontiy").val()),//到达机场三字码(必填)。
                  "EAirportName":parents.find(".din11").html(),//到达机场三字码(必填)。
                  "ECityName":$("#tocontiy").val(),//到达机场三字码(必填)。
                  "STerminal":parents.find(".din5").html(),  // 出发航站楼(必填)
                  "ETerminal":parents.find(".din12").html(),  // 到达航站楼(必填)
                  "BeginDate":$("#totime").val(), // 出发日期(必填)
                  "BeginTime":parents.find(".din3").html(), // 出发时间(必填)
                  "ArriveDate":$("#backtime").val(), // 到达日期(必填)
                  "ArriveTime":parents.find(".din10").html(), // 到达时间(必填)
                  "Cabin":parent.find(".sdin2").html() , // 舱位(必填)
                  "CabinName":parent.find(".sdin3").html() , //舱位名称(必填)
                  "FlightNo":parents.find(".din2").html(), //航班号(必填)
                  "AirLineName":parents.find(".din1").html(),//(必填)
                  "PlaneType":parents.find(".din14").html(), //机型(必填)
        }
    		sessionStorage.setItem("fligdata",JSON.stringify(fligobj));
            location="order.html";
    		console.log(fligobj)
    		})
    		
        }else{
        	$(".searchlist-no").show();
        	$(".air-load").hide();
        	$(".search-list-content").hide();
        }
    }
});
    }
    
  toobj();  
    // 
    $("#button").click(function(){
    	 toobj();
    	var newtime=new Date($("#time").val());
	    var week =newtime.getDay();
	    var forcontiy=$("#forcontiy").val();
	    var tocontiy=$("#tocontiy").val();
	    weeks(week);
	    timesame($("#totime").val());
	  	$("#text").html(forcontiy+"-"+tocontiy+"&nbsp;&nbsp;"+$(".serarchlist-set").val()+"("+$("#totime").val()+nowweek+")")
	  	$("#tophref").html(forcontiy+"-"+tocontiy);
	  	var newdate=new Date($("#totime").val());
	  	var olddate= new Date();
	  	var m = parseInt((newdate-olddate)/24/3600/1000);
	  	//console.log(m);
	  	if(m>=6){
	  		$(".air-week-btn-prev").removeClass("disbland");
	  	}else{
	  		$(".air-week-btn-prev").addClass("disbland");
	  	}; 
    	 
    })
    
})
