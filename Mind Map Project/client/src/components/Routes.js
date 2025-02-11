import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home";
import TraverseLearning from './TraverseLearning';
import Media from './Media';

const Paths = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/TraverseLearning" element={<TraverseLearning/>} />
          <Route path="/media" element={<Media/>} />
        </Routes>
      </Router>
    );
  };
  
  export default Paths;