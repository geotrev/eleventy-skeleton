module.exports = function (cfg) {
  cfg.addPassthroughCopy("assets")

  return {
    passthroughFileCopy: true,
  }
}
