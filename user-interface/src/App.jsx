import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Authentication/Login';
import ProtectedRoute from './utils/ProtectedRoutes';
import Register from './pages/Authentication/Register';
import StudDash from "./pages/Student/StudDash";
import TeachDash from "./pages/Teacher/TeachDash";



function App() {
  return (
   <BrowserRouter>
   <Routes>
     <Route element={<Login/>} path='/login'/>
     <Route element={<Register/>} path='/signup'/>     
     
    {/* Student Routes */}
   <Route element={<ProtectedRoute allowedRole={['Student']}/>}>
     <Route element={<StudDash/>} path='/student'/>
   </Route>

     {/* Teacher Routes */}
     <Route element={<ProtectedRoute allowedRole={['Teacher']}/>}>
     <Route element={<TeachDash/>} path='/teacher'/>
   </Route>
   
   </Routes>
   </BrowserRouter>
  )
}

export default App;
