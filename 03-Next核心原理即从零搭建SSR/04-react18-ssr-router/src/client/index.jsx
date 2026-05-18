import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from '../app.jsx'

hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <App />
  </BrowserRouter>
)
