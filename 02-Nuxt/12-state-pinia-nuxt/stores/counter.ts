export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 100
  }),
  actions: {
    add() {
      this.count++
    }
  }
})
