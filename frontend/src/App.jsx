import './App.css'
import AddUser from './components/AddUser'
import EditUser from './components/EditUser'
import UserList from './components/UserList'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserList />} />
        <Route path='/add' element={<AddUser />} />
        <Route path='/edit/:id' element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
