import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Inici from './pages/inici/Inici';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Navbar from './components/navbar/Navbar';
import DespesesDetall from './components/despesesDetall/DespesesDetall';

function App() {

  return (
    <div>
      <Navbar />
        <Routes>
          <Route path='/' element={<Inici />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/despesa/:id' element={<DespesesDetall />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default App
