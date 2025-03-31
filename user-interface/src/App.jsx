import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Authentication/Login';
import ProtectedRoute from './utils/ProtectedRoutes';
import Register from './pages/Authentication/Register';
import StudDash from "./pages/Student/StudDash";
import TeachDash from "./pages/Teacher/TeachDash";
import CreateAssignment from "./pages/Teacher/CreateAssignment";
import LandingPage from "./pages/Landing";
import ViewSubmissions from "./pages/Teacher/ViewSubmissions";




function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route element={<LandingPage/>} path="/" />
     <Route element={<Login/>} path='/login'/>
     <Route element={<Register/>} path='/signup'/>    
     <Route element={<TeachDash/>} path='/teacher'/>
     <Route element={<CreateAssignment/>} path='/add-assignment'/>
     <Route element={<ViewSubmissions />} path="/submission/:assignmentName"  />
    
     
    {/* Student Routes */}
   <Route element={<ProtectedRoute allowedRole={['Student']}/>}>
     <Route element={<StudDash/>} path='/student'/>
   </Route>

     {/* Teacher Routes */}
     <Route element={<ProtectedRoute allowedRole={['Teacher']}/>}>
     <Route element={<TeachDash/>} path='/teacher'/>
     <Route element={<CreateAssignment/>} path='/add-assignment'/>

   </Route>
   
   </Routes>
   </BrowserRouter>
  )
}

export default App;
