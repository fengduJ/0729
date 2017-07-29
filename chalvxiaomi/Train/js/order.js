$(function(){
	//获取乘车信息
	var  trains=JSON.parse(sessionStorage.getItem("train")); 
	console.log(trains)
	//用户信息
	var users=JSON.parse(localStorage.getItem("objs"))
	console.log(users);
	var n=	Number($(".bprice span").eq(0).html(trains.Price));
	$(".order-flight-info-list").append(
		'<h4><span>'+trains.Time+'</span>'+trains.StartCity+' - '+trains.EndCity+'</h4>'+
          '<ul>'+
            '<li class="order-flight-city-time">'+
              '<dl>'+
               '<dt>'+trains.STime+'</dt>'+
                '<dd>'+trains.StartCity+'</dd>'+
              '</dl>'+
              '<span><img src="../App_Themes/Images/member/right-arrow-short.png" /></span>'+
              '<dl class="last">'+
                '<dt>'+trains.Etime+'</dt>'+
                '<dd>'+trains.EndCity+'</dd>'+
              '</dl>'+
            '</li>'+
            '<li class="order-flight-ticket-trice">票价<strong>¥'+ trains.Price+'</strong></li>'+
          '</ul>'
	)
	//判断因公 因私
	if(trains.IsDS){
		$(".isds").show();
	}else{
		$(".isds").hide();
		console.log(1)
	}
	// 添加乘客
	var num=1;
	$("#addbtn").click(function(){
		num++;
		//console.log(num)
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
	  biaoxian(num)
	});
	
	
	
	
	function  biaoxian(num){           
          	$(".baoxian span").eq(0).html('');
             $(".bprice span").eq(0).html();
         
            var n=	Number($(".bprice span").eq(0).html());
	        var m= num;
	         console.log(mn)
       //循环乘客
         	     var totle=0;
		   $('.money_se').each(function(){
		   	   totle=totle+parseInt($(this).val())
		   	   console.log(totle)
		   })
		     $(".baoxian span").eq(0).html(totle);
         	   $(".serve").html(2*num)
	         var mn=Number(m*n)+(totle)+(2*num);
	         $("#titprice").html(mn);
          }
	biaoxian(num)
	
	$('.money_se').change(function(){
		biaoxian(num)
	});
	})
    //保险的金额    
       
	//总价格
	if(num){
		$("#titprice").html(
	  Number(Number(trains.Price)+(5*num)+(2*num))
	  )
	}

	 $('.money_se').on("change",function(){                    
          	console.log(parseInt($(this).val()));
             var re=parseInt($(this).val());
             $(".baoxian span").eq(0).html(re);
            $("#titprice").html(
			  Number(Number(trains.Price)+(re)+(2*num))
			  )
             
           })
	
	

	 
	//第一条显示说明
	$(".order-lists #train-insurance").hover(function(){
	$(".order-lists .order-insurance-content").show()
	},function(){
		$(".order-lists .order-insurance-content").hide()
	});
	$(".order-lists .fill-explain").hover(function(){
		$(".order-lists .fill-explain-content").show()
	},function(){
		$(".order-lists .fill-explain-content").hide();
	});
	
	//常旅客的搜索
	$(".orderchange").focus(function(){
		$(".order-passenger-box").show();
		orderlv()
	})
	/*$(".orderchange").blur(function(){
		$(".order-passenger-box").hide();
	})*/
	$(".orderchange").change(function(){
		//$(".order-passenger-box").show();
		orderlv()
	})
	function orderlv(){
		$(".order-passenger-box").html("")
		
		var postData ={
    //请求头参数
       "RequestMetaInfo":{
        "SiteId": 1,//站点编号
        "TimeSpan": 1,//时间戳
        "Sign": 1//签名
    },
    //请求业务参数
    Data:{
    "SiteId":users.SiteID,//站点编号
    "EID":users.EID,//企业编号
    "UserID":users.UserID,//用户ID
    "Name":$(".orderchange").val()//模糊匹配的名称
}};
$.ajax({
    url:'http://apitest.sec91.com/CommonApi/QueryFrequentPassenger',
    data:{data:JSON.stringify(postData)},
    dataType:'json',
    type:'post',
    success:function(data){
    	for(item of data.Data.DataPassenger)
        $(".order-passenger-box").append(
        	'<span>'+
          '<input type="checkbox" />'+
          ''+item.CName+'</span> <span>'
        )
        console.log(data);
    }
});
	}
