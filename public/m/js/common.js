


// 公共的逻辑代码
goBack();
// 返回上一页的功能函数
function goBack() {
    // 1. 获取所有返回上一页的箭头的函数 添加tap事件
    $('#header .left .fa-arrow-left').on('tap', function () {
        // 2. 返回上一页 使用历史记录的API history.back() 可以返回上一页
        history.back();
    });
}

// 后续需要根据当前 参数值 比如鞋 去搜索商品
// 公共的 使用正则封装的一个获取url参数值的函数
function getQueryString(name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = location.search.match(reg);
    console.log(arr);
    if (arr != null) {
        return decodeURI(arr[0].substr(arr[0].indexOf('=') + 1));
    }
    return "";
}