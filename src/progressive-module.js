module.exports = {
  postTransformNode: transform
}

function transform(node) {
  const tags = ['v-img']

  if (tags.includes(kebabCase(node.tag)) && node.attrs) {
    const attr = node.attrs.find(a => a.name === 'src')
    if (!attr) return

    const value = attr.value
    // only transform static URLs
    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      attr.value = urlToRequire(value.slice(1, -1))
    }
  }

  return node
}

function urlToRequire(url) {
  const firstChar = url.charAt(0)
  if (firstChar === '.' || firstChar === '~' || firstChar === '@') {
    if (firstChar === '~') {
      const secondChar = url.charAt(1)
      url = url.slice(secondChar === '/' ? 2 : 1)
    }
    return `require("${url}?vuetify-preload")`
  } else {
    return `"${url}"`
  }
}

function kebabCase (str) {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
