import { useMemo } from 'react';
import Section from '../ui/Section.jsx';

/* DefenceExpos
   Lists major 2025 defence & aerospace exhibitions Cyberdyne will attend / monitor.
   - Automatically marks events complete if current browser date > event end.
   - Groups by month & region; includes richer descriptive context than raw list.
*/

// Helper to build a Date safely in local tz (YYYY, M-1, D)
function d(y,m,d){ return new Date(y,m-1,d); }

const EVENTS = [
  // JAN
  { name:'Surface Navy Association Symposium', short:'Surface Navy', start:d(2025,1,14), end:d(2025,1,16), month:'January', region:'North America', city:'Crystal City, VA, USA', focus:'Naval surface warfare innovation, fleet readiness, C2 modernization, integrated combat systems.' },
  { name:'International Armoured Vehicles Conference', short:'IAVC', start:d(2025,1,21), end:d(2025,1,23), month:'January', region:'Europe', city:'London, UK', focus:'Protected mobility, survivability enhancements, active protection, digital fleet architectures.' },
  // FEB
  { name:'Aero India', start:d(2025,2,10), end:d(2025,2,14), month:'February', region:'Asia', city:'Bengaluru, India', focus:'Fast jet, rotary & unmanned integration, indigenous air combat enablers, export partnerships.' },
  { name:'IDEX / NAVDEX', start:d(2025,2,17), end:d(2025,2,21), month:'February', region:'Middle East', city:'Abu Dhabi, UAE', focus:'Joint land / naval platforms, C4ISR fusion, counter‑UAS, smart munitions, maritime autonomy.' },
  // MAR
  { name:'Avalon (Australian International Airshow)', short:'Avalon', start:d(2025,3,25), end:d(2025,3,28), month:'March', region:'Asia-Pacific', city:'Avalon, Australia', focus:'Aerospace sustainment, ISR payload chains, HALE/MALE UAS coordination, next‑gen training.' },
  { name:'IT²EC', start:d(2025,3,25), end:d(2025,3,27), month:'March', region:'Europe', city:'Oslo, Norway', focus:'Synthetic training environments, distributed simulation, immersive warfighter prep pipelines.' },
  { name:'Undersea Defence Technology', short:'UDT', start:d(2025,3,25), end:d(2025,3,27), month:'March', region:'Europe', city:'Oslo, Norway', focus:'Sub-surface deterrence, unmanned undersea vehicles, acoustic stealth & networking.' },
  // APR
  { name:'LAAD', start:d(2025,4,1), end:d(2025,4,4), month:'April', region:'South America', city:'Rio de Janeiro, Brazil', focus:'Regional joint interoperability, border ISR, rotary modernization, integrated defence logistics.' },
  { name:'Aerospace TechWeek Europe', start:d(2025,4,2), end:d(2025,4,3), month:'April', region:'Europe', city:'Munich, Germany', focus:'Avionics digitization, predictive maintenance analytics, avionics cyber resilience.' },
  { name:'Sea-Air-Space (Navy League)', short:'Sea-Air-Space', start:d(2025,4,6), end:d(2025,4,9), month:'April', region:'North America', city:'National Harbor, MD, USA', focus:'Maritime C2, fleet sustainment tech, naval unmanned teaming, ISR convergence.' },
  { name:'FAMEX', start:d(2025,4,23), end:d(2025,4,26), month:'April', region:'North America', city:'Santa Lucia, Mexico', focus:'Regional aerospace supply chain development, air mobility, dual‑use innovation.' },
  { name:'Modern Day Marine', start:d(2025,4,29), end:d(2025,5,4), month:'April', region:'North America', city:'Washington DC, USA', focus:'Expeditionary ISR, littoral maneuver, resilient mesh networking, autonomous sustainment.' },
  // MAY
  { name:'Rotorcraft Asia + Unmanned Systems Asia', start:d(2025,5,3), end:d(2025,5,5), month:'May', region:'Asia', city:'Changi, Singapore', focus:'Urban air mobility, multi‑domain unmanned coordination, mission system modularity.' },
  { name:'SOF Week', start:d(2025,5,5), end:d(2025,5,9), month:'May', region:'North America', city:'Tampa, Florida, USA', focus:'Low‑signature insertion, ISR convergence, tactical autonomy kits, rapid sensor fusion.' },
  { name:'IMDEX Asia', start:d(2025,5,6), end:d(2025,5,8), month:'May', region:'Asia', city:'Changi, Singapore', focus:'Maritime domain awareness, anti‑submarine warfare tech, unmanned surface / subsurface ops.' },
  { name:'DEFEA', start:d(2025,5,6), end:d(2025,5,8), month:'May', region:'Europe', city:'Athens, Greece', focus:'Regional land/air modernization, integrated fires, layered air defence architectures.' },
  { name:'AOC Europe', start:d(2025,5,6), end:d(2025,5,8), month:'May', region:'Europe', city:'Rome, Italy', focus:'Electromagnetic superiority, cognitive EW, spectrum maneuver & resilient waveforms.' },
  { name:'Feindef', start:d(2025,5,12), end:d(2025,5,14), month:'May', region:'Europe', city:'Madrid, Spain', focus:'European defence industrial collaboration, protected mobility, sustainment digital twins.' },
  { name:'AUVSI Xponential', start:d(2025,5,19), end:d(2025,5,22), month:'May', region:'North America', city:'Houston, TX, USA', focus:'Uncrewed systems integration, autonomy stacks, BVLOS regulatory progress, swarming control.' },
  { name:'Combined Naval Event', start:d(2025,5,20), end:d(2025,5,22), month:'May', region:'Europe', city:'Farnborough, UK', focus:'Integrated maritime C4ISR, naval data fabrics, digital ship sustainment ecosystems.' },
  { name:'LIMA', start:d(2025,5,20), end:d(2025,5,24), month:'May', region:'Asia', city:'Langkawi, Malaysia', focus:'Aerial + maritime security cooperation, coastal surveillance networks, multi‑domain training.' },
  { name:'DSEI Japan', start:d(2025,5,21), end:d(2025,5,23), month:'May', region:'Asia', city:'Tokyo, Japan', focus:'Indo‑Pacific deterrence tech, missile defence sensors, defence supply chain resiliency.' },
  { name:'IDET', start:d(2025,5,28), end:d(2025,5,30), month:'May', region:'Europe', city:'Brno, Czech Republic', focus:'Ground force modernization, command post digitization, counter‑UAS, modular armor systems.' },
  { name:'CANSEC', start:d(2025,5,28), end:d(2025,5,29), month:'May', region:'North America', city:'Ottawa, Canada', focus:'Land C4ISR, Arctic operations enablement, logistics autonomy, cyber defence resilience.' },
  // JUL
  { name:'Paris Air Show', start:d(2025,7,16), end:d(2025,7,22), month:'July', region:'Europe', city:'Le Bourget, Paris, France', focus:'Future combat air systems, sustainable propulsion, cooperative combat drones, avionics.' },
  { name:'RIAT', start:d(2025,7,18), end:d(2025,7,20), month:'July', region:'Europe', city:'Fairford, UK', focus:'Operational fast jet demonstrations, interoperability showcases, heritage to 6th‑gen bridge.' },
  { name:'IDEF', start:d(2025,7,22), end:d(2025,7,27), month:'July', region:'Middle East', city:'Istanbul, Turkey', focus:'Joint land systems, precision effects, armoured mobility, indigenous industrial capacity.' },
  // SEP
  { name:'MSPO', start:d(2025,9,1), end:d(2025,9,5), month:'September', region:'Europe', city:'Kielce, Poland', focus:'NATO eastern flank sustainment, artillery modernization, air/missile defence layering.' },
  { name:'DSEI', start:d(2025,9,9), end:d(2025,9,12), month:'September', region:'Europe', city:'London, UK', focus:'Multi‑domain integration, maritime autonomy corridors, digital twin mission rehearsal.' },
  { name:'AFA Air & Space Conference', short:'AFA', start:d(2025,9,20), end:d(2025,9,21), month:'September', region:'North America', city:'National Harbor, MD, USA', focus:'Force design, space domain integration, resilient comms, next‑gen training ecosystems.' },
  { name:'Partner 2025', start:d(2025,9,23), end:d(2025,9,26), month:'September', region:'Europe', city:'Belgrade, Serbia', focus:'Regional industry collaboration, armored platforms, artillery C2, logistics digitalization.' },
  { name:'Sea Future', start:d(2025,9,29), end:d(2025,10,2), month:'September', region:'Europe', city:'La Spezia Naval Base, Italy', focus:'Green naval technologies, unmanned maritime security, port digitization, predictive sustainment.' },
  // OCT
  { name:'GSOF Europe', start:d(2025,10,7), end:d(2025,10,9), month:'October', region:'Europe', city:'Athens, Greece', focus:'Special operations modernization, ISR exploitation speed, tactical edge analytics.' },
  { name:'AUSA Annual', start:d(2025,10,13), end:d(2025,10,15), month:'October', region:'North America', city:'Washington DC, USA', focus:'Army modernization portfolios, contested logistics, soldier lethality, resilient networks.' },
  { name:'ADEX', start:d(2025,10,17), end:d(2025,10,24), month:'October', region:'Asia', city:'Seoul, South Korea', focus:'Peninsula air defence integration, precision strike, unmanned teaming, space ISR.' },
  { name:'Expodefensa', start:d(2025,10,20), end:d(2025,10,22), month:'October', region:'South America', city:'Bogota, Colombia', focus:'Security & defence tech convergence, counter‑narco ISR, rotary modernization.' },
  { name:'SIDEC (Slovenian Int. Defence Show)', short:'SIDEC', start:d(2025,10,21), end:d(2025,10,24), month:'October', region:'Middle East', city:'Celje, Slovenia', focus:'Multi‑role ground systems, soldier systems integration, training & simulation tech.' },
  // NOV
  { name:'Indo Pacific Maritime', start:d(2025,11,4), end:d(2025,11,6), month:'November', region:'Asia-Pacific', city:'Sydney, Australia', focus:'Regional maritime security, undersea deterrence, amphibious readiness, data fusion.' },
  { name:'Defence & Security (Thailand)', start:d(2025,11,10), end:d(2025,11,13), month:'November', region:'Asia', city:'Bangkok, Thailand', focus:'ASEAN joint capability development, border surveillance, armoured mobility.' },
  { name:'Dubai Air Show', start:d(2025,11,17), end:d(2025,11,21), month:'November', region:'Middle East', city:'Dubai, UAE', focus:'Wide‑body & business aviation tech, advanced propulsion, aerial surveillance integration.' },
  { name:'Milipol', start:d(2025,11,18), end:d(2025,11,21), month:'November', region:'Europe', city:'Villepinte Paris, France', focus:'Homeland security, biometric & identity intelligence, counter‑drone, civil protection.' },
  { name:'NEDS / NIDV Defence & Security', start:d(2025,11,20), end:d(2025,11,20), month:'November', region:'Europe', city:'Rotterdam, Netherlands', focus:'Supply chain resilience, naval innovation, European defence industry networking.' },
  // DEC
  { name:'I/ITSEC', start:d(2025,12,1), end:d(2025,12,5), month:'December', region:'North America', city:'Orlando, FL, USA', focus:'Modeling & simulation, training & readiness analytics, immersive LVC integration.' },
  { name:'EDEX', start:d(2025,12,1), end:d(2025,12,4), month:'December', region:'Middle East', city:'New Cairo, Egypt', focus:'Regional defence industrialization, land systems, border security, emerging tech adoption.' },
  { name:'AOC Annual Convention', start:d(2025,12,9), end:d(2025,12,11), month:'December', region:'North America', city:'National Harbor, MD, USA', focus:'Cyber‑electromagnetic convergence, EW modernization, spectrum operations tooling.' },
];

