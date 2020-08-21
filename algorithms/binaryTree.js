// DFS： 前/中/后序遍历

// 前序遍历：根 左 右
function preorder(root) {
  if (!root) return

  const result = []

  const preorderTraversal = (node) => {
     if (node) {
         result.push(node.val)

         preorderTraversal(node.left)
         preorderTraversal(node.right)
     }
  }
  preorderTraversal(node)

  return result
}
function preorderStack(root) {
  if (!root) return
  
  const result = []
  const stack = []
  stack.push(root)

  let top
  while(stack.length) {
    top = stack.pop()

    if (top.right) {
      stack.push(top.right)
    }

    if (top.left) {
      stack.push(top.left)
    }

    result.push(top.val)
  }

  return result
}

// 中序遍历：左 根 右
function inorder(root) {
    if (!root) return

    let result = []

    const inorderTraversal = (node) => {
        if (node) {
            inorderTraversal(node.left)

            result.push(node.val)

            inorderTraversal(node.right)
        }
    }
    inorderTraversak(root)

    return result 
}
function inorderStack(root) {
    if (!root) return

    let result = []
    let stack = []
    let node = root

    while (stack.length || node) {
        if (node) {
            stack.push(node)
            node = node.left
            continue
        }
        node = stack.pop()
        result.push(node.val)
        node = node.right
    }

    return result
}

function zhong(root) {
    if (!root) return

    let result = []
    let stack = []
    let node = root

    while (stack.length || node) {
        if (node) {
            stack.push(node)
            node = node.left
            continue
        }

        node = stack.pop()
        result.push(node.val)
        node = node.right
    }

    return result
}

// 后序遍历：左 右 根
function postorder(root) {
    if (!root) return

    const result = []

    const postorderTraversal = (node) => {
        if (node) {
            postorderTraversal(node.left)
            postorderTraversal(node.right)
            result.push(node.val)
        }
    } 
    postorderTraversal(root)

    return result

    postorder(root.left)
    postorder(root.right)
    console.log(root.val)
}
function postorerStack(root) {
    if (!root) return 

    const result = []
    const stack = []
    stack.push(root)

    let node
    while (stack.length > 0) {
        node = stack.pop()
        result.unshift(node.val)

        if (node.left !== null) {
            stack.push(node.left)
        }

        if (node.right !== null) {
            stack.push(node.right)
        }
    }

    return result
}

// 循环
// 前序遍历 根左右
function qian(root) {
    if (!root) return
    
    const result = []
    const stack = []
    stack.push(root)

    let node
    while (stack.length) {
        node = stack.pop()
        result.push(node.val)

        node.right && stack.push(node.right)
        node.left && stack.push(node.left)
    }

    return result
}

// 后序遍历 左右根
function hou(root) {
    if (!root) return

    const result = []
    const stack = []
    stack.push(root)

    let node 
    while (stack.length) {
        node = stack.pop()
        result.unshift(node.val)

        node.left && stack.push(node.left)
        node.right && stack.push(node.right)  
    }

    return result
}