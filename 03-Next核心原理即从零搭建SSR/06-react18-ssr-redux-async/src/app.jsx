import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeInfo } from './store/index.js'

export default function App() {
  const { homeInfo, loading, error } = useSelector((state) => state.home)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>React SSR + Redux Async</h1>
      <button onClick={() => dispatch(fetchHomeInfo())}>load homeInfo</button>
      {loading ? <p>loading...</p> : null}
      {error ? <p>error: {String(error.message || error)}</p> : null}
      {homeInfo ? <pre>{JSON.stringify(homeInfo, null, 2)}</pre> : null}
    </div>
  )
}
