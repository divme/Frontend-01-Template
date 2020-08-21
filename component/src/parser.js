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

// 以下解析vue 单页文件 script 部分的内容

function scriptData(c) {
  if (c === '<') {
    return scriptDataLessThanSign
  } else {
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
function scriptDataLessThanSign(c) {
  if (c === '/') {
    return scriptDataEndTagOpen
  } else {
    emit({
      type: 'text',
      content: '<'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
// </
function scriptDataEndTagOpen(c) {
  if (c === 's') {
    return scriptDataEndTagNameS
  } else {
    emit({
      type: 'text',
      content: '<'
    })
    emit({
      type: 'text',
      content: '/'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
// </s
function scriptDataEndTagNameS(c) {
  if ( c === 'c') {
    return scriptDataEndTagNameC
  } else {
    emit({
      type: 'text',
      content: '</s'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
// </sc
function scriptDataEndTagNameC(c) {
  if ( c === 'r') {
    return scriptDataEndTagNameR
  } else {
    emit({
      type: 'text',
      content: '</sc'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
// </scr
function scriptDataEndTagNameR(c) {
  if ( c === 'i') {
    return scriptDataEndTagNameI
  } else {
    emit({
      type: 'text',
      content: '</scr'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
// </scri
function scriptDataEndTagNameI(c) {
  if ( c === 'p') {
    return scriptDataEndTagNameP
  } else {
    emit({
      type: 'text',
      content: '</scri'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
// </scrip
function scriptDataEndTagNameP(c) {
  if ( c === 't') {
    return scriptDataEndTag
  } else {
    emit({
      type: 'text',
      content: '</scrip'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
 // </script
function scriptDataEndTag(c) {
  if (c === ' ') {
    return scriptDataEndTag
  } else if (c === '>') {
    emit({
      type: 'endTag',
      tagName: 'script'
    })
    return data
  } else {
    emit({
      type: 'text',
      content: '</script'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
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