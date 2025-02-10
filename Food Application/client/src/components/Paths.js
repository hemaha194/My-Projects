import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './Home';
import ViewList from './ViewList';
import UpdateList from './UpdateList';

function Paths(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/viewList' element={<ViewList/>}/>
            <Route path="/editList/:id" element={<UpdateList/>}/>
            
        </Routes>
        </BrowserRouter>
    )
}

export default Paths;