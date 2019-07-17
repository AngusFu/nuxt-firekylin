const { basename, resolve } = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const indent = require('indent')
const yaml = require('js-yaml')
const mkdirp = require('mkdirp')
const yamlFront = require('yaml-front-matter')

const renderMd = require('./markded')
const renderRSS = require('./rss')

const POST_TMPL = fs.readFileSync(resolve(__dirname, './post.vue')).toString()
const PAGE_TMPL = fs.readFileSync(resolve(__dirname, './page.vue')).toString()
const siteConf = yaml.safeLoad(fs.readFileSync(resolve(__dirname, '../config.yaml'), 'utf8'))

mkdirp.sync(resolve(__dirname, '../data'))
mkdirp.sync(resolve(__dirname, '../pages/post'))
fs.writeFileSync(resolve(__dirname, '../static/CNAME'), siteConf.hostname)

const main = function (data) {
  const metaTags = {}
  const metaCates = {}
  const metaArchives = {}

  fs.writeFile(
    resolve(__dirname, '../static/atom.xml'),
    renderRSS(data, siteConf)
  )

  data.forEach((item, i) => {
    const {
      tags = [],
      category,
      date,
      filename,
      from
    } = item.config

    let title = item.config.title
    if (from) {
      title = from ? '[译] ' + title : title
      item.config.title = title
    }

    tags.forEach(tag => {
      metaTags[tag] = metaTags[tag] || []
      metaTags[tag].push(i)
    })

    if (category) {
      metaCates[category] = metaCates[category] || []
      metaCates[category].push(i)
    }

    const yearMonth = date.getFullYear() + ' 年 ' +
      (date.getMonth() + 1) + ' 月'
    metaArchives[yearMonth] = metaArchives[yearMonth] || []
    metaArchives[yearMonth].push({
      title,
      pathname: encodeURIComponent(filename),
      create_time: date.toISOString().slice(0, 10)
    })
  })

  // 生成标签汇总数据
  makeTagsFile(metaTags, './data/tags.json')
  // 生成分类数据
  makeTagsFile(metaCates, './data/cates.json')

  // 生成归档数据
  const archiveInfo = Object.keys(metaArchives).reduce((acc, key) => {
    acc.push({
      yearMonth: key,
      data: metaArchives[key]
    })
    return acc
  }, [])
  fs.writeFile('./data/archives.json', JSON.stringify(archiveInfo))

  // 生成标签和分类下面的文章
  fs.writeFile('./data/posts.json', JSON.stringify(data.map(getPostAbstract)))

  fs.emptyDirSync(resolve(__dirname, '../pages/post'))
  data.forEach((item, index) => {
    const content = makePostVue(makePostInfo(data, index))
    const file = './pages/post/' + item.config.filename + '.vue'
    fs.writeFileSync(file, content)
  })
}

const postFiles = Array.from(glob.sync('./source/_post/*.md'))
const pages = Array.from(glob.sync('./source/*.md'))

Promise
  .all(postFiles.map(getFileInfo))
  .then(data => data.sort((a, b) => b.config.date - a.config.date))
  .then(main)

Promise
  .all(pages.map(getFileInfo))
  .then(data => {
    data.forEach((item, i) => {
      const content = PAGE_TMPL
        .replace('__MARKDOWN__', indent(item.source, 6))
        .replace('__CONFIG__', JSON.stringify(item.config))
      fs.writeFile('./pages/' + item.config.filename + '.vue', content)
    })
  })

function makePostVue (data) {
  return POST_TMPL
    .replace('__DATA_', JSON.stringify(data.meta))
    .replace('__CONTENT__', data.content)
}

function makePostInfo (posts, index) {
  const post = posts[index]
  if (!post) return null

  const config = post.config
  const content = post.source
  const prev = posts[index - 1]
  const next = posts[index + 1]

  const meta = {
    title: config.title,
    description: config.desc || config.description,
    keywords: (config.keywords || config.tags).join(','),
    pathname: encodeURIComponent(config.filename),
    translation: config.from ? {
      author: config.author,
      social: config.social,
      from: config.from
    } : null,
    create_time: config.date.toISOString().slice(0, 10),
    prev: !prev ? {} : {
      title: prev.config.title,
      pathname: encodeURIComponent(prev.config.filename)
    },
    next: !next ? {} : {
      title: next.config.title,
      pathname: encodeURIComponent(next.config.filename)
    }
  }
  return {
    meta,
    content
  }
}

function makeTagsFile (map, file) {
  // 生成标签汇总数据
  const data = Object.keys(map).reduce((acc, key) => {
    acc.push({
      pathname: encodeURIComponent(key),
      name: key,
      count: map[key].length
    })
    return acc
  }, []).sort((a, b) => b.count - a.count)
  fs.writeFile(file, JSON.stringify(data))
}

function getPostAbstract (item) {
  const {
    date,
    tags,
    title,
    category,
    filename,
    editor,
    desc,
    description
  } = item.config

  const summary = item.source
      .replace(/[\n\r\t]/g, '')
      .replace(/<svg[ >].*?<\/svg>/g, '')
      .replace(/<\/?[^>]*>/g, '')
      .replace(/(?:%\d+[\w-]+)+/g, '')
      .substr(0, 200).trim()

  return {
    user: editor || siteConf.site_owner || 'admin',
    title,
    tags,
    category,
    date,
    create_time: date.toISOString().slice(0, 10),
    pathname: encodeURIComponent(filename),
    summary: summary ? (summary + '...') : (desc || description)
  }
}

function getFileInfo (file) {
  return fs.readFile(file)
    .then(getFrontMatter)
    .then(data => {
      const filename = basename(file).replace(/\.(?:md|markdown)$/, '')
      data.config.filename = filename
      return data
    })
}

function getFrontMatter (source) {
  const result = yamlFront.loadFront(source, '__mdContent')
  const { __mdContent } = result
  delete result.__mdContent
  return {
    source: renderMd(__mdContent),
    config: result
  }
}
