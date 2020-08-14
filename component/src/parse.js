let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [
  {
    type: 'document',
    children: []
  }
]

const EOF = Symbol('EOF')

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
      stack.pop()
    }
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

}

function attributeName(c) {

}

function afterAttributeName(c) {

}

function beforeAttributeValue(c) {

}

function doubleQuotedAttributeValue(c) {

}

function singleQuotedAttributeValue(c) {

}

function afterQuotedAttributeValue(c) {

}

function UnquotedAttributeValue(c) {

}

function selfClosingStartTag(c) {

}

function endTagOpen(c) {

}

module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for (let c of html) {
    state = state(c)
    if (stack[stack.length - 1].tagName === 'script' && state === data) {
      state = scriptData
    }
  }
  state = state(EOF)
  return stack[0]
}