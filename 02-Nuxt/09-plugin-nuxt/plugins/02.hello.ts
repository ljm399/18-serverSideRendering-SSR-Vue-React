export default defineNuxtPlugin(() => {
  console.log('[plugin] 02.hello')

  return {
    provide: {
      sayHello: (name: string) => `hello ${name}`
    }
  }
})
