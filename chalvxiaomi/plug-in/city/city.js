function getElementPos(elementId) {
    var ua = navigator.userAgent.toLowerCase();
    var isOpera = (ua.indexOf('opera') != -1);
    var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
    var el = document.getElementById(elementId);
    if (el.parentNode === null || el.style.display == 'none') {
        return false;
    }
    var parent = null;
    var pos = [];
    var box;
    if (el.getBoundingClientRect) //IE
    {
        box = el.getBoundingClientRect();
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        return { x: box.left + scrollLeft, y: box.top + scrollTop };
    } else if (document.getBoxObjectFor) // gecko
    {
        box = document.getBoxObjectFor(el);
        var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
        var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
        pos = [box.x - borderLeft, box.y - borderTop];
    } else // safari & opera
    {
        pos = [el.offsetLeft, el.offsetTop];
        parent = el.offsetParent;
        if (parent != el) {
            while (parent) {
                pos[0] += parent.offsetLeft;
                pos[1] += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }
        if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
            pos[0] -= document.body.offsetLeft;
            pos[1] -= document.body.offsetTop;
        }
    }
    if (el.parentNode) {
        parent = el.parentNode;
    } else {
        parent = null;
    }
    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
        pos[0] -= parent.scrollLeft;
        pos[1] -= parent.scrollTop;
        if (parent.parentNode) {
            parent = parent.parentNode;
        } else {
            parent = null;
        }
    }
    return { x: pos[0], y: pos[1] };
}

