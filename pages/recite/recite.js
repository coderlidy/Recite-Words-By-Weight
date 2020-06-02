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
    words: [{ 'k': 'kkkk', 'v': 'vvvv'},],
    row_hide_v:false,
    popwindow:{
      k:'',
      v:'',
      _id:'',
      top:'0px'
    },
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
    console.log(this);
    this.findAll();
  },
  //按count降序desc排列
  findAll(){
    var that=this;
    words.orderBy('count', 'desc').get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        that.setData({
          words: res.data
        });
      }
    });
  },
  //通过监听页面滚动位置来自定义弹窗高度
  onPageScroll:function(e){
    //console.log(e.scrollTop) //这个就是滚动到的位置,可以用这个位置来写判断
    popwindow_top=e.scrollTop;
  },
  wordClick(e){
    this.setData({
      popwindow:{
        k:e.currentTarget.dataset.item.k,
        v:e.currentTarget.dataset.item.v,
        _id:e.currentTarget.dataset.item._id,
        top:popwindow_top+'px'
      }
    });
    this.popup.showPopup();
  },
  //是否显示翻译
  switch1Change(e){
    this.setData({
      row_hide_v:e.detail.value?true:false,
    });
    this.findAll();
  },
  //最近的排前面
  switch3Change(e){
    if(e.detail.value){
      var that=this;
      words.orderBy('date', 'desc').get({
        success: function (res) {
          // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
          that.setData({
            words: res.data
          });
        }
      });
    }else{
      this.findAll();
    }
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