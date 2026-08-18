import gsap from 'gsap'
import {ScrollTrigger, SplitText} from 'gsap/all'
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Profile from './users/pages/Profile';
import TemplateList from './pages/TemplateList';
import ChooseMethode from './pages/ChooseMethode';
import UploadResume from "./pages/UploadResume.jsx";
import Create_cv from "./pages/createCV/Create_cv.jsx";
import { ToastContainer } from "react-toastify";
import FourNotFour from "./pages/Four-not-four.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";


gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home/>}/>

            <Route path='/create-cv/:temp' element={<Create_cv/>}/>
            <Route path='/create-cv/:temp/:resume_id' element={<Create_cv/>}/>
            <Route path='/create-cv/:temp/:previewData' element={<Create_cv/>}/>
            <Route path='/select-template' element={<TemplateList/>}/>
            <Route path='/select-template/:temp_id' element={<TemplateList/>}/>
            <Route path='/choose-methode/:temp_id' element={<ChooseMethode/>}/>
            <Route path='/choose-methode' element={<ChooseMethode/>}/>
            <Route path='/upload-resume/:temp_id' element={<UploadResume/>}/>
            <Route path='/user-profile/:id' element={<Profile/>}/>
            <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
            <Route path='*' element={<FourNotFour/>}/>

        </Routes>

        <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="light"
        />
    </>
    
  )
}

export default App