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
// 4. 用栈实现一个队列
// 题目描述：使用栈实现队列的下列操作：
// push(x) -- 将一个元素放入队列的尾部。
// shift() -- 从队列首部移除元素。
// peek() -- 返回队列首部的元素。
// empty() -- 返回队列是否为空。

// 示例: MyQueue queue = new MyQueue();
// queue.push(1);
// queue.push(2);
// queue.peek(); // 返回 1
// queue.shift(); // 返回 1
// queue.empty(); // 返回 false

// 说明:

// 你只能使用标准的栈操作 -- 也就是只有 push to top, peek/pop from top, size, 和 is empty 操作是合法的。
// 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。
// 假设所有操作都是有效的 （例如，一个空的队列不会调用 pop 或者 peek 操作）
class Queue {
    constructor() {
        this.stack1 = []
        this.stack2 = []
    }
    push(m) {
        this.stack1.push(m)
    }
    shift() {
        if (this.empty) return

        if (!this.stack2.length) {
            while(this.stack1.length) {
                this.stack2.push(this.stack1.pop())
            }
        }

        return this.stack2.pop()
    }
    peek() {
        if (this.empty) return

        if (!this.stack2.length) {
            while(this.stack1.length) {
                this.stack2.push(this.stack1.pop())
            }
        }

        return this.stack2[this.stack2.length - 1]
    }
    empty() {
        return this.stack1.length && this.stack2.length
    }
}


// 5. 双端队列 - 滑动窗口
// 题目描述：给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。

// 示例: 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7]

// 解释: 滑动窗口的位置
// ---------------
// [1 3 -1] -3 5 3 6 7
// 1 [3 -1 -3] 5 3 6 7
// 1 3 [-1 -3 5] 3 6 7
// 1 3 -1 [-3 5 3] 6 7
// 1 3 -1 -3 [5 3 6] 7
// 1 3 -1 -3 5 [3 6 7]

// 最大值分别对应：
// 3 3 5 5 6 7

// 提示：你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。

// 暴力解法
function slidingWindow1(nums, k) {
    let prevPoint = 0
    let behindPoint = k - 1

    let result = []

    for (let m = 0; m < nums.length - k + 1; m++) {
      let max = -INFINITY
      for (let n = prevPoint; n < behindPoint + 1; n++) {
          if (nums[n] > max) max = nums[n]
      }
      result.push(max)
      prevPoint++
      behindPoint++
    }

    return result
}

// 双端队列法
function slidingWindow(nums, k) {

    const length = nums.length
    const deque = []
    const result = []

    // 1. 把当前元素推到它应该在的地方，队头 - 队尾，递减
    // 2. 检查当前队头是否在滑动窗口内，不在，出队
    // 3. 当遍历到k个时，窗口开始滑动，同时更新结果
    for (let m = 0; m < length; m++) {
       while (deque.length && nums[deque[deque.length - 1]] < nums[m]) {
           deque.pop()
       }
       deque.push(m)

       while (deque.length && deque[0] <= i - k) {
           deque.shift()
       }

       if (i >= k - 1) {
           result.push(nums[deque[0]])
       }
    }

    return result
}