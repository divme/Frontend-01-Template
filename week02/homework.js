// 1. 写一个正则表达式 匹配所有 Number 直接量
//   1.1 整数直接量：
         const reg1 = /^-?[0-9]\d*$/
//   1.2 浮点数直接量：以 0x或 0X为前缀，其后跟随十六进制数串的直接量 =>
         const reg2 = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/
//   1.3 八进制直接量：八进制直接量以数字0开始， 其后跟随一个由0~7（包括0和7）之间的数字组成的序列 =>
         const reg3 = /0?[0-7]*/
//   1.4 十六进制直接量：
         const reg4 = /(0x)?[0-9a-fA-F]+/
//   1.5 匹配所有：
         const reg5 = /^-?[0-9]\d*$|(0x)?[0-9a-fA-F]+|0?[0-7]*|^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/


// 2. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
         const reg0 = /[\u4e00-\u9fa5]/;  // 中文字符
         const reg6 = /[^\x00-\xff]/;  // 双字节字符

// 3. 写一个 UTF-8 Encoding 的函数
//       这题啥意思？ 将 Unicode 转化为 UTF-8？
function UnicodeEncode(code){
  if (typeof code !== 'string') return void 0;
  const bytes = [];
  for (let i = 0; i < code.length; i++) {
    const c = code.codePointAt(i).toString(16)
    if (  c > 0Xffff ) i++;
    bytes.push(c)
  }
  return bytes
}
UnicodeEncode('😂a')
UnicodeEncode('𠮷a')

function encode2(code) {
  if (typeof code !== 'string') return void 0;
  let arr = [...code];
  return arr.map((item) => item.codePointAt(0).toString(16))
}
encode2('😂a')
encode2('𠮷a')
