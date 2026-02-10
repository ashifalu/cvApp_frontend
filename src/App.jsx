import gsap from 'gsap'
import {ScrollTrigger, SplitText} from 'gsap/all'
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import CreateCv from './users/pages/CreateCv';
import Profile from './users/pages/Profile';
import TemplatesList from './pages/TemplatesList';

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/create-cv' element={<CreateCv/>}/>
            <Route path='/user-profile/:id' element={<Profile/>}/>
            <Route path='/templates' element={<TemplatesList/>}/>
        </Routes>

    </>
    
  )
}

export default App