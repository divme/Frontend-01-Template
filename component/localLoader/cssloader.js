let css = require('css')

module.exports = function(source, map) {
  let stylesheet = css.parse(source)

  console.log('stylesheet', css.stringify(stylesheet))

  let name = this.resourcePath.match(/([^/]+)\.css$/)[1]
  console.log(this.resourcePath)

  for (let rule of stylesheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selector =>
      selector.match(new RegExp(`^.${name}`)) ? selector : `.${name} ${selector}`
    )
  }

  console.log('stylesheet2', css.stringify(stylesheet))

  return `
  let style = document.createElement("style");
  style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))};
  document.documentElement.appendChild(style);
  `
}