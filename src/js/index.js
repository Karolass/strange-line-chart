import ssc from './ssc'

module.exports = {
  draw(options) {
    if (!options.element) {
      return console.error('element is required')
    }

    if (document.querySelector('table')) {
      document.querySelector('table').remove()
    }
    if (document.querySelector('canvas')) {
      document.querySelector('canvas').remove()
    }

    ssc.init(options.element, options.data)
  }
}
