$(function () {

    /*调用查询商品详情函数*/
    queryProductDetail();
    /*调用加入购物车功能函数 */
    addCart();


    /*轮播图初始化*/
    function initSlide() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }

    /*查询商品详情*/
    function queryProductDetail(){
         /* 1. 根据当前商品id去请求数据 获取url中id参数的值
        2. 调用商品详情的API 传入当前的id参数
        3. 创建商品详情的模板
        4. 渲染到页面 */
        // 1. 获取url中id参数的值
        var id = getQueryString('id');
        
        // 2. 调用商品详情的API 传入当前的id参数
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function(data){
                
                // 2.1 在调用模板之前把尺码转成数组 尺码返回字符串40-50 但是模板需要数组[40,41..50]
                // 2.2 把字符串按照-分割成 40  和 50  40就是最小值 50就是最大值
                var arr = data.size.split('-');
                
                 // 2.3 定义一个真正的size尺码数组
                 var size = [];
                  // 2.4 定义一个循环 从40开始 到50结束
                for (var i = +arr[0]; i <= arr[1] - 0; i++) {
                    // 2.5 把每个尺码 添加到size数组中
                    size.push(i);
                }
                // 2.6 把模板中的字符串 替换成当前数组
                data.size = size;
                 // 3. 调用模板 去生成html
                var html = template('detailTpl',data);
                // 4. 把所有详情的模板放到detail里面
                $('#detail').html(html);

                // 5. 等到轮播图渲染完成后再初始化调用初始化轮播图
                initSlide();

                // 6. 得等渲染后再初始化区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，
                });

                // 7. 数字框也是动态完成要手动初始化 注意这个选择器就是数字框的大容器
                mui('.mui-numbox').numbox();
                // 8. 初始化尺码点击
                // 给所有尺码添加点击事件 切换类名
                $('.product-size button').on('tap',function(){
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                });
            }
        });  
    }
    /*加入购物车功能*/
    function addCart(){
        /* 1. 点击按钮要加入购物车
        2. 获取当前要加入购物车的商品信息  商品id 选择尺码 选择的数量
        3. 调用加入购物的API 把商品id 尺码 数量 作为参数传递
        4. 后台根据当前登录情况返回 加入购物车成功 或者失败
        5. 成功了 跳转到购物车让用户去查看
        6. 失败就表示当前 没有登录 跳转到登录页（并且要把当前页面的地址带过去 等登录成功后要继续添加） */
        // 1. 给加入购物车按钮添加点击事件
        $('.btn-add-cart').on('tap',function(){
            // 2. 获取当前商品id
            var productId = getQueryString('id');

             console.log(productId);
            
            // 3. 获取当前选择尺码
            var size = $('.mui-btn.mui-btn-warning').data('size');
            // console.log(size);
            
            // 4. 获取选择的商品的数量
            var num = mui('.mui-numbox').numbox().getValue();
            // console.log(num);
        
            // 5. 调用加入购物车的接口API 传入这些数据
            $.ajax({
                url: '/cart/addCart',
                type: 'post',// 默认值是get 如果是post需要手动设置
                // 强调后台API要求参数名是productId 不是id 参数名一定不能乱写 和文档保持一致
                data: {
                    productId: productId,
                    size: size,
                    num: num
                },
                success: function(data){
                    console.log(data);
                    // 6. 判断当前后台返回的数据 是否成功 成功就去购物车 失败表示未登录跳转到登录
                    if (data.error) {
                        location ='login.html?returnurl='+location.href;

                    }else {
                        // 7. 加入购物成功 
                        // 7.1 提示用户是否去购物车查看 使用MUI提示框
                        // confirm参数第一个是提示内容 可以传入文字 也可以是代码
                        // 第二个是提示标题 里面可以放文字和代码
                        // 第三个是提示按钮的文字 里面数组 ['左边的按钮文字','右边按钮的文字'] 如果有多个就依次排列
                        // 第四个是回调函数 点击是或者否都会触发回调函数 有个参数e e.index的值就是点击按钮的索引
                        mui.confirm('<h4>加入成功 是否去购物车查看</h4>','<h4>温馨提示</h4>',['是','否'],function(e){
                            // 7.2 判断如果用户点击否不跳转到购物车
                            if(e.index==1){
                                mui.toast('亲 请继续挑选喜欢的宝贝哦',{
                                    duration: 'long',
                                    type: 'div'
                                });
                            }else {
                                //跳转到购物车页面
                                location = "cart.html";
                            }
                        });
                    }
                }
            });
        });

    }


})