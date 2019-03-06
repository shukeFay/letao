$(function(){
    // 使用框架式编程 定义函数和调用函数
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();
    initScroll();


    /* 1. 添加记录函数 */
    function addHistory(){

         /* 添加记录的思路
            1. 点击搜索添加记录 添加事件
            2. 获取当前输入内容 搜索的内容
            3. 判断如果没有输入内容 提示输入
            4. 把记录添加到本地存储中
            5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
            6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
            7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
            8. 加完后把数组保存到本地存储中（转成json字符串） */
        // 1. 获取按钮添加点击事件 使用zepto都使用tap事件
        $('.btn-search').on('tap',function(){
            // 2. 获取当前输入内容 搜索的内容 把空格去掉 而且把首尾两端空格去掉
            var search = $('.input-search').val().trim();
            // console.log(search);
            // 3. 判断如果没有输入内容 提示输入
            if (search=='') {
                // 提示请输入要搜索 商品 使用MUI的消息框 自动消失消息框
                mui.toast('请输入有效的内容',{
                    duration: 'long',
                    type: 'div'
                });
                // 后面的代码也不执行
                return false;
            }
             // 4. 把当前记录加入到一个数组中 这个数组要看之前有没有数据有就使用之前数组去加 如果没有值就使用新的空数组加
             var searchHistory = localStorage.getItem('searchHistory');
             // 5. 判断之前数组有没有值
             if (searchHistory) {
                searchHistory = JSON.parse(searchHistory);
             } else {
                 // 否则没有值就是空 使用空数组
                 searchHistory = [];
             }
             console.log(searchHistory);
             // 6. 在添加之前还要进行去除 把之前旧的重复的值删掉
            // 6.1 循环遍历整个数组
            for (var i=0; i<searchHistory.length; i++){
                // 6.2 判断当前数组的中每个值的key是否和当前输入search一致
                if (searchHistory[i].key==search) {
                // 6.3 应该删掉当前这个数组的值 splice删除数组中某个值第一个参数是删除的元素索引 第二个删除个数
                searchHistory.splice(i,1);
                i--;
                }
            }
            // 7. 往数组里面添加值 push 往后 unshift往前加
            searchHistory.unshift({
                key: search,
                time: new Date().getTime()
            });
            console.log(searchHistory);
            // 8. 把数组转成json字符串存储到本地存储中
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

            // 9. 只要在添加完成后调用查询函数 查询刷新数据了
            queryHistory();
            // 10. 添加完成后清空输入框
             $('.input-search').val('');
             location = "productlist.html?search="+search+"&time="+ new Date().getTime();
        });
    }
    /* 2. 查询记录函数 */
    function queryHistory(){
         /* 查询思路
            1. 获取存储里面存的数据(把字符串转成数组)
            2. 创建模板 
            3. 调用模板把数据作为template的参数（对象 但是这里是数组 一定要包在一个对象的属性上）
            4. 把模板渲染到ul里面 */
        // 1. 把当前记录加入到一个数组中 这个数组要看之前有没有数据有就使用之前数组去加 如果没有值就使用新的空数组中
         var searchHistory = localStorage.getItem('searchHistory');
         // 5. 判断之前数组有没有值
         if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
         } else {
             // 否则没有值就是空 使用空数组
             searchHistory = [];
         }
        //  console.log(searchHistory);
         // 3. 调用模板传人id 和数据 数据要求是对象把 searchHistory 放到对象的属性上
         var html = template('searchHistoryTpl',{list:searchHistory});
         // 4.  把生成html放到ul里面
         $('.search-history ul').html(html);

    }


    /* 3. 删除记录函数 */
    function deleteHistory(){
         /* 删除思路
            1. 给所有删除按钮添加点击事件（页面历史记录列表是动态渲染查询了之后才有列表）要使用委托添加事件 
            2. 点击删除按钮的要获取当前要删除的元素的索引
            3. 再获取搜索记录的数组 把这个索引对应的值删掉
            4. 重新把删除完成后的数组 保存到本地存储中
            5. 调用查询刷新列表*/
        // 1. 通过给父元素ul加事件 委托到里面的删除按钮
        $('.search-history ul').on('tap','.btn-delete',function(){
            // console.log($(this).data('index'));
            
            // 2.获取删除元素的索引
             var index = $(this).data('index');

            // 3. 获取当前本地存储的数组 默认获取的是字符串 转成真正的数组
            var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
            // 4. 在当前数组中删除掉这个索引的元素
            searchHistory.splice(index,1);
            // 5. 删除完成后重新保存到本地存储 保存的只能是字符串 转成字符串再保存
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
            // 6. 调用查询刷新页面
            queryHistory();
        });
    }

     /* 4. 清空记录函数 */
     function clearHistory(){
          /* 思路
            1. 点击清空按钮清空
            2. 把整个本地存储键删掉 或者 调用clear清空所有(但这样会把其他键也会删除)
            3. 删除完成后重新查询即可 */
        // 1. 点击清空按钮
        $('.btn-clear').on('tap',function(){
            // console.log(this);
            // 2. 删掉本地存储的searchHistory键和值
            localStorage.removeItem('searchHistory');
            // 3. 调用查询刷新页面
            queryHistory();    
        });
     }

     function initScroll(){
     /*滚动插件初始化 */
     mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        deceleration: 0.0005,
        bounce: true //是否启用回弹
    });
  }
})