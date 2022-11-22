/*
* @Author: Chen Renjie
* @Date:   2022-02-24 00:47:04
* @Last Modified by:   Chen Renjie
* @Last Modified time: 2022-02-26 18:41:29
*/


/*
ajax({
   method: "GET",
   url: "https://push2.eastmoney.com/api/qt/clist/get",
   async: true,
   data:{
        "pi":"0",
        "fields":"f1,f2,f3,f4,f12,f13,f14",
        "fs":"i:1.000001,i:0.399001,i:0.399006,i:1.000300",
   },
   success: function(res){
        data = JSON.parse(res);
        return data;
        
    }
})
*/ 

function str2dom(str){
    let t = document.createElement("div");
　　 t.innerHTML = str;
　　 return t.childNodes;
}

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
        // xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
        xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
        xhr.send(JSON.stringify(data));
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


function getMarket(){
    ajax({
        method: "GET",
        url: "http://push2.eastmoney.com/api/qt/ulist/get",
        async: true,
        data: {
            "pn": "1",
            "fields": "f12,f13,f14,f1,f2,f4,f3,f152,f6,f104,f105,f106",
            "secids": "1.000001,0.399001,0.399006",
        },
        success: function(res) {
            let data = JSON.parse(res).data.diff;
            let content = "";
            for (let i = 0; i < Object.keys(data).length; i++) {
                let c = "green";
                let sign = "";
                if (data[i].f4 >= 0){
                    c = "red";
                    sign = "+";
                }
                content += `>>> <b>${data[i].f14}</b> <font color="red">${data[i].f2/100} <small>${sign}${data[i].f4/100} ${sign}${data[i].f3/100}%</small> </font> 成交：${parseInt(data[i].f6/1e8)}亿元(<font color="red">涨:${data[i].f104}</font>&nbsp<font color="grey">平:${data[i].f106}</font>&nbsp<font color="green">跌:${data[i].f105}</font>) &nbsp&nbsp`;
            }
            market.innerHTML = content;
       }
   })
}
getMarket();
setInterval(getMarket, 20000);

ajax({
   method: "POST",
   url: "https://trade2.1234567.com.cn/do.aspx/CheckLogin",
   async: true,
   success: function(res){
        data = JSON.parse(res).d;
        data = JSON.parse(data);
        document.getElementById("username").innerText = `${data.Name}`;
        document.getElementById("userlevel").innerText = `${data.Level}`;
    }
})

ajax({
   method: "POST",
   url: "https://trade2.1234567.com.cn/MyAssets/do.aspx/GetMyAssertInfoNew",
   async: true,
   success: function(res){
        data = JSON.parse(res)["d"];
        data = JSON.parse(data);
        console.log(data);
        document.getElementById("TotalAssetVol").innerText = `${data.TotalAssetVol}`;
        document.getElementById("position").innerText = parseInt(100*parseFloat(data.TotalAssetVolUn)/parseFloat(data.TotalAssetVol));
        document.getElementById("CashBagVol").innerText = `${data.CashBagVol}`;
        document.getElementById("TotalAssetVolUn").innerText = `${data.TotalAssetVolUn}`;
        document.getElementById("CashBagDailyIncome").innerText = `${data.CashBagDailyIncome}`;
        document.getElementById("TotalAssetFloatingIncomeUn").innerText = `${data.TotalAssetFloatingIncomeUn}`;
        
    }
})

ajax({
   method: "POST",
   url: "https://trade2.1234567.com.cn/MyAssets/do.aspx/GetHoldAssetsNew?"+new Date().getTime(),
   data: {
    "type":'0', "sorttype":'5', "isNeedTotal":"true"
   },
   async: true,
   success: function(res){
        content = JSON.parse(res)["d"];
        content = JSON.parse(content)["content"];
        content = str2dom(content);
        let data = "";
        for (let i=0; i<content.length/2; i++){
            d = {}
            d["name"] = content[2*i].innerText;
            nodes = content[2*i+1].childNodes;
            d["type"] = nodes[0].innerText;
            d["value"] = nodes[1].innerText;
            d["total"] = nodes[2].data;
            d["floating"] = nodes[3].innerText;
            d["floatingrate"] = nodes[5].innerText;
            // data.push(d);
            color = parseFloat(d["floating"]) > 0 ? "red-l": "green-l";
            data += `
                <tr>
                    <td class="tol first">
                        <p class="f14">${d["name"]}</p>
                        <p class="f12"><span class="info info-nopl">${d["type"]}</span><span class="info-noborder">${d["value"]}</span></p>
                    </td>
                    <td class="tor f14 desc">${d["total"]}</td>
                    <td class="tor"><span class="${color} f14">${d["floating"]}</span><br><span class="${color} f12">${d["floatingrate"]}</span></td>
                </tr>
            `;
        }
        document.getElementsByClassName("table-hold")[0].getElementsByTagName("tbody")[0].innerHTML = data;
        console.log(data);
    }
})
