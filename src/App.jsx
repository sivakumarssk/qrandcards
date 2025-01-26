import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Navbar'
import QRGenerator from './screens/qrgenarator/QRGenerator'
import Home from './screens/home/Home'
import About from './screens/about/About'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import Pricing from './screens/pricing/Pricing'
import PersonalCards from './screens/mycards/personalcards/PersonalCards'

function App() {

  return (
    <>
    <Navbar/>

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/qr-generator' element={<QRGenerator/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/mycards/pricing' element={<PersonalCards/>}/>
    </Routes>
    </>
  )
}

export default App