export default function DefenceExpos(){
  const grouped = useMemo(()=>{
    const now = new Date();
    const byMonth = new Map();
    for(const ev of EVENTS){
      const key = ev.month;
      const past = now > ev.end;
      const range = ev.start.toLocaleDateString(undefined,{ day:'numeric', month:'short'}) + ' – ' + ev.end.toLocaleDateString(undefined,{ day:'numeric', month:'short'});
      const enriched = { ...ev, past, range };
      if(!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(enriched);
    }
    return [...byMonth.entries()].sort((a,b)=> new Date(a[1][0].start) - new Date(b[1][0].start));
  },[]);

  return (
    <>
      <Section heading="2025 Defence & Aerospace Engagements" eyebrow="Events">
        Cyberdyne planned presence / analysis targets across key global defence exhibitions. Past events automatically strike through. Focus descriptors highlight technology intelligence priorities (autonomy, ISR fusion, resilient compute, mission simulation).
      </Section>
      <div className="expos" role="list">
        {grouped.map(([month, list])=> (
          <div key={month} className="expo-month" role="group" aria-label={month}>
            <h3>{month}</h3>
            <ul>
              {list.sort((a,b)=>a.start-b.start).map(ev=> (
                <li key={ev.name} className={ev.past? 'past': ''}>
                  <div className="expo-h">{ev.past? <s>{ev.name}</s>: ev.name} <span className="expo-range">{ev.range}</span></div>
                  <div className="expo-meta">{ev.city} • {ev.region}</div>
                  <div className="expo-focus small">{ev.focus}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
