/*
* @Author: Chen Renjie
* @Date:   2022-03-10 00:22:46
* @Last Modified by:   Chen Renjie
* @Last Modified time: 2022-03-14 17:28:04
*/

/*
localstorage

    name: CustomerName,
    levle: VipLevel,
    CustomerNo: CustomerNo,
    update: ts

 */
// var fund = {
//     storage: localstorage,
//     fetch: function(){},
//     init: function(){
//         this.storage.getItem("update");
//     },

// }

function str2dom(str){
    let t = document.createElement("div");
　　 t.innerHTML = str;
　　 return t.childNodes;
}

// $.ajax({
//     url: "https://trade2.1234567.com.cn/myassets/single",
//     type: "GET",
//     data: JSON.stringify({'fc':'007262'}),
//     success: function(res, status, xhr) {
//         res.match(/var xArray_line_30=(.*);/)[0];
//         xArray_line_30 = JSON.parse(RegExp.$1);
//         res.match(/var yArray_line_30=(.*);/)[0];
//         yArray_line_30 = JSON.parse(RegExp.$1);
//     }
// });



var host = [];
function initial(){
    $.ajax({
        url: "https://trade2.1234567.com.cn/do.aspx/CheckLogin",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({}),
        success: function(res, status, xhr) {
            console.log(res);
            let data = JSON.parse(res["d"]);
            $("#username").text(data.Name);
            // $("#userlevel").text(data.Level);
        }
    });
    $.ajax({
        url: "https://trade2.1234567.com.cn/MyAssets/do.aspx/GetMyAssertInfoNew",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({}),
        success: function(res, status, xhr) {
            console.log(res);
            let data = JSON.parse(res["d"]);
            let position = parseInt(100*parseFloat(data.TotalAssetVolUn)/parseFloat(data.TotalAssetVol));
            $("#TotalAssetVol").text(data.TotalAssetVol);
            $("#CashBagVol").text(`现金(${data.CashBagVol})`);
            $("#CashBagVol").css("width", `${100-position}%`);
            $("#TotalAssetVolUn").text(`持仓(${data.TotalAssetVolUn})`);
            $("#TotalAssetVolUn").css("width", `${position}%`);
        }
    });

    $.ajax({
        url: "https://trade2.1234567.com.cn/MyAssets/do.aspx/GetHoldAssetsNew?"+new Date().getTime(),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({"type":'0', "sorttype":'5', "isNeedTotal":"true"}),
        success: function(res, status, xhr) {
            let content = str2dom(JSON.parse(res["d"])["content"]);
            for (let i=0; i<content.length/2; i++){
                d = {}
                
                let str = content[2*i].innerText;
                d["name"] = str.substring(0, str.length-8);
                d["code"] = str.substr(-7, 6);
                let nodes = content[2*i+1].childNodes;
                d["type"] = nodes[0].innerText;
                d["value"] = nodes[1].innerText;
                d["total"] = nodes[2].data;
                d["floating"] = nodes[3].innerText;
                d["floatingrate"] = nodes[5].innerText;
                let color = "grey-l";
                if (parseFloat(d["floating"])>0){
                    color = "red-l";
                } else if (parseFloat(d["floating"])<0) {
                    color = "green-l";
                }
                $("tbody").append($(`<tr>
                            <td><span class="medium">${d["code"]} ${d["name"]}</span>
                                <br><span class="tiny">${d["type"]} | ${d["value"]}</span></td>
                            <td class="large text-end bold">${d["total"]}</td>
                            <td class="text-end bold"><span class="medium ${color}">${d["floating"]}</span> <br> <soan class="tiny ${color}">${d["floatingrate"]}</span></td>
                        </tr>`));
                host.push(d);
            }
        }
    });
}

$(document).ready(function(){
    var login = false;
    $("#checklogin").show();
    $("#UserInfo").hide();
    chrome.cookies.get({
        url : "https://*.1234567.com.cn",
        name : "fund_trade_trackid"
    }, function(cookies) {
        if (cookies && cookies.value) {
            console.log(cookies);
            $("#UserInfo").show();
            initial();
            login = true;
        } else{
            $("#unlogin").show();
        }
    })


    setTimeout(function() {
        $(".alert-dismissible").alert('close');
    }, 2000);
});