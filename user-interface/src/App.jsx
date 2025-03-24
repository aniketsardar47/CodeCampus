import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import MainEditor from './pages/Editor/Main_Editor';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainEditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
