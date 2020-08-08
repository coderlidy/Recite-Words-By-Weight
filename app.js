//app.js
App({
  //数据库参数
  globalData: {
    database: 'recite-english-ccz4d',
    collection: 'words',
    collection2: 'englishs',
    //collection: 'words_test',
  },
  onLaunch:function(){
    //小程序端 API 调用的云环境初始化 必须有
    wx.cloud.init({
      env: 'recite-english-ccz4d',
    })
  }
  
})