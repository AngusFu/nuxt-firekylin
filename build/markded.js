const marked = require('marked')
const { Renderer } = marked
const hljs = require('highlight.js')

Renderer.prototype.link = function (href, title, text) {
  let relative = !/^(https?:)?\/\//.test(href)
  let out = `<a href="${href}"`

  if (relative === false) {
    out += ` target="_blank"`
  }

  if (title) {
    out += ` title="${title}"`
  }

  out += `>${text}</a>`

  return out
}

// 临时措施  2017-09-10
// Vue SSR text escape 导致
// https://github.com/vuejs/vue/commit/172dbf9faf4cb71dff72c77fdfe80fa1932d1ba3
// 已修复 等待版本发布
const wrapHljsCode = (code, lang) => `<textarea v-show="false" class="pre-area" width="0" height="0"><code class="hljs lang-${lang}">${code}</code></textarea>`

Renderer.prototype.code = function (code, language) {
  language = language || 'javascript'
  const markup = hljs.highlight(language, code).value
  const result = wrapHljsCode(encodeURIComponent(markup), language)
  return result
}

// 临时措施 2017-09-10
Renderer.prototype.codespan = function (code) {
  return `<textarea class="codespan" v-show="false" width="0" height="0">${code}</textarea>`
}

Renderer.prototype.image = function (href, title, text) {
  href = href.replace(/http:\/\/(s|p)[0-9]\.(qhimg|qhres)\.com/, "https://$1.ssl.$2.com")
  var out = '<img v-lazy="`' + href + '`" alt="' + text + '"'
  if (title) {
    out += ' title="' + title + '"'
  }
  out += this.options.xhtml ? '/>' : '>'
  return out
}
Renderer.prototype.html = function (code) {
  code = code.replace(/<img src="([^"]+)"/g, (m, g1) => `<img v-lazy="'${g1}'"`)
  return code
}

const renderer = new Renderer()
module.exports = function (source) {
  return marked(source, {
    renderer
  })
}
