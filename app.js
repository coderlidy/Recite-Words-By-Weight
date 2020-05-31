//app.js
App({
  onLaunch:function(){
    //小程序端 API 调用的云环境初始化
    wx.cloud.init({
      env: 'recite-english-ccz4d',
    })
  }
  
})