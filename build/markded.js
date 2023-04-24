const marked = require("marked");
const { Renderer } = marked;
const hljs = require("highlight.js");

Renderer.prototype.link = function (href, title, text) {
  let relative = !/^(https?:)?\/\//.test(href);
  let out = `<a href="${href}"`;

  if (relative === false) {
    out += ` target="_blank"`;
  }

  if (title) {
    out += ` title="${title}"`;
  }

  out += `>${text}</a>`;

  return out;
};

Renderer.prototype.code = function (code, lang) {
  lang = lang || "javascript";
  const markup = hljs.highlight(lang, code).value;
  return `<pre><code class="hljs lang-${lang}">${markup}</code></pre>`;
};

Renderer.prototype.image = function (href, title, text) {
  href = href
    .replace(
      /http:\/\/(s|p)([0-9])\.(qhimg|qhres)\.com/,
      (_, g1, g2, g3) => `https://${g1}${Math.min(Number(g2), 3)}.ssl.${g3}.com`
    )
    .replace(/qhres\.com/, 'qhres2.com');

  var out = '<img v-lazy="`' + href + '`" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? "/>" : ">";
  return out;
};

Renderer.prototype.html = function (code) {
  code = code.replace(
    /<img src="([^"]+)"/g,
    (m, g1) => `<img v-lazy="'${g1}'"`
  );
  return code;
};

const renderer = new Renderer();
module.exports = function (source) {
  return marked(source, {
    renderer
  });
};
