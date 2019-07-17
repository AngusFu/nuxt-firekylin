module.exports = function (data, config) {
  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>${config.title}</title>
    <link href="/atom.xml" rel="self"/>
    <link href="http://${config.hostname}/"/>
    <updated>${new Date().toISOString()}</updated>
    <id>http://${config.hostname}/</id>
    <author>
      <name>${config.site_owner}</name>
    </author>
      ${
        data.slice(0, 10).map(item => `<entry>        
<title>${item.config.title}</title>
<link href="http://${config.hostname}/post/${item.config.filename}/"/>
<id>http://${config.hostname}/${item.config.filename}/</id>
</entry>`).join('\n')
      }
  </feed>`
}
