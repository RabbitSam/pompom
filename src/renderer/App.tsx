import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import './App.scss';
import QuickPom from './quick-pom/QuickPom';
import StartTimer from './start-timer/StartTimer';

import Projects from './projects/Projects';
import ViewProject from './projects/[id]/ViewProject';
import CreateProject from './projects/create/CreateProject';
import EditProject from './projects/[id]/edit/EditProject';
import DeleteProject from './projects/[id]/delete/DeleteProject';

import CreateTask from './projects/[id]/tasks/create/CreateTask';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="quick-pom" element={<QuickPom/>}/>
        <Route path="start-timer" element={<StartTimer/>}/>

        <Route path="projects" element={<Projects/>}/>
        <Route path="projects/:projectId" element={<ViewProject />}/>
        <Route path="projects/:projectId/edit" element={<EditProject/>} />
        <Route path="projects/:projectId/delete" element={<DeleteProject/>} />
        <Route path="projects/create" element={<CreateProject />}/>
        
        <Route path="projects/:projectId/tasks/create" element={<CreateTask/>}/>
      </Routes>
    </Router>
  );
}
