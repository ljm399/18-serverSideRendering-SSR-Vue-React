import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from '../app.jsx'
import { createStore } from '../store/index.js'

const preloadedState = window.__PRELOADED_STATE__
const store = createStore(preloadedState)

hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
    }}
    >
      <App />
    </BrowserRouter>
  </Provider>
)
