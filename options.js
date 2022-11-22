/*
* @Author: Chen Renjie
* @Date:   2022-02-25 12:21:04
* @Last Modified by:   Chen Renjie
* @Last Modified time: 2022-02-25 12:38:31
*/
function ajax(opt) {
    let method = (opt.method.toUpperCase() || "POST").toUpperCase();
    let url = opt.url || "";
    let async = opt.async || true;
    let data = opt.data || {};
    let success = opt.success || function () {};
    let error = opt.error || function () {};


    let xhr = new XMLHttpRequest();

    let params = [];
    for(let key in data){
        params.push(key + "=" + data[key]);
    }

    if(method === "POST"){
        xhr.open(method, url, async);
        xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
        xhr.send(params.join("&"));
    }else if(method === "GET"){
        params.push("_="+new Date().getTime())
        xhr.open(method, url+"?"+params.join("&"), async);
        xhr.send();
    }

    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            success(xhr.responseText);
        } else {
            error && error(xhr.status);
        }
    }
}

btn_eastmoney.onclick = function(){
    eastmoney.setAttribute("state", "");
    eastmoney.innerText = "检查中...";
    ajax({
       method: "GET",
       url: "http://push2.eastmoney.com/api/qt/ulist/get",
       async: true,
       data:{
            "pn":"1",
            "fields":"f1",
            "secids":"1.000001",
       },
       success: function(res){
            eastmoney.setAttribute("state", "allowed");
            eastmoney.innerText = "有效✔";
        },
        error: function(){
            eastmoney.setAttribute("state", "blocked");
            eastmoney.innerText = "失效✖";
        }
    })
}

btn_tiantianfund.onclick = function(){
    tiantianfund.setAttribute("state", "");
    tiantianfund.innerText = "检查中...";
    ajax({
        method: "POST",
        url: "https://trade2.1234567.com.cn/do.aspx/CheckLogin",
        async: true,
        success: function(res){
            tiantianfund.setAttribute("state", "allowed");
            tiantianfund.innerText = "有效✔";
        },
        error: function(){
            tiantianfund.setAttribute("state", "blocked");
            tiantianfund.innerText = "失效✖";
        }
    })
}