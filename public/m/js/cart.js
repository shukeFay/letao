$(function () {
    /*调用查询购物车功能函数*/
    queryCart();
    /*调用删除购物车商品功能函数*/
    deleteCart();
    /*调用购物车的编辑功能函数*/
    editCart();
    


    /*查询购物车功能函数*/
    function queryCart() {
        /* 1. 调用查询购物车的API接口
        2. 如果没登录后台返回 error表示未登录 跳转到登录
        3. 如果返回没有错误 已经登录
        4. 登录了就调用模板渲染购物车列表 */
        // 1. 调用查询购物车的API接口
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                //2. 如果没登录后台返回 error表示未登录
                if (data.error) {
                    // 3. 跳转到登录页面 同时把当前购物车页面url传递过去 等登录成功后返回到购物车页面
                    location = "login.html?returnurl=" + location.href;
                } else {
                    //已经登录,调用模版渲染购物车列表
                    var html = template('cartListTpl', {
                        'data': data
                    });
                    //5. 把列表放到ul里面
                    $('.cart-list').html(html);

                    /*区域滚动初始化*/
                    mui('.mui-scroll-wrapper').scroll({
                        indicators: false, //是否显示滚动条
                        deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
                        bounce: true //是否启用回弹
                    });
                    /*调用计算总金额功能函数*/
                    getCount();

                    // 8. 点击选中或者取消复选框都要重新计算总金额
                    // 9. 给所有复选框添加一个change事件
                    $('.mui-checkbox input').on('change',function(){
                        // 10. 每当复选框的值发生变化重新调用计算总金额
                        getCount();
                    })
                }
            }
        });
    }

     /*2. 删除购物车的商品功能*/
    function deleteCart(){
         /* 1. 点击侧滑删除按钮 
        2. 弹出一个确认框
        3. 确认框里面 如果点击取消就不删 就滑动回去
        4. 如果点击确定 获取当前要删除的商品id 调用删除API去删除 */
        // 1. 给删除按钮添加点击事件(动态元素使用委托)
        $('.cart-list').on('tap','.btn-delete',function(){

            // 5. 获取当前点击的删除按钮的父元素的父元素li标签
            // var li = this.parentNode.parentNode;// 而且一定是dom对象不能是zepto对象
            var li = $(this).parent().parent()[0];

            // 7.1 获取当前要删除商品id 在点击事件的回调函数获取id
            var id = $(this).data('id');
            console.log(id);
            

            // 2. 弹出一个确认框问用户是否删除
            mui.confirm('确认要删除我吗','撒娇提示',['确认','取消'],function(e){
                // console.log(e);
                // 3. 判断用户点击了确定还是取消 如果是取消要滑动回去
                if (e.index==1) {
                    // 4. 滑动回去
                    setTimeout(function(){
                        // console.log(li); 
                        //调用mui.滑动事件函数
                        mui.swipeoutClose(li);
                    },100);
                }else {
                    // 7. 点击了确定要删除当前的商品
                    // 7.2 调用删除的功能函数把当前id商品id删除
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function(data){
                            // console.log(data);
                            //判断是否成功
                            if (data.success) {
                                //成功 提示用户删除成功
                                mui.toast('删除成功',{
                                    duration: 1000,
                                    type: 'div'
                                });
                                // 9. 重新调用查询刷新页面
                                queryCart();
                            }else {
                                // 10. 删除失败 可能是没登录 跳转到登录页面
                                location = "login.html?returnurl=" + location.href;

                            }
                            
                        }
                    })
                }
                
            })
        })
    }

    /*3. 购物车的编辑功能*/
    function editCart(){
        /* 1. 点击编辑按钮
        2. 弹出一个确认框
        3. 准备一些编辑框需要的模板
        4. 把模板放到编辑框的内容里面
        5. 而且也要在弹出后进行初始化点击尺码和数量(因为弹出框也是动态添加的元素)
        6. 判断确认框点击了确定还是取消
        7. 如果是取消 滑动回去
        8. 如果点击了确定 获取最新的尺码 数量 等调用购物车编辑功能的API实现编辑 */
        // 1. 给编辑按钮添加点击事件 也要使用委托
        $('.cart-list').on('tap','.btn-edit',function(){
            // console.log(this);
            // 2. 点击弹框之前要准备好一些弹框的模板
            // 2.1 通过当前编辑按钮获取身上data-product属性获取整个商品对象
            var product = $(this).data('product');
            // console.log(product);
            // 侧滑回去的li标签
            var li =$(this).parent().parent()[0];
            // 2.2 商品数据里面尺码也是有问题也是字符串 转成一个数组
            var productSize = [];
            var min = product.productSize.split('-')[0]-0;
            var max = product.productSize.split('-')[1]-0;
            for (i=min; i<=max; i++){
                productSize.push(i);
            }
            product.productSize = productSize;
            // 2.3 调用当前编辑商品的模板生成html 传入当前的商品对象
            var html = template('editCartTpl',product);

            // 2.4 把模板里面的回车换行 替换成空 因为MUI的确认框会把回车换行替换成br标签 使用 正则去掉
            html = html.replace(/[\r\n]/g, '');
            // console.log(html);

            // 3. 弹出一个确认框
            // 当模板准备好了放到确认框内容里面 但是默认会把所有回车换行都替换成br标签 在放入之前去的回车换行
            mui.confirm(html,'<h4>温馨提示</h4>',['确认','取消'],function(e){
                // 6. 点击确认框的确定或者取消 需要执行编辑功能 
                if (e.index==1) {
                    //点击了取消 就弹回去
                    mui.swipeoutClose(li);
                }else {
                    //点击了确定,获取最新选择的尺码和数量来调用编辑API去编辑
                    var size =$('.mui-btn.mui-btn-warning').data('size');
                    // console.log(size);
                    
                    // 获取当前选择的数量
                    var num = mui('.mui-numbox').numbox().getValue();
                    // console.log(num);
        
                    //调用编辑购物车的APi传入当前编辑一些信息
                    $.ajax({
                        url: '/cart/updateCart',
                        type: 'post',
                        data: {
                            id: product.id,
                            size: size,
                            num: num
                        },
                        success:function(data){
                           // 判断 如果编辑成功就调用查询刷新页面
                            if (data.success) {
                                queryCart();
                            }
                        }
                    })
                }

            });

             // 4. 数字框也是动态完成要手动初始化 
             mui('.mui-numbox').numbox();

             // 5. 初始化尺码点击
            // 给所有尺码添加点击事件 切换类名
            $('.product-size button').on('tap',function(){
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            });
        });
    }

    // 4. 计算总金额
    function getCount(){
        /* 1. 获取页面中所有被选中的复选框
        2. 遍历每一个被选复选框
        3. 计算每个选中商品的总价 当前单价*数量
        4. 把每个商品的单价加起来就是总价 */
        var checkeds = $('.mui-checkbox input:checked');
        
        // 定义一个总价
        var sun = 0;

        // 2. 遍历所有被选中的复选框
        checkeds.each(function(){
            // 3. 获取当前每个选中复选框属性上价格和数量
            var price = $(this).data('price');
            var num = $(this).data('num');
            // console.log(price);
            // console.log(num);
            //获取总价格
            var singleCount = price * num;
            sun += singleCount;
        });
        // console.log(sun);
         // 数字有一个toFixed()函数 四舍五入函数 可以传人一个参数 保留几位小数
         sun = sun.toFixed(2)//保留小数点后2位;
         // 6. 把总价渲染到页面上
         $('.order-count span').html(sun);

    }
})