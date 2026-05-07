const { defineStore } = require('pinia')

const useHomeStore = defineStore('home', {
  state() {
    return {
      count: 0
    }
  },
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
})

module.exports = {
  useHomeStore
}

module.exports.default = useHomeStore
