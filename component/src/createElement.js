// 凡是用到 JSX 语法的地方，都会调用 配置中的 pragma 函数（此处为 create）
// JSX 构建，先子后父
// 一个 el， 一般插入两部分内容：属性 ｜ children


// el 参数，若为 html 标签，则为字符串，若为 自定义元素，则为 对象
export function create(El, attrs, ...children) {
  let o
  // if (!El) {
  //   o = new Component()
  // }
  if (typeof El === 'string') {
     o = new Wrapper(El)
  } else {
    debugger
    o = new Component({
      name: String(El)
    })
  }
  // console.log(o)

  for (let name in attrs) {
    o.setAttribute(name, attrs[name])
  }

  for (let child of children) {
    if (typeof child === 'string') child = new Text(child)
    o.appendChild(child)
  }

  return o
}

export class Text {
  constructor(text) {
    this.root = document.createTextNode(text)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

export class Wrapper {
  constructor(type) {
    this.root = document.createElement(type)
    this.children = []
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild(child) {
    console.log('append: ', child)
    // this.root.appendChild(child)
    // child.mountTo(this.root)
    this.children.push(child)
  }

  addEventListener() {
    this.root.addEventListener(...arguments)
  }

  mountTo(parent) {
    parent.appendChild(this.root)

    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}