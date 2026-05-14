import gsap from 'gsap'
import {ScrollTrigger, SplitText} from 'gsap/all'
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import CreateCv from './users/pages/CreateCv';
import Profile from './users/pages/Profile';
import TemplateList from './pages/TemplateList';
import ChooseMethode from './pages/ChooseMethode';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/create-cv/:temp' element={<CreateCv/>}/>
            <Route path='/select-template' element={<TemplateList/>}/>
            <Route path='/choose-methode' element={<ChooseMethode/>}/>
            <Route path='/user-profile/:id' element={<Profile/>}/>
        </Routes>

    </>
    
  )
}

export default App