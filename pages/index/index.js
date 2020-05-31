//index.js
//获取数据库引用.获取表引用
const words = wx.cloud.database({
  env: 'recite-english-ccz4d'
}).collection('words');


Page({
  data:{
    words:[{'k':'kkkk','v':'vvvv'},]
  },
  word_input: function (e) {
    wx.request({
      method:"POST",
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      data: { "kw": e.detail.value},
      url: 'https://fanyi.baidu.com/sug',
      success: (result) => {
        console.log(result);
        if (result.statusCode == 200 && result.data != null) {
          this.setData({
            words:result.data.data
          });
          //console.log(this.data.words);
        } else {
          wx.showToast({
            title: "请求失败! HTTP码:" + result.statusCode,
            icon: 'none',
            duration: 2000
          });
        }
      },
    })
  },
  wordClick: function (e) {
    // 通过 currentTarget 获取传递进来的值，前端用data-参数名
    console.log(e.currentTarget.dataset.item);
    console.log(new Date());
    //添加单词到数据库
    words.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        k: e.currentTarget.dataset.item.k,
        v: e.currentTarget.dataset.item.v,
        count:0,
        date: new Date(),
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log('已添加到生词本', res)
        wx.showToast({
          title: "已添加到生词本",
          icon: 'success',
          duration: 2000
        });
      },
      fail(res) {
        console.log('添加失败', res);
        wx.showToast({
          title: "添加 " + e.currentTarget.dataset.item.k+" 失败",
          icon: 'none',
          duration: 2000
        });
      }
    });
  },


  btnClick: function () {
    words.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: "learn cloud database",
        due: new Date("2018-09-01"),
        tags: [
          "cloud",
          "database"
        ],
        done: false
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log('已添加到生词本', res)
      },
      fail(res){
        console.log('添加失败',res);
      }
    })
  },
})
