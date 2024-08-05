// 测试移动端环境
function isMobileNavigator() {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  // match的返回值：如果匹配不到，返回null; 否则返回匹配到的 array
  return flag;
}

var isMobile = isMobileNavigator()

console.log('isMobile', isMobile)
if (isMobile) {
  // 这里继续进行移动端的操作
}
