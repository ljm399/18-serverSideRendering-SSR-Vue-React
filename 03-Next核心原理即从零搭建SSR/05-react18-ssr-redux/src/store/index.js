import { configureStore } from '@reduxjs/toolkit'
import { counterActions, counterReducer } from './module/counter.js'

export function createStore(preloadedState) {
  return configureStore({
    reducer: {
      counter: counterReducer
    },
    preloadedState
  })
}

export { counterActions }