var divCityListId = ""; var divContainer; var txtCity; var ddlSelectControl; var MouseOverCityList = false; var SearchKey = ""; var allCityJson;
function CityShow(txtInput, ddlList) {
    var initVal = $(txtInput).val();
    if (initVal == "中文/拼音/三字码") {
        $(txtInput).val("")
    }
    $("#" + divCityListId).hide();
    txtCity = txtInput;
    ddlSelectControl = ddlList;
    divCityListId = "JinRi_Ranen_City_" + $(txtInput).attr("id");
        
    if ($("#" + divCityListId).length == 0) { InitTableContainer(); }
    divContainer = $("#" + divCityListId);
    var pos = getElementPos($(txtInput).attr("id"));

    $(divContainer).css({ "top": pos.y + 21, "left": pos.x - 1 })
    $("#JiKe_CityList_Selected").css({ "top": pos.y + 21, "left": pos.x - 1 });

    //if ($(txtInput).val() == "") {
    SelectCity(txtInput, ddlList);
    $(divContainer).hide();
    //}
    //    else {
    //        BindCityList($(txtInput).val());
    //        $(divContainer).show();
    //        $("#JiKe_CityList_Selected").hide();
    //    }

    //绑定离开焦点事件
    $(txtInput).focusout(function () {
        var select_index = parseInt($(divContainer).attr("SelectedIndex"));
        
        if (select_index == -1)
            select_index = select_index + 1;
        SelectedIndexChange(select_index);
        
    });
}
function InitTableContainer() {
    var divShow = document.createElement("div");
    $(divShow).attr("id", divCityListId).css({ "position": "absolute", "width": "260px", "border": "solid 1px #ACA899", "background-color": "#FFFFFF", "z-index": "2012", "font-size": "12px", "font-family": "Arial" });
    document.body.appendChild(divShow);
    divContainer = $("#" + divCityListId);

    $(txtCity).keydown(function (event) {

        var select_index = parseInt($(divContainer).attr("SelectedIndex"));
        if (event.which == 37) { }                                                                                                      //←
        else if (event.which == 38) { SelectedIndexChange(select_index - 1); if (select_index == 0) { $(this).val(SearchKey); } }       //↑
        else if (event.which == 39) { }                                                                                                 //→
        else if (event.which == 40) { SelectedIndexChange(select_index + 1); }                                                          //↓
        else if (event.which == 13) { SelectedValue(); $(divContainer).hide(); }                                                        //Enter
        else if (event.which == 9) { $(divContainer).hide(); $("#JiKe_CityList_Selected").hide(); }                               //Tab
    });

    $(txtCity).keyup(function (event) {
        if (SearchKey != $(this).val()) {
            if (event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40 && event.which != 13) {
                BindCityList($(txtCity).val());
            }
        }
    });
    $(txtCity).focusout(function () { { if (!MouseOverCityList) { $(divContainer).hide(); } } });
    $(divContainer).mouseover(function () { MouseOverCityList = true; });
    $(divContainer).mouseout(function () { MouseOverCityList = false; });
}
function BindCityList(key) {
    SearchKey = key;
    $(divContainer).html("");
    if (key != "" && allCityJson != undefined) {
        var table = $("<table cellpadding=\"0\" cellspacing=\"0\"></table>");
        try {
            var regex = new RegExp("^" + key.toUpperCase() + "");
            var hasCity = false; var city; var maxLength = 10; var count = 0;
            for (var index = 0; index < allCityJson.Items.length; index++) {
                city = allCityJson.Items[index];
                if (regex.test(city.CityCode.toUpperCase()) || regex.test(city.CityName) || regex.test(city.CityNameE.toUpperCase()) || regex.test(city.ShotPY.toUpperCase())) {
                    var tr = $("<tr></tr>").css({ "cursor": "pointer" });
                    $(tr).append($("<td></td>").text(city.CityName).css({ "width": "100px", "height": "22px", "padding-left": "5px" }));
                    $(tr).append($("<td></td>").text(city.CityNameE).css({ "width": "120px" }));
                    $(tr).append($("<td></td>").text(city.CityCode).css({ "width": "40px" }));

                    $(tr).click(function () { CityTrClick(this); });
                    $(tr).mouseover(function () { $(this).attr("temp_background_color", $(this).css("background-color")); $(this).css("background-color", "#EAEAEA"); });
                    $(tr).mouseout(function () { $(this).css("background-color", $(this).attr("temp_background_color")); });
                    $(table).append(tr);
                    hasCity = true; count++;
                    if (count >= 10) { break; }
                }
            }
        } catch (e) { }
        //if (key.length == 3) { for (var index = 0; index < ddlSelectControl.options.length; index++) { if (ddlSelectControl.options[index].value.toUpperCase() == key.toUpperCase()) { ddlSelectControl.options[index].selected = true; } } }
        if (hasCity) { SelectedIndexChange(-1); $(divContainer).append(table).show(); $("#JiKe_CityList_Selected").hide(); }
        else { $(divContainer).hide(); }
    }
    else { SelectCity(txtCity, ddlSelectControl); $(divContainer).hide(); }
}
function CityTrClick(obj) {
    $(txtCity).val($(obj).children("td:first").html());
    SetSelectedValue($(obj).children().eq(2).html());
    $(divContainer).hide();
}
function SelectedValue() {
    $("#" + divCityListId + " table tr").each(function (i) {
        if (i == parseInt($(divContainer).attr("SelectedIndex"))) { $(txtCity).val($(this).children("td:first").html()); }
    });
}
function SetSelectedValue(cityCode) { $(ddlSelectControl).val(cityCode); }
function SelectedIndexChange(index) {
    if (index >= -1 && index < $("#" + divCityListId + " table tr").length) {
        $("#" + divCityListId + " table tr").each(function (i) {
            if (index == i) {
                $(this).css({ "background-color": "#CCC" });
                $(txtCity).val($(this).children("td:first").html());
                SetSelectedValue($(this).children().eq(2).html());
            }
            else { $(this).css({ "background-color": "#FFFFFF" }); }
        });
        $(divContainer).attr("SelectedIndex", index);
    }
}

