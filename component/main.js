import {create, Wrapper, Text} from "./src/createElement";

// let myComponent =  <div id="a" class="b" />

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