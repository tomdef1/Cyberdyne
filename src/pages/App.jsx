import { Routes, Route } from 'react-router-dom';
import SiteShell from '../ui/SiteShell.jsx';
import Home from './Home.jsx';
import Skynet from './Skynet.jsx';
import Research from './Research.jsx';
import Timeline from './Timeline.jsx';
import Careers from './Careers.jsx';
import Containment from './Containment.jsx';
import EdgeRobotics from './EdgeRobotics.jsx';
import Neuromorphic from './Neuromorphic.jsx';
import Ethics from './Ethics.jsx';
import Security from './Security.jsx';
import Transparency from './Transparency.jsx';
import Executive from './Executive.jsx';
import DefenceExpos from './DefenceExpos.jsx';
import NotFound from './NotFound.jsx';

export default function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skynet" element={<Skynet />} />
        <Route path="/research" element={<Research />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/careers" element={<Careers />} />
  <Route path="/executive" element={<Executive />} />
  <Route path="/containment" element={<Containment />} />
  <Route path="/edge-robotics" element={<EdgeRobotics />} />
  <Route path="/neuromorphic" element={<Neuromorphic />} />
  <Route path="/ethics" element={<Ethics />} />
  <Route path="/security" element={<Security />} />
  <Route path="/transparency" element={<Transparency />} />
  <Route path="/expos" element={<DefenceExpos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteShell>
  );
}
