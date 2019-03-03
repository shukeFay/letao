$(function () {
    /* 1. 完成分类左侧列表动态渲染
       1. 使用ajax请求数据
       2. 使用模板引擎渲染列表 */

    // 1. 使用ajax请求数据
    $.ajax({
        url: '/category/queryTopCategory',
        success: function (data) {
            // data是后台返回给我们的数据 返回就已经是对象 因为模板引擎要求 后台直接返回模板引擎需要的格式
            // data是这个对象 遍历的是data对象的rows数组
            // console.log(data);
            // 2. 使用模板函数调用 template函数 第一个参数模板id categoryLeftTpl 第二个是数据对象
            var html = template('categoryLeftTpl', data);
            // 把请求到的数据渲染到页面上
            $(".category-left ul").html(html);
        }
    });

    /* 2. 完成分类左侧点击切换分类右侧
        1. 让左边能过点击 
        2. 切换active
        3. 根据左边点击的菜单 请求对应的右边的品牌数据
        4. 把右边的品牌数据使用模板渲染到页面 */
    
         // 页面刚刚加载也需要执行 请求右边 默认请求id为1的 由于封装了函数 传人id为1即可
         querySecondCategory(1);
    // 1. 给左侧分类li添加tap事件 tap是一个解决了点击事件延迟的事件
    // 由于li是通过ajax动态添加的元素 页面一开始是没有一开始添加事件不成功
    // 1. 放到ajax完成渲染后再添加事件 也可以使用事件委托(给父元素加事件 通过父元素捕获里面真正触发的子元素)
    $('.category-left ul').on('tap', 'li', function () {
        // 2. 给当前点击li添加active其他的兄弟删除
        $(this).addClass('active').siblings().removeClass('active');

        // 3. 根据当前点击li请求右侧数据 根据li的id 通过li的自定义属性的data-id获取里面值
        // var id = this.dataset['id'];
         var id = $(this).data('id');
        // console.log(id);

        // 4. 根据点击的id请求分类右侧的数据 调用封装函数 传人当前点击li的id
        querySecondCategory(id);

    });
    
        // 封装一个请求右侧分类的函数 由于id不是固定 通过参数传递
        function querySecondCategory(id){
            // 发ajax请求右侧的数据
           $.ajax({
             url: '/category/querySecondCategory',
             data: {
                 id: id
             },
             success: function (data) {
                // console.log(data);
                  var html = template('ategoryRightTpl',data);
                  $('.category-right .mui-row').html(html);
 
             }
 
         });
     }


    // 区域滚动初始化
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005,
        bounce: true //是否启用回弹
    });

})