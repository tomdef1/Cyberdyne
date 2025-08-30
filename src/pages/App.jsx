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
import LegalOverview from './LegalOverview.jsx';
import TermsOfService from './TermsOfService.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import CookiePolicy from './CookiePolicy.jsx';
import AcceptableUse from './AcceptableUse.jsx';
import SecurityPolicy from './SecurityPolicy.jsx';
import ResponsibleDisclosure from './ResponsibleDisclosure.jsx';
import DataProcessingAddendum from './DataProcessingAddendum.jsx';
import Accessibility from './Accessibility.jsx';
import ExportCompliance from './ExportCompliance.jsx';
import AIUseEthics from './AIUseEthics.jsx';
import DMCA from './DMCA.jsx';
import CodeOfConduct from './CodeOfConduct.jsx';
import ForwardLooking from './ForwardLooking.jsx';
import SkynetBaseLayer from './SkynetBaseLayer.jsx';

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
  <Route path="/legal" element={<LegalOverview />} />
  <Route path="/terms" element={<TermsOfService />} />
  <Route path="/privacy" element={<PrivacyPolicy />} />
  <Route path="/cookies" element={<CookiePolicy />} />
  <Route path="/acceptable-use" element={<AcceptableUse />} />
  <Route path="/security-policy" element={<SecurityPolicy />} />
  <Route path="/responsible-disclosure" element={<ResponsibleDisclosure />} />
  <Route path="/dpa" element={<DataProcessingAddendum />} />
  <Route path="/accessibility" element={<Accessibility />} />
  <Route path="/export-compliance" element={<ExportCompliance />} />
  <Route path="/ai-ethics" element={<AIUseEthics />} />
  <Route path="/dmca" element={<DMCA />} />
  <Route path="/code-of-conduct" element={<CodeOfConduct />} />
  <Route path="/forward-looking" element={<ForwardLooking />} />
  <Route path="/skynet-base-layer" element={<SkynetBaseLayer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteShell>
  );
}
