// ---------------- 基本操作 ------------------
// 1. 字符串翻转
function reverseStr(str) {
    return str.split('').reverse().join('')
}
// 2. 回文字符串
function isPalindromeWay1(str) {
    return str.split('').reverse().join('') === str
}
function isPalindromeWay2(str) {
    for (let m = 0, len = str.length; m < len/2; m++) {
        if (str[m] !== str[len - 1 - m]) {
            return false
        }
    }
    return true
}

// -------------------------------- ---------------------------------------------
// 1. 回文字符串的衍生问题
// 真题描述：给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
// 示例 1: 输入: "aba"  输出: True
// 示例 2: 输入: "abca" 输出: True  解释: 你可以删除b/c字符。
// 注意: 字符串只包含从 a-z 的小写字母。字符串的最大长度是50000。
function isPalindromeAfterDel(str) {
    const length = str.length

    let left = 0
    let right = length - 1
    
    while (left < right && str[left] === str[right]) {
        left++
        right--
    }
    if (left >= right) return true

    if (isPalindrome(left+1, right)) {
        return true
    }
    if (isPalindrome(left, right-1)) {
        return true
    }
    function isPalindrome(l, r) {
        var s = str.slice(l, r+1)
        return s.split('').reverse().join('') === s
    }
    return false
}

// 2. 字符串匹配问题 - 正则表达式
// 真题描述： 设计一个支持以下两种操作的数据结构：
// void addWord(word)
// bool search(word) search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。. 可以表示任何一个字母。

// 示例: 
// addWord("bad")  addWord("dad")  addWord("mad")
// search("pad") -> false
// search("bad") -> true
// search(".ad") -> true
// search("b..") -> true
// 说明: 你可以假设所有单词都是由小写字母 a-z 组成的。

function Dictionary() {
    this.words = {}
}
Dictionary.prototype.addWord = function(word) {
    if (!this.words[word.length])
       this.words[word.length] = []  
    this.words[word.length].push(word)
}
Dictionary.prototype.search = function(word) {
    const length = word.length
    if (!this.words[length]) return false

    if (!word.includes('.')) {
        return this.words[length].includes(word)
    }
    const reg = new RegExp(word)
    return this.words[length].some(item => reg.test(item))
}

// 3. 字符串与数字转换 - 正则表达式
// 真题描述：请你来实现一个 atoi 函数，使其能将字符串转换成整数。
// 首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。
// 当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。
// 该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。
// 注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。
// 在任何情况下，若函数不能进行有效的转换时，请返回 0。

// 说明： 假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−2^31,  2^31 − 1]。如果数值超过这个范围，请返回  INT_MAX (2^31 − 1) 或 INT_MIN (−2^31) 。

// 示例 1:
// 输入: "42"
// 输出: 42

// 示例 2:
// 输入: " -42"
// 输出: -42
// 解释: 第一个非空白字符为 '-', 它是一个负号。我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。

// 示例 3: 输入: "4193 with words"
// 输出: 4193
// 解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。

// 示例 4: 输入: "words and 987"
// 输出: 0
// 解释: 第一个非空字符是 'w', 但它不是数字或正、负号。 因此无法执行有效的转换。

// 示例 5:
// 输入: "-91283472332"
// 输出: -2147483648
// 解释: 数字 "-91283472332" 超过 32 位有符号整数范围。因此返回 INT_MIN (−2^31)。

function atoi(str) {
    const reg = /^\s*([-\+]?\d+).*/
    const groups = str.match(reg)

    let result = 0
    if (groups) result = +groups[1]

    const max = Math.pow(2, 31) - 1
    const min = - max - 1
      
    if (result > max) return max
    if (result < min) return min
    return result
}