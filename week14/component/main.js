// 凡是用到 JSX 语法的地方，都会调用 配置中的 pragma 函数（此处为 create）
// JSX 构建，先子后父
// 一个 el， 一般插入两部分内容：属性 ｜ children

function create(El, attrs, ...children) {
  debugger
  let o
  if (typeof El === 'string') {
     o = new Wrapper(El)
  } else {
    o = new Component({
      name: String(El)
    })
  }

  for (let name in attrs) {
      // o[name] = attrs[name]
    console.log()
    o.setAttribute(name, attrs[name])
  }

  for (let child of children) {
      if (typeof child === 'string') child = new Text(child)
      o.appendChild(child)
      // o.children.push(child)
    }

  return o
}

class Text {
  constructor(text) {
    this.root = document.createTextNode(text)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class Wrapper {
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

  mountTo(parent) {
    parent.appendChild(this.root)

    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}

class Component {
   constructor() {
     // this.root = document.createElement("div")
     this.slot = null
     this.attrs = []
     this.children = []
   }

   setAttribute(name, value) {
    // this.root.setAttribute(name, value)
     this.attrs.push({
       name, value
     })
   }

   appendChild(child) {
     console.log('append: ', child)
     // this.root.appendChild(child)
     // child.mountTo(this.root)
     this.children.push(child)
   }

   render() {
     return <div>
       <header>I am header</header>
       {this.slot}
       <footer>I am footer</footer>
     </div>
   }

   mountTo(parent) {
     // parent.appendChild(this.root)

     this.slot = <main></main>
     // 将属性设置到slot上啦
     for (let attr of this.attrs) {
       this.slot.setAttribute(attr.name, attr.value)
     }
     for (let child of this.children) {
       // child.mountTo(this.root)
       // child.mountTo(this.slot)
       this.slot.appendChild(child)
     }

     this.render().mountTo(parent)

   }
}

// let myComponent =  <div id="a" class="b" />

let myComponent = <Component id='a' class='b'>
    <p>I am text in p</p>
    <span>{new Wrapper('span')}</span>
    <div>I am a div</div>
    <div>11222</div>
</Component>

// let myComponent = <div>
//   {new Wrapper('span')}
// </div>

myComponent.mountTo(document.body)