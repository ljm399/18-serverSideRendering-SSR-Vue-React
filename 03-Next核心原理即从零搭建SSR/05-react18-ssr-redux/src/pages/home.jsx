import { useDispatch, useSelector } from 'react-redux'
import { counterActions } from '../store/index.js'

export default function Home() {
  const value = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => dispatch(counterActions.increment())}>redux count: {value}</button>
    </div>
  )
}
