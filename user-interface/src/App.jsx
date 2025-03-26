import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Login from './pages/Authentication/Login';
import ProtectedRoute from './utils/ProtectedRoutes';
import Register from './pages/Authentication/Register';
import MainEditor from "./pages/Editor/Main_Editor";
import CodeEditor from "@/pages/Editor/editor-pages/CodeEditor.jsx";

function App() {
  return (
   <BrowserRouter>
   <Routes>
     <Route element={<Login/>} path='/login'/>
     <Route element={<Register/>} path='/signup'/>     
     <Route element={<MainEditor/>} path="/editor"/>

   <Route element={<ProtectedRoute/>}>
     <Route element={<Home/>} path='/home'/>
   </Route>
   
   </Routes>
   </BrowserRouter>
  )
}

export default App;
