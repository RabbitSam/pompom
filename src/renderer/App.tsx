import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import './App.scss';
import QuickPom from './quick-pom/QuickPom';
import StartTimer from './start-timer/StartTimer';
import Projects from './projects/Projects';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="quick-pom" element={<QuickPom/>}/>
        <Route path="start-timer" element={<StartTimer/>}/>
        <Route path="projects" element={<Projects/>}/>
      </Routes>
    </Router>
  );
}
