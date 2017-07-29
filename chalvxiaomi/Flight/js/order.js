$(function(){
	//用户信息
	var users=JSON.parse(localStorage.getItem("objs"))
	console.log(users)
	//获取乘车信息
	var  fligs=JSON.parse(sessionStorage.getItem("fligdata")); 
	console.log(fligs);
	
	
	if(fligs.FlightType==0){
	  var cstar="单程";	
	}else if(fligs.FlightType==1){
		var cstar="往返";
	};
	
	$(".order-flight-info-list  h4").html('<span>'+fligs.BeginDate+'</span>'+fligs.SCityName+'- '+fligs.ECityName+'（'+cstar+'）');
	$(".fligs").html('<span><img src="http://b2b.51jp.cn/App_Themes/Images/airPic/'+fligs.AirLineCode+'.gif" />'+fligs.AirLineName+'</span>');
	$(".fligty").html('<span><strong>'+fligs.FlightNo+'</strong></span>');
	$(".order-type").html(fligs.CabinName);
	$(".order-flight-model").text(fligs.PlaneType);
	$(".order-flight-city-time").append(
		'<dl>'+
               ' <dt>'+fligs.BeginTime+'</dt>'+
                '<dd>'+fligs.SAirportName+fligs.STerminal+'</dd>'+
              '</dl>'+
              '<span><img src="../App_Themes/Images/member/right-arrow-short.png"  /></span>'+
              '<dl class="last">'+
                '<dt>'+fligs.ArriveTime+'</dt>'+
                '<dd>'+fligs.EAirportName+'</dd>'+
             ' </dl>'+
           ' </li>'+
           ' <li class="order-flight-ticket-trice">票价<strong>¥'+fligs.Fare+'</strong>（不含税费）</li>'+
         ' </ul>'
	);
	
	if(fligs.TrevalType){
		$(".isds").show();
	}else{
		$(".isds").hide();
	};
	
	// 添加乘客
	var num=1;
	$("#addbtn").click(function(){
		num++;
		console.log(num)
		if(num<=5){
		$("#add-orderlist").append($(".order-lists").html());
	    $(".order-passenger-number").eq(num-1).html(num);
	      var m=num;
		}else{
			alert("火车最多添加5名乘客");
			num=5;
			var m=num;
		}
		//删除乘客
	$("#add-orderlist").find(".order-passenger-operation").click(function(){
		m--;
		num=m;
	   $(this).parents(".order-passenger-list").remove();
	   $(".order-passenger-number").eq(m-1).html(num);
	   
	   //删除状态
	   function del(){
	   	        //机票价
				$(".flight_ticket").find("span").html(fligs.Fare);
			
				//民航基金
				var c=$(".hangban span").html();
				console.log(c)
				//成人票
				$(".people span").eq(0).html((fligs.Fare)*1+c*1);
				($(".people span").eq(1).html(m))
				var a=$(".people span").eq(0).html();
				var b=m;
				console.log(b)
				var ab=a*b;
				//保险费			
				$(".baoxian").find("span").html(40*m)
				//服务费
				$(".serve").find("span").html(28*m)
				
				//应付金钱
				$(".pay_total").html(ab+40*m+28*m)
				
	   }
	   del()
	   
	   
	
	});
	//添加状态
		function add(){
				//机票价
				$(".flight_ticket").find("span").html(fligs.Fare);
			
				//民航基金
				var c=$(".hangban span").html();
				console.log(c)
				//成人票
				$(".people span").eq(0).html((fligs.Fare)*1+c*1);
				($(".people span").eq(1).html(num))
				var a=$(".people span").eq(0).html();
				var b=num;
				console.log(b)
				var ab=a*b;
				//保险费				
				$(".baoxian").find("span").html(40*num)
				//服务费
				$(".serve").find("span").html(28*num)
				//应付金钱
				$(".pay_total").html(ab+40*num+28*num)
				
				
		}
	
	add()

	})
	
	//初始状态
	function star(){
			//机票价
			$(".flight_ticket").find("span").html(fligs.Fare);
		
			//民航基金
			var b=$(".hangban span").html();
			console.log(b)
			//成人票
			$(".people span").eq(0).html((fligs.Fare)*1+b*1);
			var a=$(".people span").eq(0).html();
			var b=$(".people span").eq(1).html();
			var ab=a*b;
			//保险费			
			$(".baoxian").find("span").html(40*1)
			//服务费
			$(".serve").find("span").html(28*1)
			
			//应付金钱
			$(".pay_total").html(ab+40+28)
			
	}
	star()
	
	
	
	
	
	
	
	
	
	
	//显示通讯录
	$("#tongxun").click(function(){
		$(".approver-layer").show();
		$(".approver-list-department").show();
		//$(".approver-list-pick").hide()
		
	});
	$("#stop").click(function(){
		$(".approver-layer").hide()
	})
	address()
	function address(){
		$(".approver-list-department ul").html('');
		$(".approver-list-pick").html('');
		
		var postData ={
    //请求头参数
    "RequestMetaInfo":{
        "SiteId": 1,//站点编号
        "TimeSpan": 1,//时间戳
        "Sign": 1//签名
    },
    //请求业务参数
    Data:{
    "SiteId": users.SiteID,//站点ID
    "EID": users.EID,//企业ID
     }};
   $.ajax({
    url:'http://apitest.sec91.com/CommonApi/QueryAddressBook',
    data:{data:JSON.stringify(postData)},
    dataType:'json',
    type:'post',
    success:function(data){
       $(".approver-company-name").html(data.Data.Enterprise.FullName);
       $(".approver-company-framework").find("a").eq(0).html(data.Data.Enterprise.FullName)
        console.log(data);
        
        for(item of data.Data.DataDepartment){
        	$(".approver-list-department ul").append(
        		'<li data-did="'+item.DID+'" data-temp="'+item.DName+'">'+
                ''+item.DName+'<em>'+item.UserNums+'人</em></li>'
             
        	)
        };
        for(item of data.Data.DataUserInfo){
        	$(".approver-list-pick").append(
        		'<dl  data-did="'+item.DID+'" data-usid="'+item.UserID+'" style="display:none">'+
              '<i><em></em></i>'+
              '<dd>'+
               '<p class="name">'+item.TrueName+'</p>'+
              '</dd>'+
            '</dl>'
             
        	)
        };
        $(".approver-list-department li").click(function(){
            $(".approver-company-framework span").html("")
        	var did = $(this).attr("data-did");
        	$(".approver-list-department li").hide();
        	$(".approver-list-pick dl").hide()
        	$(".approver-company-framework span").append(
        		'<em>></em><a href="javascript:;" data-did="'+did+'">'+$(this).attr("data-temp")+'</a>')
        	$(".approver-list-pick dl").each(function(index){
        		var usdid=$(this).attr("data-did")
        		if(usdid==did){
        			$(this).show()
        		}
        	})
        });
        $(".approver-company-framework .order-temp").click(function(){
        	$(".approver-list-department li").show();
        	$(".approver-list-pick dl").hide();
        	$(".approver-company-framework span").html("")
        })
        
        
        
        var arr=[];
        var brr=[];
        
        
      var PsgName=  $(".PsgName").val();
       var CardType= $(".CardType").val();
        var CardNo=  $(".CardNo").val();
       var BirthDay= $(".BirthDay").val();
         var Mobile=  $(".Mobile").val();
         var obj1= {
         	"PsgName":PsgName, //乘客姓名(必填)
          	  "CardType":0, // 证件类型（0身份证 1护照 2港澳通行证 3台胞证 4台湾通行证 5回乡证 10其他）(必填)
                  "CardNo":CardNo , // 证件号(必填)
                  "BirthDay":BirthDay,//出生日期(必填)
                  "Mobile" :Mobile, //手机号(必填)
                  "PsgType":0 , //  0成人 1儿童 2婴儿(必填)
                  "IsuProductCodes":"YAHBYW01,CDDZHLHHBYW04" //  购买的保险产品代号，多个以英文逗号 ','分隔。 (必填)   
         };
         /* $(".judge").blur(function(){
        	if(PsgName==""|| CardNo==""|| Mobile==""){
        		alert("填写的信息不能为空")
        	}
       })*/
        function  addcart(){
		sessionStorage.removeItem("flight_obj")
		var objs=[]
		$(".order-passenger-list").each(function(i){
			this.index=i;
	   var PsgName=$(this).find(".PsgName").val();
	    var CardType=$(this).find(".CardType").val();
	  var CardNo=$(this).find(".CardNo").val();
	  var BirthDay=$(this).find("BirthDay").val();
	  var Mobile=$(this).find(".Mobile").val();
	  var IncAmount=parseInt($(this).find('.money_se').val())
       data={
               "PsgName":PsgName, //乘客姓名(必填)
          	  "CardType":0, // 证件类型（0身份证 1护照 2港澳通行证 3台胞证 4台湾通行证 5回乡证 10其他）(必填)
                  "CardNo":CardNo , // 证件号(必填)
                  "BirthDay":BirthDay,//出生日期(必填)
                  "Mobile" :Mobile, //手机号(必填)
                  "PsgType":0 , //  0成人 1儿童 2婴儿(必填)
                  "IsuProductCodes":"YAHBYW01,CDDZHLHHBYW04" //  购买的保险产品代号，多个以英文逗号 ','分隔。 (必填)   
          	    
       }
	objs.push(data);
			sessionStorage.setItem("flight_obj",JSON.stringify(objs))
		})
	}	 
  
        $(".approver-list-pick dl").click(function add(){
        	var usid=$(this).attr("data-usid");
        	$(this).addClass("active")
        	arr.push(usid);
        	var htm=$(this).find(".name").html();
        	$(this).unbind("click");
        	$(".approver-box-left").append('<span data-usid="'+usid+'" class="useid"><a href="#"></a>'+htm+'</span>')
                showh();
                brr.push(htm);
             $(".approver-box-left").find('.useid').click(function(){
        	   $(this).remove();
        	   var usd=$(this).attr("data-usid");
        	   for(var i=0; i<arr.length; i++) {
				    if(arr[i] == usd) {
				      arr.splice(i, 1);
				      break;
				    }
				  };
				  for(var i=0; i<brr.length; i++) {
				    if(brr[i] == htm) {
				      brr.splice(i, 1);
				      break;
				    }
				  }
        	   $(".approver-list-pick dl").each(function(){
        	   	  var usid=$(this).attr("data-usid");
        	   	  if(usd==usid){
        	   	  	$(this).removeClass("active");
        	   	  	$(this).bind("click", add);
        	   	  }
        	   });
        })   
        
        });
        
        function showh(){
        	if($(".approver-box-left").html()){
        		$(".approver-btn").removeClass("gray")
        	}
        }
        showh();
        
        $(".approver-btn").click(function(){
        	$(".approver-layer").hide();
        	$(".addprove").html("");
    	for(item of brr){
    		console.log(item);
    		$(".addprove").append(
    			'<div calss="Syper"><span class="arrow-gray"><img src="../App_Themes/Images/member/arrow-gray.png" /></span>'+
                '<dl>'+
                '<dt><i class="sypoer"></i></dt>'+
                '<dd>'+item+'</dd>'+
                '</dl></div>'
    		);
    		
    	};
    	$(".sypoer").click(function(){
    		$(this) .parent().parent().parent().remove();
    	var m=	$(this).parent().parent().parent().find("dd").html();
    	
    			$(".approver-box-left").find("span").each(function(){
    				if(m==$(this).text()){
    					$(this).remove();
    					 var usd=$(this).attr("data-usid");
		        	   for(var i=0; i<arr.length; i++) {
						    if(arr[i] == usd) {
						      arr.splice(i, 1);
						      break;
						    }
						  };
				  for(var i=0; i<brr.length; i++) {
				    if(brr[i] == m) {
				      brr.splice(i, 1);
				      break;
				    }
				  }
				  $(".approver-list-pick dl").each(function(){
        	   	  var usid=$(this).attr("data-usid");
        	   	  if(usd==usid){
        	   	  	$(this).removeClass("active");
        	   	  	$(this).bind("click");
        	   	  }
        	   });
    				}
    			})
    		})
    	//console.log(.html())
    })
           //提交订单
	$("#filbtn").click(function(){
		console.log(arr);
		  addcart();
		  var usesobj=JSON.parse(sessionStorage.getItem("flight_obj"));
		 var OrderAmount=$(".pay_total").html()
		var postData ={
    //请求头参数
    "RequestMetaInfo":{
        "SiteId": 1,//站点编号
        "TimeSpan": 1,//时间戳
        "Sign": 1//签名
    },
    //请求业务参数
    Data:{
        "SiteID":users.SiteID,
         "UserID": users.UserID,//下单者用户ID 即企业员工（必填）
        "OrderFromTerminal": 1 , // 订单来源终端(0 OA导单 1企业差旅前台  2安卓客户端   3苹果客户端  4 H5   5 微信小程序 9 其他 )（必填）
        "LstApproveUserIDs": arr, //审批人(列表顺序即为审批先后顺序)（必填）
        "FlightType": fligs.FlightType, //订单航程类型（0单程 1往返 2联程）。（必填）
        "TrevalType": fligs.TrevalType, // 差旅类型( 1因公  2因私)。 （必填）
        "OrderAmount": OrderAmount, //订单总金额(所有金额之和)（必填）
        "IsPnrOrRTImport":  false , // 是否是PNR导入订单（必填）
        "ContactName": $(".useript").val() ,  //联系人姓名 （必填）
        "ContactMobile": $(".numpit").val(), //联系人手机号（必填）
        "ContactEmail": " ", //联系人 邮箱（选填）
        "FlightPrice": {
                 "AdultRealFare":fligs.AdultRealFare, //  成人真实票面 (如果是往返或联程为两段的组合总的票面价)（必填）
                 "AdultTax":fligs.AdultTax, // 成人机建(如果是往返或联程为两段的总的基建)（必填）
                 "AdultOil":fligs.AdultOil, //  成人燃油(如果是往返或联程为两段的总的燃油)（必填）
                 "ChildRealFare":0 , // 儿童真实票面 (如果是往返或联程为两段的组合总的票面价) 乘机人没有儿童时传0即可
                 "ChildTax":0, // 儿童机建(如果是往返或联程为两段的总的基建) 乘机人没有儿童时传0即可
                 "ChildOil":0, // 儿童燃油(如果是往返或联程为两段的总的基建) 乘机人没有儿童时传0即可
                 "BabyRealFare":0, // 婴儿真实票面 (如果是往返或联程为两段的组合总的票面价) 乘机人没有婴儿时传0即可
                 "BabyTax":0, // 婴儿机建(如果是往返或联程为两段的总的基建) 乘机人没有婴儿时传0即可
                 "BabyOil":0 // 婴儿燃油(如果是往返或联程为两段的总的燃油) 乘机人没有婴儿时传0即可
         }, //机票价格信息（必传）
        "OrderFlights": [{
                  "SAirportCode":fligs.SAirportCode,//出发机场三字码(必填)。 
                  "SAirportName":fligs.SAirportName,//出发机场名称(必填)。 
                  "SCityName":fligs.SCityName,//出发城市名称(必填)。 
                  "EAirportCode":fligs.EAirportCode,//到达机场三字码(必填)。
                  "EAirportName":fligs.EAirportName,//到达机场三字码(必填)。
                  "ECityName":fligs.ECityName,//到达机场三字码(必填)。
                  "STerminal":fligs.STerminal,  // 出发航站楼(必填)
                  "ETerminal":fligs.ETerminal,  // 到达航站楼(必填)
                  "BeginDate":fligs.BeginDate, // 出发日期(必填)
                  "BeginTime":fligs.BeginTime, // 出发时间(必填)
                  "ArriveDate":fligs.BeginDate, // 到达日期(必填)
                  "ArriveTime":fligs.ArriveTime, // 到达时间(必填)
                  "Cabin":fligs.Cabin , // 舱位(必填)
                  "CabinName":fligs.CabinName , //舱位名称(必填)
                  "FlightNo":fligs.FlightNo, //航班号(必填)
                  "AirLineName":fligs.AirLineName,//(必填)
                  "PlaneType":fligs.PlaneType, //机型(必填)
                  "Distance":'', //距离（公里数）（选填）
                  "C02":"", // 二氧化碳量。（选填）
        }], //创单所需航班信息
        "Passengers":usesobj
}};
$.ajax({
    url:'http://apitest.sec91.com/FlightApi/CreateOrder',
    data:{data:JSON.stringify(postData)},
    dataType:'json',
    type:'post',
    success:function(data){
        console.log(data);
        if(data.ResponseMetaInfo.StatusCode!=500){
        	var usedin={
        		"OrderNo":data.Data.OrderNo,
        		"StartCity":fligs.SCityName,
        		"EndCity": fligs.EAirportName,
        		"OrderAmount":OrderAmount
        	}
        	sessionStorage.setItem("driver",JSON.stringify(usedin))
        	location="success.html";
        }else{
        	alert(
        		data.ResponseMetaInfo.Reason
        	)
        }
    }
});
		
		
		
		
		
	})
        
        
	    } 
});
	}
	
})
