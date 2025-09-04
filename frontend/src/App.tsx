import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Body from './components/Body'

function App() {

  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
