// pages/recite.js
//获取数据库引用.获取表引用
const words = wx.cloud.database({
  env: getApp().globalData.database
}).collection(getApp().globalData.collection);
//数据库 API 还提供了一系列的更新指令用于执行更复杂的更新操作，更新指令可以通过 db.command 取得
const _ = wx.cloud.database({
  env: getApp().globalData.database
}).command;
//保存滚动页面高度，提供给弹窗
var popwindow_top=0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    words: [],
    //翻译可视设置
    popwindow:{
      k:'',
      v:'',
      _id:'',
      top:'0px'
    },
    //界面设置
    set:{
      row_hide_v:true,//是否隐藏翻译view
      time_order:false,//是否按时间排序
    },
  },
  findAllBySet(){
    if(this.data.set.time_order){
      this.findAllCore(0,[],words.orderBy('date', 'desc'));
    }else{
      this.findAllCore(0,[],words.orderBy('count', 'desc'));
    }
  },
  //使用递归突破只能查询20条限制
  findAllCore(i,data,collection){
    console.log('开始',i);
    var that=this;
    collection.skip(i).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        if(res.data.length!=0){
          data =data.concat(res.data);
          console.log('成功',i);
          that.findAllCore(i+=20,data,collection);
        }else {
          that.setData({
            words: data
          });
          wx.hideLoading();
          console.log('结束,数据量:',data.length);
        }
      },
      fail() {
        wx.showToast({
          title: "查询失败",
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //通过id搜索页面组件获得popup组件
    this.popup = this.selectComponent("#popup");
  },
  //通过监听页面滚动位置来自定义弹窗高度
  onPageScroll:function(e){
    //console.log(e.scrollTop) //这个就是滚动到的位置,可以用这个位置来写判断
    popwindow_top=e.scrollTop;
  },
  //点击单词时
  wordClick(e){
    this.setData({
      popwindow:{
        k:e.currentTarget.dataset.item.k,
        v:e.currentTarget.dataset.item.v,
        _id:e.currentTarget.dataset.item._id,
        top:popwindow_top+'px'
      }
    });
    //显示弹窗
    this.popup.showPopup();
  },
  //单词是否显示翻译
  switch1Change(e){
    this.setData({
      'set.row_hide_v':!e.detail.value,
    });
  },
  switch2Change(){
    this.onShow();
  },
  //最近的单词排前面
  switch3Change(e){
    this.setData({
      'set.time_order':e.detail.value,
    });
    this.onShow();
  },
  popwindow_remove(){
    var that=this;
      //删除数据
    words.doc(this.data.popwindow._id).remove({
      success: function (res) {
        that.onShow();
        wx.showToast({
          title: "删除成功",
          icon: 'none',
          duration: 2000
        });
      },
      fail(res) {
        wx.showToast({
          title: "删除失败",
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  //加权按钮点击后传递到父组件来调用该方法
  popwindow_inc() {
    this.popup.hidePopup();
    //更新数据库，加权
    words.doc(this.data.popwindow._id).update({
      data: {
        // 表示指示数据库将字段自增 1
        count: _.inc(1)
      },
      success: function (res) {
        wx.showToast({
          title: "加权成功",
          icon: 'none',
          duration: 2000
        });
      },
      fail(res) {
        wx.showToast({
          title: "加权失败",
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  //减权按钮点击后传递到父组件来调用该方法
  popwindow_sub() {
    this.popup.hidePopup();
    //更新数据库，减权
    words.doc(this.data.popwindow._id).update({
      data: {
        // 表示指示数据库将字段自增 -1
        count: _.inc(-1)
      },
      success: function (res) {
        wx.showToast({
          title: "减权成功",
          icon: 'none',
          duration: 2000
        });

      },
      fail(res) {
        wx.showToast({
          title: "减权失败",
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    words.count({
      success: function(res) {
        wx.setTabBarItem({
          index: 1,
          text:'生词本 '+res.total,
        })
      },
      fail: console.error
    });
    this.findAllBySet();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})