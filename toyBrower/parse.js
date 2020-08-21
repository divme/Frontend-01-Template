const css = require('css')
const layout = require('./flex.js')

let currentToken = null
let currentAttribute = null
let currentTextNode = null

const EOF = Symbol('EOF')

let stack = [
  {
    type: 'document',
    children: []
  }
]

// -------------------------- css parser ---------------------

let rules = []
function addCssRules(text) {
  const ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function match(el, selector) {
  if (!selector || !el.attributes) return false

  if (selector.charAt(0) === '#') {
    const attr = el.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) return true
  } else if (selector.charAt(0) === '.') {
    const attr = el.attributes.filter(attr => attr.name === 'class')[0]
    if (attr && attr.value === selector.replace('#', '')) return true
  } else if (el.tagName === selector) return true

  return false
}

function specificity(selector) {
  const p = [0, 0, 0, 0]
  const selectorParts = selector.split(" ")

  for (let part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1
    } else if (part.charAt(0) === '.') {
      p[2] +=1
    } else {
      p[3] += 1
    }
  }
  return p
}

function compare(s1, s2) {
  if (s1[0] - s2[0]) return s1[0] - s2[0]
  if (s1[1] - s2[1]) return s1[1] - s2[1]
  if (s1[2] - s2[2]) return s1[2] - s2[2]

  return s1[3] - s2[3]
}

function computeCSS(el) {
  const elements = stack.slice().reverse()
  if (!el.computedStyle) el.computedStyle = {}

  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(" ").reverse()

    if (!match(el, selectorParts[0])) continue

    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }
    let matched
    if (j >= selectorParts.length) matched = true
    if (matched) {
      const sp = specificity(rule.selectors[0])
      const computedStyle = el.computedStyle
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property])
          computedStyle[declaration.property] = {}

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0)
          for (let k = 0; k < 4; k++)
            computedStyle[declaration.property][declaration.value][k] += sp[k]
      }
    }
  }
}


// --------------------  html parser-----------------------

function emit(token) {
  let top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p !== 'type' || p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(element)

    if (!token.isSelfClosing) stack.push(element)

    currentTextNode = null

  } else if (token.type === 'endTag') {

    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match!")
    } else {
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content)
      }
      stack.pop()
    }
    layout(top)
    currentTextNode = null

  } else if (token.type === 'text') {

    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen
  }

  if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return false
  }

  emit({
    type: 'text',
    content: c
  })
  return data
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    emit({
      type: 'text',
      content: c
    })
    return false
  }

}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  }
  if (c === '/') {
    return selfClosingStartTag
  }
  if (c.match(/^[A-Z]$/)) {
    currentToken.tagName += c
    return tagName
  }
  if (c === '>'){
    emit(currentToken)
    return data
  }

}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  }

  if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  }

  if (c === '=')  return

  currentAttribute = {
    name: '',
    value: ''
  }
  return attributeName(c)
}

function attributeName(c) {
  if (c.match(/^[[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  }

  if (c === '=') {
    return beforeAttributeValue
  }

  if (c === '\u0000') return

  if (c === '\"' || c === "'" || c === '<') return

  currentAttribute.name += c
  return attributeName
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '\"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singleQuotedAttributeValue
  } else if (c === '>') {

  } else {
    return UnquotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    // todo
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if ( c === '\u0000') {

  } else if ( c === '\"' || c === "'" || c === "<" || c === "=" || c === "`") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {

  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName
  } else if (c === '>') {

  } else if (c === EOF) {

  } else {

  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
  return stack[0]
}