// BFS 遍历二叉树
function treeWithBfs(root) {
    const queue = []
    queue.push(root)
    const result = []

    while(queue.length) {
        const top = queue.shift()
        result.push(top.val)

        if (top.left) {
            queue.push(top.left)
        }

        if (top.right) {
            queue.push(rop.right)
        }  
    }

    return result
}