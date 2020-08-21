// ------------------ 合并 删除  --------------------------
// 1. linkedList 合并
// 真题描述：将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有结点组成的。
// 示例： 输入：1->2->4, 1->3->4 输出：1->1->2->3->4->4
function linkedMerge(head1, head2) {
    let head = new LinkeList
    let cur = head
    while (head1 && head2) {
        if (head1.val > head2.val) {
            cur.next = head2
            head2 = head2.next
        } else {
            cur.next = head1
            head1 = head1.next
        }
        cur = cur.next
    }

    cur.next = head1 === null ? head2: head1

    return head.next
}

// 2. linkedList 节点删除
// 真题描述：给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。

// 示例 1:
// 输入: 1->1->2
// 输出: 1->2
// 示例 2:
// 输入: 1->1->2->3->3
// 输出: 1->2->3
function linkedUniq(head) {
    if (!head || !head.next) return head
    let cur = head
    let next = cur.next
    while (cur && cur.next) {
        if (cur.val === cur.next.val) {
            cur.next = cur.next.next
        } else {
            cur = next
        }
    }
    return head
}


// 3. linkedList del2 
// 真题描述：给定一个排序链表，删除所有含有重复数字的结点，只保留原始链表中 没有重复出现的数字。

// 示例 1:
// 输入: 1->2->3->3->4->4->5
// 输出: 1->2->5
// 示例 2:
// 输入: 1->1->1->2->3
// 输出: 2->3
function linkedDelRepeat(head) {
    if (!head || !head.next) return head

    let start = new LinkeList
    
    let prev = start
    let cur = head

    prev.next = cur

    while(cur && cur.next) {
        if (cur.val === cur.next.val) {
            const val = cur.val
            cur = cur.next.next
            prev.next = cur
            while (cur && cur.val === val) {
                prev.next = cur.next
            }
        } else {
            prev = cur
            cur = cur.next
        }
    }

    return start.next
}

// -------------------- ---------------------------
// 4. 删除链表的倒数第 N 个结点
// 真题描述：给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

// 示例： 给定一个链表: 1->2->3->4->5, 和 n = 2.
// 当删除了倒数第二个结点后，链表变为 1->2->3->5.
// 说明： 给定的 n 保证是有效的。
function removeReverseNode1(head, n) {
    let slow = head
    let fast = head

    while (n !== 0) {
        fast = fast.next
        n--
    }

    while (fast.next) {
        slow = slow.next
        fast = fast.next
    }

    slow.next = slow.next.next

    return head
}
// 上面这个没法删除第一个节点，所以需要一个前缀节点 

function removeReverseNode(head, n) {
    const dummy = new LinkedList

    dummy.next = head

    let slow = dummy
    let fast = dummy

    while (n !== 0) {
        fast = fast.next
        n--
    }

    while (fast.next) {
        slow = slow.next
        fast = fast.next
    }

    slow.next = slow.next.next

    return dummy.next
}

// 5. 链表反转
// 真题描述：定义一个函数，输入一个链表的头结点，反转该链表并输出反转后链表的头结点。

// 示例:
// 输入: 1->2->3->4->5->NULL
// 输出: 5->4->3->2->1->NULL
function linkedReverse(head) {
    let prev = null
    let cur = head

    while (cur) {
        const next = cur.next
        cur.next = prev

        prev = cur
        cur = next
    }
    return prev
}

// 6. 链表局部反转
// 真题描述：反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。

// 说明: 1 ≤ m ≤ n ≤ 链表长度。

// 示例:
// 输入: 1->2->3->4->5->NULL, m = 2, n = 4
// 输出: 1->4->3->2->5->NULL
function linkedReverseBetween(head, m, n) {
   let start = new LinkedList
   start.next = head

   let p = start
   for (let i = 0; i < m - 1; i++) {
       p = p.next
   }

   let beforeReverse = p
   let startReverse = p.next

   let pre = p.next
   let cur = pre.next

   for (let i = m; i < n; i++) {
       let next = cur.next
       cur.next = pre

       pre = cur
       cur = next
   }

   beforeReverse.next = pre // pre为最后有效的节点
   startReverse.next = cur

   return start.next
}

// 7. 判断链表是否成环
function hasCycleWithFlag(head) {
    while (head) {
        if (head.flag) {
            return true
        } else {
            head.flag = true
            head = head.next
        }
    }
    return false
}
// 若链表有环，返回起点，否则返回null
function getCycleStartWithFlag(head) {
    let cur = head
    while (cur) {
        if (cur.flag) {
            return cur
        } else {
            cur.flag = true
            cur = cur.next
        }
    }
    return null
}

// 快慢指针
function isCycle(head) {
    if (!head || !head.next) {
        return false
    }

    let slow = head
    let fast = head.next.next
    
    while (fast !== slow) {
        if (!fast || !false.next) {
            return false
        }

        slow = slow.next
        fast = fast.next.next
    }

    return true
}

