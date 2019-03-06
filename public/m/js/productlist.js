// 定义了一个全局变量 当前搜索的商品名称
var proName = '';

$(function () {

    // 调用自己封装获取url参数的值的函数 获取search参数的值 
    queryProduct();
    // 调用当前商品搜索页面的搜索功能
    searchProduct();
    // 调用商品排序功能
    sortProduct();
    //调用下拉刷新功能函数
    pullRefresh();
    //调用上拉加载功能函数
    pullupRefresh();
    // 调用跳转到商品详情的函数
    gotoDetail();


    function queryProduct() {
        // 1. 查询商品列表的函数
        /* 思路
                1. 根据当前商品名称来搜索商品(商品名称就是用户在输入框输入内容也就是当前url参数 search的值)
                2. 调用查询商品的API
                3. 把后台返回商品列表的数据 调用模板引擎生成html结构
                4. 最后把生成html放到商品列表容器中 */
        // 1. 调用自己封装获取url参数的值的函数 获取search参数的值 获取当前要搜索的商品名称 
        proName = getQueryString('search');
        //  console.log(proName);
        // 2. 使用ajax请求商品的API 传入当前是search商品名称
        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: proName,
                page: 1,
                pageSize: 4
            },
            success: function (res) {
                // console.log(res);
                // 3. 调用模板生成商品列表结构
                var html = template('productListTpl', res);
                // 4. 把生成商品列表结构放到mui-row里面
                $('.product-list .mui-row').html(html);
            }
        })

    }
    // 2. 点击当前页面商品搜索按钮也要实现搜索功能
    function searchProduct() {

        // 1. 获取按钮添加点击事件 使用zepto都使用tap事件
        $('.btn-search').on('tap', function () {
            // 2. 获取当前输入内容 搜索的内容 把空格去掉 而且把首尾两端空格去掉
            var search = $('.input-search').val().trim();
            // console.log(search);
            // 3. 判断如果没有输入内容 提示输入
            if (search == '') {
                // 提示请输入要搜索 商品 使用MUI的消息框 自动消失消息框
                mui.toast('请输入内容', {
                    duration: 'long',
                    type: 'div'
                });
                //  后面代码也不执行
                return false;
            }
            // 4. 把当前记录加入到一个数组中 这个数组要看之前有没有数据有就使用之前数组去加 如果没有值就使用新的空数组加
            var searchHistory = localStorage.getItem('searchHistory');
            // 5. 判断之前数组有没有值
            if (searchHistory) {
                // 得把之前的值 转成一个数组 把字符串转成数组JSON.parse()
                searchHistory = JSON.parse(searchHistory);
            } else {
                // 否则没有值就是空 使用空数组
                searchHistory = [];
            }
            //   console.log(searchHistory);
            // 6. 在添加之前还要进行去除 把之前旧的重复的值删掉
            // 6.1 循环遍历整个数组
            for (var i = 0; i < searchHistory.length; i++) {
                // 6.2 判断当前数组的中每个值的key是否和当前输入search一致
                if (searchHistory[i].key == search) {
                    // 6.3 应该删掉当前这个数组的值 splice删除数组中某个值第一个参数是删除的元素索引 第二个删除个数
                    searchHistory.splice(i, 1);
                    // 6.4 如果有多个重复的数据 删掉一个值数组长度少了一个 i--
                    i--;
                }
            }
            // 7. 往数组里面添加值 push 往后 unshift往前加
            // searchHistory.unshift({
            //     key: search,
            //     time: new Date().getTime()
            // });
            // console.log(searchHistory);
            // 8. 把数组转成json字符串存储到本地存储中
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            // 10. 添加完成后清空输入框
            $('input-search').val('');
            // 11. 跳转到商品列表并且传递一些参数过来  跳转页面为了防止页面缓存多传一个参数 时间 随机数等 页面url变了重新请求不会使用缓存
            location = "productlist.html?search=" + search + "&time" + new Date().getTime();
        });
    }
    // 商品排序功能函数
    function sortProduct() {
        /* 思路
            1. 给所有排序按钮添加点击事件
            2. 切换active类名
            3. 获取当前排序的方式 (提前把所有按钮排序方式保存到按钮属性上 通过js去获取排序方式)
            4. 调用API传人当前商品排序的方式 和 排序顺序（1表示升序  2 表示降序）
            5. 获取后台排序后的商品数据 调用模板 
            6. 把模板渲染到页面 */
        // 1. 给所有排序按钮添加点击事件
        $('.product-list .mui-card-header a').on('tap', function () {
            // 2. 切换类名
            $(this).addClass('active').siblings().removeClass('active');
            // 3. 切换当前图标 根据当前按钮排序顺序来切换 获取当前排序顺序判断
            var sort = $(this).data('sort');
            // 4. 如果默认顺序是2降序 点击了之后改成1升序 如果默认是1升序 点击了变成2降序
            if (sort == 2) {
                sort = 1;
                // 4.1 把图标改成向上 把之前向下图标删掉换成向上
                $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                sort = 2;
                $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
            // 4.3 改完了sort页面属性也要更新
            $(this).data('sort', sort);
            // 5. 获取当前的排序的类型
            var type = $(this).data('type');
            console.log(type);
            var obj = {
                proName: proName,
                page: 1,
                pageSize: 4
            }
            // 使用中括号的方式添加一个动态的属性
            obj[type] = sort;

            // 6. 调用API传入当前的排序类型和排序的顺序
            $.ajax({
                url: '/product/queryProduct',
                data: obj,
                success: function (res) {
                    console.log(res);
                    // 7. 调用模板生成商品列表结构
                    var html = template('productListTpl', res);
                    // 8. 把生成商品列表结构放到mui-row里面
                    $('.product-list .mui-row').html(html);

                }
            });
        });
    }
    // 下拉刷新和上拉加载更多的功能 函数
    function pullRefresh() {

        /* 思路
             1. 进行初始化下拉刷新和上拉加载更多
             2. 指定下拉刷新的回调函数 
             3. 指定上拉加载的回调函数
             4. 在下拉刷新回调函数 请求最新数据 并且 渲染页面 并且结束转圈圈
             5. 在上拉加载更多数据回调函数 请求更多数据 并且 追加页面 并且结束转圈圈
             6. 上拉可能没有数据了 结束并且提示没有数据了 */
        // 初始化下拉刷新
        mui.init({
            pullRefresh: {
                // 指定当前下拉刷新的父容器 建议使用id选择器给区域滚动添加一个 pullrefresh id
                container: '#pullrefresh',
                // 初始化下拉刷新
                down: {
                    // 下拉刷新的回调函数 用真正的刷新数据 发送请求真实刷新数据和页面
                    callback: pulldownRefresh
                },
                // 初始化上拉加载更多
                up: {
                    // 上拉加载的回调函数 用来真正请求更多数据 追加到页面上
                    callback: pullupRefresh
                }
            }
        });

        // 2. 下拉刷新的具体业务函数
        function pulldownRefresh() {
            // 如果想要请求慢一点转久一点 加一个定时器延迟请求
            setTimeout(function () {
                // 4. 调用查询函数重新查询刷新页面
                queryProduct();
                // 5. 刷新完成要调用结束转圈圈的函数 函数代码一定不要写错 官网文档有错
                // mui('#pullrefresh').pullRefresh().endPulldown();
                // 使用官方demo文档里面新版代码结束转圈圈
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            }, 1000);
        }

        var page = 1;

        // 3. 上拉加载的具体业务函数
        function pullupRefresh() {

            $.ajax({
                url: '/product/queryProduct',
                data: {
                    proName: proName,
                    // 定义一个变量page存储了当前页码数 请求下一页让page进行++ 要自增
                    page: ++page,
                    pageSize: 4
                },
                success: function (res) {
                    // 8. 判断如果数据已经没有长度 表示没有数据 不需要调用模板和追加 直接提示没有数据了
                    if (res.data.length > 0) {
                        // 6.1 调用模板生成商品列表结构
                        var html = template('productListTpl', res);
                        // console.log(html);
                        // 6.2 请求了更多数据下一页 追加到页面 append函数
                        $('.product-list .mui-row').append(html);
                        // 7. 数据追加完毕要结束转圈圈 注意这个函数是up不是down
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    } else {
                        // 9. 没有数据 结束转圈圈 并且提示没有数据了
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                }
            });
        }
    }

    // 点击购买跳转到商品详情
    function gotoDetail() {
        /* 1. 给所有立即购买按钮添加点击事件
        2. 获取当前点击按钮上的商品id (获取data-id属性的值)
        3. 通过 location 跳转到商品详情 并且传入id参数 */
        //  1. 给所有立即购买按钮添加点击事件 由于列表动态也要使用委托
        $('.product-list').on('tap', '.product-buy', function () {
            console.log(111);

            // 2. 获取当前点击按钮上的商品id
            var id = $(this).data('id');
            // 3. 通过 location 跳转到商品详情 并且传入id参数
            location = "detail.html?id=" + id;

        });
    }


    // 使用正则封装的一个获取url参数值的函数
    function getQueryString(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = location.search.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].split('=')[1]);
        }
        return "";
    }
})