orderlv()
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
        var objarrys=[
      /*  
        {
            "PsgName": "张三", // 乘客姓名
            "TicketType": "成人",// 票类型[成人票/儿童票] 
            "SeatType": trains.SeatType+"("+trains.Price+")元",// 座位信息
            "CardType": "", // 证件类型
            "CardNo": "5",  // 证件号
            "IncAmount":"",
            "Phone": "18245678124"// 乘客手机号码
         }*/
        
        
        ];
    // console.log(objarrys[0].PsgName)
   
         var PsgName=$(".PsgName").val();
         var CardNo=$(".IdNum").val();
         var phone=$(".phone").val();
         var CardType=$(".set-type").val();
        var obj1= {
          	  "PsgName": PsgName,
          	   "TicketType": "成人",
          	  "CardType":CardType,//证件类型
          	  "SeatType": trains.SeatType+"("+trains.Price+")元",// 座位信息
          	  "CardNo":CardNo, // 证件号
          	   "Phone":phone, // 乘客手机号码
          	   "IncAmount":parseInt($('.money_se').val())
          };
          var arrobj1=[];
        //判断输入框内容是否为空
      $(".judge").blur(function(){
        	if(PsgName==""|| CardNo==""|| phone==""){
        		alert("填写的信息不能为空")
        	}
       })
	//拼接模块
	function  addcart(){
		sessionStorage.removeItem("useobj")
		var objs=[]
		$(".order-passenger-list").each(function(i){
			this.index=i;
	   var PsgName=$(this).find(".PsgName").val();
	   console.log(PsgName);
	  var CardNo=$(this).find(".IdNum").val();
	  var CardType=$(this).find(".set-type").val();
	  var phone=$(this).find(".phone").val();
	  var IncAmount=parseInt($(this).find('.money_se').val())
       data={
                "PsgName": PsgName,
          	    "TicketType": "成人",
          	    "CardType":CardType,
          	    "SeatType": trains.SeatType+"("+trains.Price+")元",// 座位信息
          	    "CardNo":CardNo, // 证件号
          	    "Phone":phone,// 乘客手机号码
          	    "IncAmount":IncAmount
       }
	objs.push(data);
			sessionStorage.setItem("useobj",JSON.stringify(objs))
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
    		$(this).parent().parent().parent().remove();
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
		var OrderAmount=$("#titprice").html()-$(".baoxian span").eq(0).html();
		     addcart();
			var usesobj=JSON.parse(sessionStorage.getItem("useobj"));
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
    "UserID": users.UserID, //下单者用户ID 即企业员工（必填）
    "OrderFromTerminal": 1, // 订单来源终端(0 OA导单 1企业差旅前台  2安卓客户端   3苹果客户端  4 H5   5 微信小程序 9 其他 )（必填）
    "LstApproveUserIDs": arr, //审批人(列表顺序即为审批先后顺序)（必填）
    "PaymentType": 0, //支付方式  0现付 1预存款 
    "TravelReason": $('.business-reason-txt').val(), //出差事由
    "OrderTrevalType": 0, // 出差类别 0因公  1因私
    "OrderAmount": OrderAmount, //订单总金额
    "StartCity": trains.StartCity,//出发城市
    "EndCity": trains.EndCity, // 到达城市
    "StartDate": trains.Time, //出发日期
    "TrainNo": trains.TrainNo, //车次
    "StartTime": trains.STime, // 出发时间 
    "EndTime": trains.Etime, // 到达时间 
    "ContactName": $(".useript").val(), //联系人姓名
    "ContactPhone": $(".numpit").val(), //联系人手机号
    "ContactEmail": "123@qq.com", //联系人邮箱 
    "Remark": "", //备注
    "OrderPsg": usesobj   //订单乘机人信息
}};
$.ajax({
    url:'http://apitest.sec91.com/Train/CreateTicketOrder',
    data:{data:JSON.stringify(postData)},
    dataType:'json',
    type:'post',
    success:function(data){
        console.log(data);
        if(data.ResponseMetaInfo.StatusCode!=500){
        	var usedin={
        		"OrderNo":data.Data.OrderNo,
        		"StartCity":trains.StartCity,
        		"EndCity": trains.EndCity,
        		"OrderAmount":$("#titprice").html()
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
