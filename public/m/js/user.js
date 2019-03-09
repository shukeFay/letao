$(function(){
    /*调用查询用户信息功能函数 */
    queryUserMessage();
    /*调用退出功能函数*/
    exit();

    // 1. 查询用户信息的功能函数
    function queryUserMessage(){
         /* 1. 请求查询用户信息的API
        2. 如果返回数据有错 error表示未登录 有错就应该跳转到登录 登录完成后也要回到个人中心
        3. 成功就渲染当前用户信息 */
        $.ajax({
            url: '/user/queryUserMessage',
            success:function(data){
                // console.log(data);
                // 2. 判断如果返回有错就跳转到登录
                if (data.error) {
                    location = "login.html?returnurl=" + location.href;
                }else {
                    // 4. 把个人信息渲染到页面
                    $('.userName').html(data.username);
                    $('.mobile').html(data.mobile);
                }
                
            }
        });
    }
    // 2. 退出登录功能
    function exit(){
         /* 1. 点击按钮要退出登录
        2. 调用退出登录API去退出
        3. 退出成功就跳转到登录页面
        4. 登录成功回到当前个人中心页面 */
        // 1. 给退出登录按钮添加点击事件
        $('.btn-exit').on('tap',function(){
            // 2. 调用退出登录的API
            $.ajax({
                url: '/user/logout',
                success:function(data){
                    console.log(data);
                    // 3. 退出成功跳转到登录
                    if (data.success) {
                        location = "login.html?returnurl=" + location.href;
                    }
                }
            });
        });
    }

})