function GetCityGroupJson(key) {
    var returnValue = "";
    //    $.ajax({
    //        url: "Ajax/CityService.ashx",
    //        async: false,
    //        cache: false,
    //        type: "GET",
    //        data: { key: escape(key), MethodName: "GetCityGroupJson" },
    //        success: function(data) { returnValue = data; }
    //    });
    returnValue = citylist;
    return returnValue;
}
function GetElementPos(e) {
    var top = e.offsetTop; var left = e.offsetLeft; var width = e.offsetWidth; var height = e.offsetHeight;
    while (e = e.offsetParent) { top = top + e.offsetTop; left = left + e.offsetLeft; }
    return { top: top, left: left, width: width, height: height, bottom: top + height, right: left + width }
}

// 禁用回车提交页面表单
document.onkeydown = function (event) {
    var target, code, tag;
    if (!event) {
        event = window.event; //针对ie浏览器  
        target = event.srcElement; code = event.keyCode;
        if (code == 13) { tag = target.tagName; if (tag == "TEXTAREA") { return true; } else { return false; } }
    }
    else {
        target = event.target; //针对遵循w3c标准的浏览器，如Firefox  
        code = event.keyCode;
        if (code == 13) { tag = target.tagName; if (tag == "INPUT") { return false; } else { return true; } }
    }
};


/***************************弹出选择城市相关***************************/
var InputTextBox;
var Mouse_Over_Container = false;
function SelectCity(txtInput, ddlList) {
    this.ddlSelectControl = ddlList;
    InputTextBox = txtInput;
    $("#JiKe_CityList_Selected #citylist_title #title_remark").text("可直接输入城市名称、拼音、三字码搜索");
    $("#JiKe_CityList_Selected #citylist_content li").css("background-color", "#FFF");
    $("#JiKe_CityList_Selected #citylist_content li[CityName='" + $(txtInput).val() + "']").css("background-color", "#CCC");
    var pos = getElementPos($(txtInput).attr("id"));
    Mouse_Over_Container = true;
    $("#JiKe_CityList_Selected").css({ "top": pos.y + 30, "left": pos.x - 1 }).show();
    setTimeout(function () { Mouse_Over_Container = false; }, 200);
}

function GetCityListJson() {
    var CityList;
    //    $.ajax({
    //        url: "Ajax/CityService.ashx",
    //        async: false,
    //        cache: false,
    //        type: "GET",
    //        data: { MethodName: "GetCityListJson" },
    //        success: function(data) { CityList = data; }
    //    });
    CityList = hotecity;
    return CityList;
}

function InitSelectCityContainer() {
    var CityList = GetCityListJson();
    var AllCity = GetCityGroupJson();
    //异步读取需要转换
    //if (AllCity != "" && AllCity != " ") { try { allCityJson = eval("(" + AllCity + ")"); } catch (e) { } }
    allCityJson = AllCity;
    if (CityList != "") {
        var CityListContainer = $("<div></div>").attr("id", "JiKe_CityList_Selected").css({ "width": "380px", "position": "absolute", "display": "none", "border": "solid 1px #ccc", "background-color": "#FFFFFF", "z-index": "2012", "font-size": "12px", "font-family": "Arial" });
        var citylist_title = $("<div></div>").attr("id", "citylist_title").css({ "border-bottom": "#ccc 1px dashed", "line-height": "25px", "height": "25px" });
        var citylist_head = $("<div></div>").attr("id", "citylist_head").css({ "border-bottom": "#ccc 1px solid", "padding-top": "10px" });
        var citylist_content = $("<div></div>").attr("id", "citylist_content");
        citylist_content.css({ "padding-bottom": "5px" });
        var title_remark = $("<span></span>").attr("id", "title_remark").css({ "padding-left": "5px", "float": "left" }).text("可直接输入城市名称、拼音、三字码搜索");
        var title_close = $("<span></span>").attr("id", "title_close").css({ "padding-right": "10px", "float": "right", "cursor": "pointer", "font-size": "18px", "font-weight": "bolder", "color": "#979797" }).text("×");
        $(CityListContainer).append($(citylist_title).append(title_remark).append(title_close)).append(citylist_head).append(citylist_content);
        $(document.body).append(CityListContainer);
        $("#JiKe_CityList_Selected #citylist_title #title_close").click(function () { $(CityListContainer).hide(); });



        //CityList = eval("(" + CityList + ")");

        $("#JiKe_CityList_Selected #citylist_head").append($("<ul><ul>").attr("id", "ulCityLatter").css({ "width": "330px", "margin": "0px", "padding": "0px", "height": "26px", "padding-left": "12px" }).css({ "_height": "25px" }));
        CreateCityList(CityList.HotCity, "热 门", "ulHotCity");
        CreateCityList(CityList.A_H, "ABCDEFG", "ul_A_H");
        CreateCityList(CityList.H_M, "HIJKL", "ul_H_M");
        CreateCityList(CityList.M_W, "MNOPQRST", "ul_M_W");
        CreateCityList(CityList.W_Z, "UVWXYZ", "ul_W_Z");
        SelectTabControl("ulHotCity");

        $("#JiKe_CityList_Selected").mouseover(function () { Mouse_Over_Container = true; }).bind("mouseout", function () { Mouse_Over_Container = false; });
        $(document).click(function (e) { DocumentClick(e); });
    }
}

