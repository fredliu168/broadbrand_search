var browser = {
  versions: (function() {
    var u = navigator.userAgent;
    //console.log(u);
    var r = {
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf("MicroMessenger") > -1, //是否微信
      qq: u.match(/\sQQ/i) == " QQ" //是否QQ
    };
    //console.log(r.weixin);
    if (r.iPad || r.iPhone) {
      r.ios = true;
    }
    if (r.android || r.ios || r.iPad) {
      r.mobile = true;
    }
    return r;
  })()
};

export default browser;
