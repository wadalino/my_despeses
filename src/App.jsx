import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Inici from './pages/inici/Inici';
import Login from './pages/login/Login';
import Projectes from './pages/projectes/Projectes';
import Register from './pages/register/Register';
import Navbar from './components/navbar/Navbar';
import DespesesDetall from './components/despesesDetall/DespesesDetall';
import ProjectesDetall from './components/projectes/ProjectesDetall';


function App() {

  return (
    <div>
      <Navbar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />} />
          {/* FIXME Inici should be projectes */}
          <Route path='/projectes' element={<Projectes />} />
          <Route path='/projecte/:id' element={<ProjectesDetall />} />
{/*

          <Route path='/projecte/:id/afegir' element={<DespesaForm />} />
          <Route path='/projecte/:id/editar/:idDespesa' element={<DespesaForm />} />

          <Route path='/projecte/:id/despeses' element={<ProjectesDetall />} />
          <Route path='/projecte/:id/despeses/afegir' element={<DespesaForm />} />
          <Route path='/projecte/:id/despeses/editar/:idDespesa' element={<DespesaForm />} />

          <Route path='/despesa/:id' element={<DespesesDetall />} />
*/}
          
          <Route path='*' element={<Navigate to="/login" replace />} />
        </Routes>
    </div>
  )
}

export default App
