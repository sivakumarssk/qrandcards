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
import TermsAndConditions from './policy/TermsandConditions'
import PrivacyPolicy from './policy/PrivacyPolicy'
import RefundPolicy from './policy/RefundPolicy'
import BusinessCards from './screens/mycards/businesscards/BusinessCards'
import Resume from './screens/mycards/resume/Resume'
import BioData from './screens/mycards/bioData/BioData'
import Invitation from './screens/mycards/invitation/Invitation'
import Property from './screens/mycards/property/Property'
import ImageToPDFGenerator from './screens/mycards/pdfGenarator/ImageToPDFGenerator'

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
      <Route path='/mycards/personal' element={<PersonalCards/>}/>
      <Route path='/mycards/business' element={<BusinessCards/>}/>
      <Route path='/mycards/resume' element={<Resume/>}/>
      <Route path='/mycards/bioData' element={<BioData/>}/>
      <Route path='/mycards/invitation' element={<Invitation/>}/>
      <Route path='/mycards/property' element={<Property/>}/>
      <Route path='/PDFGenerator' element={<ImageToPDFGenerator/>}/>
      <Route path='/policy/termsandconditions' element={<TermsAndConditions/>}/>
      <Route path='/policy/privacy' element={<PrivacyPolicy/>}/>
      <Route path='/policy/refund' element={<RefundPolicy/>}/>
    </Routes>
    </>
  )
}

export default App
