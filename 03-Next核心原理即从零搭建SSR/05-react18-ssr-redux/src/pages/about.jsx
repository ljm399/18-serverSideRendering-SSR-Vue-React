import { useDispatch, useSelector } from 'react-redux'
import { counterActions } from '../store/index.js'

export default function About() {
  const value = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>About</h2>
      <p>This is the About page.</p>
      <button onClick={() => dispatch(counterActions.increment())}>redux count: {value}</button>
    </div>
  )
}
