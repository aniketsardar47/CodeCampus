import { Heading } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home/Home'
import Stud_Form from './Login_Page/Login_Panel'

function App() {
  
  return (
    <>
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<Stud_Form />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </BrowserRouter>
       
    </>
  )
}

export default App
