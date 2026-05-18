import { configureStore } from '@reduxjs/toolkit'
import { homeReducer, fetchHomeInfo } from './module/home.js'

export function createStore(preloadedState) {
  return configureStore({
    reducer: {
      home: homeReducer
    },
    preloadedState
  })
}

export { fetchHomeInfo }
