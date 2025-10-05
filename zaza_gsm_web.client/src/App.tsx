import { useState } from 'react'
import NavBar from './components/NavBar'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <NavBar/>
      <h1 className="text-3xl font-bold underline">
        Tailwind projekt!
      </h1>
    </div>
  )
}

export default App
