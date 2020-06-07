//index.js
//获取数据库引用.获取表引用
const words = wx.cloud.database({
  env: getApp().globalData.database
}).collection(getApp().globalData.collection);
//数据库 API 还提供了一系列的更新指令用于执行更复杂的更新操作，更新指令可以通过 db.command 取得
const _ = wx.cloud.database({
  env: getApp().globalData.database
}).command;
Page({
  data:{
    words: [],
    input_focus:true
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
        //console.log(result);
        if (result.statusCode == 200 && result.data != null) {
          this.setData({
            words:result.data.data
          });
          console.log(this.data.words);
        } else {
          wx.showToast({
            title: "请求失败! HTTP码:" + result.statusCode,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(e){
        wx.showToast({
          title: "请求失败！",
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  wordClick: function (e) {
    var that=this;
    // 通过 currentTarget 获取传递进来的值，前端用data-参数名
    //console.log(e);
    //先查询数据库看有没有这个单词
    words.where({
      k: e.currentTarget.dataset.item.k
    })
    .get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组
        if (res.data != null && res.data.length>0){
          //console.log(res.data[0]._id);
          //数据库中该单词已经存在，对该id的记录权重+2
          words.doc(res.data[0]._id).update({
            data: {
              // 表示指示数据库将字段自增 2
              count: _.inc(2)
            },
            success: function (res) {
              wx.showToast({
                title: "该单词已存在在生词本中！权重+2",
                icon: 'none',
                duration: 2000
              });
            },
            fail(res) {
              wx.showToast({
                title: "加权失败！",
                icon: 'none',
                duration: 2000
              });
            }
          });
        }else{
          //添加单词到数据库
          words.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              k: e.currentTarget.dataset.item.k,
              v: e.currentTarget.dataset.item.v,
              count: 0,
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
                title: "添加 " + e.currentTarget.dataset.item.k + " 失败",
                icon: 'none',
                duration: 2000
              });
            }
          });
        };
        that.setData({
          input_focus:true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      input_focus:true
    });
  },
})
