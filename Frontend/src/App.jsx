import { useState } from 'react'
import Login from './component/login'
import Signup from './component/signup'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
     <Login />
  )
}

export default App
