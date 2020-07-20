// JSX 构建，先子后父

function create(El, attrs, ...children) {
    let o
    if (typeof El === 'string') {
       o = new Wrapper(El)
    } else {
      o = new El({
        options: null
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

class Div {
   constructor() {
     this.root = document.createElement("div")
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

// let component =  <div id="a" class="b" />

let component = <Div id='a' class='b'>
    <p>I am text</p>
    <span></span>
    <Div></Div>
    <Div></Div>
</Div>

component.mountTo(document.body)