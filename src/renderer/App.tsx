import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import './App.scss';
import QuickPom from './quick-pom/QuickPom';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/quick-pom" element={<QuickPom/>}/>
      </Routes>
    </Router>
  );
}
