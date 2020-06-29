// component/popup.js
var textarea_value;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    k: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    v: {
      type: String,
      value: '内容'
    },
    // 弹窗取消按钮文字
    btn_sub: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    btn_inc: {
      type: String,
      value: '确定'
    },
    // 弹窗蒙版高度
    top: {
      type: String,
      value: '0px'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
    textarea_flag:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hidePopup: function () {
      console.log("popup_hidePopup");
      this.setData({
        flag: true,
        textarea_flag:true,
      })
    },
    hide: function () {
      console.log("抓住点击");
    },
    //展示弹框
    showPopup() {
      console.log("popup_showPopup");
      this.setData({
        flag: false
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _inc() {
      //触发取消回调
      this.triggerEvent("popup_inc")
    },
    _sub() {
      //触发成功回调
      this.triggerEvent("popup_sub");
    },
    _remove(){
      //触发成功回调
      this.triggerEvent("popup_remove");
    },
    _longpress() {
      this.setData({
        textarea_flag:false,
      });
    },
    _no(){
      this.setData({
        textarea_flag:true,
      });
    },
    _yes(){
      //触发成功回调
      this.triggerEvent("popup_textarea_yes",textarea_value);
    },
    _textarea_bindinput(e){
      textarea_value=e.detail.value;
    }
  }
})