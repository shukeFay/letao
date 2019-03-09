$(function () {

    //调用登录功能的函数
    login();

    goRegister();

    // 1. 登录功能的函数
    function login() {
        /* 1. 点击登录按钮实现登录
        2. 获取当前用户输入的用户名和密码
        3. 进行非空验证
        4. 调用后台提供的登录接口 并且传人当前的用户名和密码
        5. 获取后台返回登录信息是成功还是失败  失败就提示用户重新输入 
        6. 如果成功获取当前url 跳转回到这个地址 */
        // 1. 给登录按钮添加点击事件
        $('.btn-login').on('tap', function () {
            // 2. 获取当前用户输入用户名和密码 去掉首尾空格
            var userName = $('.username').val().trim();
            // 3. 判断当前用户名是否输入
            if (userName == "") {
                //弹出提示框
                mui.toast('请输入用户名', {
                    duration: 'long',
                    type: 'div'
                });
                //结束 后面代码不执行
                return false;
            }
            // 4. 获取当前用户输入的密码 去掉首尾空格
            var passWord = $('.password').val().trim();
            // 判断当前用户名是否输入
            if (passWord == "") {
                //弹出提示框
                mui.toast('请输入用户名', {
                    duration: 'long',
                    type: 'div'
                });
                //结束 后面代码不执行
                return false;
            }
            // 5. 调用API登录 传人用户名和密码
            $.ajax({
                url: '/user/login',
                type: 'post',
                data: {
                    username: userName,
                    password: passWord
                },
                success: function (data) {
                    // 6. 判断登录是否失败
                    if (data.error) {
                        //弹出提示框
                        mui.toast(data.message, {
                            duration: 'long',
                            type: 'div'
                        });
                    } else {
                        //登录成功 成功跳转到当前returnurl里面的地址
                         location = getQueryString('returnurl');
                    }
                }
            });
        });
    }

      // 去注册功能
       function goRegister() {
        // 2. 点击注册按钮跳转到注册页面
        $('.btn-register').on('tap', function() {
            // 使用location跳转注册页面
            location = 'register.html';
        });
    }
})