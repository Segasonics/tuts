import { useState } from 'react'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthProvider'

function App() {

  return (
    <>
    <AuthProvider>
    <Navbar />
     <Routes>    
        <Route path='/' element={< Home/>} />
        <Route path='/login' element={<Login />} /> 
        <Route path='/signup' element={<Signup />} />
      </Routes>
      <Toaster />
      </AuthProvider>
    </>
  )
}

export default App
