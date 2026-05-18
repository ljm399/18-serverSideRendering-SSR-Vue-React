import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from '../app.jsx'
import { createStore } from '../store/index.js'

const preloadedState = window.__PRELOADED_STATE__
const store = createStore(preloadedState)

hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}>
    <App />
  </Provider>
)