// 创建相应的Tab，并且初始化Tan下面的城市
function CreateCityList(citylist, text, id) {
    var ul = $("<ul></ul>").attr("id", id).css({ "width": "410px", "margin": "0px", "padding": "0px", "padding-bottom": "20px", "margin-top": "5px", "display": "none" });
    for (var index = 0; index < citylist.length; index++) {
        var li = $("<li></li>").attr({ "CityCode": citylist[index].Value, "IsHot": citylist[index].IsHot, "CityName": citylist[index].Name }).text(citylist[index].Name);
        li.css({ "float": "left", "list-style": "none", "border": "1px solid #ffffff", "width": "65px", "text-align": "center", "height": "23px", "line-height": "23px", "margin-left": "5px", "cursor": "pointer", "overflow": "hidden" });
        $(li).hover(function () { $(this).css({ "border": "1px solid #ddd", "background": "#f8f8f8" }) },
        function () {
            $(this).css({ "border": "1px solid #ffffff", "background": "#ffffff" })
        }
        );
        $(li).click(function () { $(InputTextBox).val($(this).text()); SetSelectedValue($(this).attr("CityCode"));
        $("#JiKe_CityList_Selected").hide(); Mouse_Over_Container = false; });
        $(ul).append(li);
    }
    $("#JiKe_CityList_Selected #citylist_content").append(ul);
    var head_li = $("<li></li>").attr("tag", id).css({ "float": "left", "list-style": "none", "text-align": "center", "height": "25px", "line-height": "25px", "margin-left": "5px", "padding-left": "5px", "padding-right": "5px", "cursor": "pointer", "border-style": "solid", "border-color": "#ccc", "border-width": "1px 1px 0px 1px" }).text(text);
    $(head_li).click(function () { SelectTabControl($(this).attr("tag")); });
    $("#JiKe_CityList_Selected #citylist_head #ulCityLatter").append(head_li);
}

// 选中相应的城市Tab
function SelectTabControl(tabControlId) {
    $("#JiKe_CityList_Selected #citylist_head li").css("background-color", "#fff");
    $("#JiKe_CityList_Selected #citylist_content ul").hide();
    $("#JiKe_CityList_Selected #citylist_head li[tag='" + tabControlId + "']").css("background-color", "#ccc");
    $("#JiKe_CityList_Selected #citylist_content ul[id='" + tabControlId + "']").show();
}
function DocumentClick(e) { if (!Mouse_Over_Container) { $("#JiKe_CityList_Selected").hide(); } }
//初始化选择城市的容器
$(function () { InitSelectCityContainer(); });