// 1. 有效括号
// 题目描述：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
//
// 有效字符串需满足： 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。
//
// 示例 1:
// 输入: "()"
// 输出: true
//
// 示例 2:
// 输入: "()[]{}"
// 输出: true
//
// 示例 3:
// 输入: "(]"
// 输出: false
//
// 示例 4:
// 输入: "([)]"
// 输出: false
// 示例 5:
// 输入: "{[]}"
// 输出: true

/**
 * @param {string} str
 * @return {boolean}
 */
function validExpression(str) {
    if (!str) return true

    const stack = []
    const length = str.length

    const related = {
        "(": ")",
        "[": "]",
        "{": "}"
    }

    for (let m = 0; m < length; m++) {
        const cur = str[m]
        if (cur === '(' || cur === '[' || cur === '{') {
            stack.push(cur)
        } else if (related[stack.pop()] !== cur) {
             return false
        }
    }

    return !stack.length
}

// 2. 每日温度问题
// 题目描述: 根据每日气温列表，请重新生成一个列表，对应位置的输出是需要再等待多久温度才会升高超过该日的天数。如果之后都不会升高，请在该位置用 0 来代替。
//
// 例如，给定一个列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，你的输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]。
//
// 提示：气温 列表长度的范围是 [1, 30000]。每个气温的值的均为华氏度，都是在 [30, 100] 范围内的整数。

function computeTemperature(nums) {
    const length = nums.length
    const stack = []
    const result = new Array(length).fill(0)

    for (let m = 0; m < length; m++) {
        while(stack.length && nums[m] > nums[stack[stack.length - 1]]) {
            const top = stack.pop()
            result[top] = m - top
        }
        stack.push(m)
    }

    return result
}

// 暴力解法
function comT(T) {
    const length = T.length
    const result = new Array(length).fill(0)
    for (let m = 0; m < length; m++) {
        for (let n = m + 1; n < length; n++) {
            if (T[n] > T[m]) {
                result[m] = n - m
                break
            }
        }
    }
    return result
}


// 3. 栈的设计 —— 最小栈 问题
// 题目描述：设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
//
// push(x) —— 将元素 x 推入栈中。
// pop() —— 删除栈顶的元素。
// top() —— 获取栈顶元素。
// getMin() —— 检索栈中的最小元素。
//
// 示例:
// MinStack minStack = new MinStack();
// minStack.push(-2);
// minStack.push(0);
// minStack.push(-3);
// minStack.getMin(); --> 返回 -3.
// minStack.pop();
// minStack.top(); --> 返回 0.
// minStack.getMin(); --> 返回 -2.

class MinStack {
    constructor() {
        this.stack = []
        this.minStack = []
    }
    push(m) {
        this.stack.push(m)

        if (!this.minStack.length || this.minStack[this.minStack.length - 1] >= m) {
            this.minStack.push(m)
        }
    }
    pop() {
        if (this.stack.pop() === this.minStack[this.minStack.length - 1]) this.minStack.pop()
    }
    top() {
        if (!this.stack.length) return void 0
        return this.stack[this.stack.length - 1]
    }
    getMin() {
        if (!this.minStack.length) return void 0
        return this.minStack[this.minStack.length - 1]
    }
}

class MinStack_old {
    constructor() {
        this.stack = []
    }
    push(m) {
        this.stack.push(m)
    }
    pop() {
        this.stack.pop()
    }
    top() {
        if (!this.stack.length) return void 0
        return this.stack[this.stack.length]
    }
    getMin() {
        let min = Infinity
        const { stack } = this
        const length = stack.length
        for (let m = 0; m < length; m++) {
            if (stack[m] < min) {
                min = stack[m]
            }
        }
        return min
    }
}


// ------------------------- 队列 --------------------

