// Snapshot aggregation bus: components register lightweight providers returning serializable state.
// Provides bundle creation with SHA-256 signature (WebCrypto) plus auto-capture buffer.

const providers = new Map();
let autoTimer = null;
let autoBuffer = [];
let autoConfig = { interval: 15000, max: 20 };

export function registerSnapshot(name, fn){
  if(!name || typeof fn !== 'function') return () => {};
  providers.set(name, fn);
  return () => providers.delete(name);
}

export function setAutoConfig(cfg){
  autoConfig = { ...autoConfig, ...cfg };
}

export function listProviders(){
  return [...providers.keys()];
}

export async function takeBundle(){
  const entries = [];
  for(const [name,fn] of providers.entries()){
    try { entries.push({ name, data: fn() }); }
    catch(err){ entries.push({ name, error: err.message || String(err) }); }
  }
  return { ts: new Date().toISOString(), entries };
}

async function sha256(data){
  const enc = new TextEncoder();
  const bytes = enc.encode(data);
  if(globalThis.crypto && globalThis.crypto.subtle){
    try {
      const hash = await crypto.subtle.digest('SHA-256', bytes);
      const arr = Array.from(new Uint8Array(hash));
      const hex = arr.map(b=>b.toString(16).padStart(2,'0')).join('');
      const base64 = btoa(String.fromCharCode(...arr));
      return { hex, base64 };
    } catch {}
  }
  // Fallback simple FNV-1a
  let h = 2166136261>>>0; for(let i=0;i<bytes.length;i++){ h ^= bytes[i]; h = Math.imul(h,16777619); }
  const hex = (h>>>0).toString(16);
  return { hex, base64: hex };
}

export async function bundleWithSignature(){
  const bundle = await takeBundle();
  const json = JSON.stringify(bundle);
  const sig = await sha256(json);
  return { ...bundle, signature: { alg:'SHA-256', ...sig } };
}

export function getAutoCaptures(){ return autoBuffer.slice(); }

export function clearAutoCaptures(){ autoBuffer = []; }

export async function captureOnceIntoBuffer(){
  const b = await bundleWithSignature();
  autoBuffer.unshift(b);
  if(autoBuffer.length > autoConfig.max) autoBuffer.length = autoConfig.max;
  return b;
}

export function startAutoCapture(intervalMs = autoConfig.interval){
  if(autoTimer) return; // already running
  captureOnceIntoBuffer();
  autoTimer = setInterval(captureOnceIntoBuffer, intervalMs);
}

export function stopAutoCapture(){ if(autoTimer){ clearInterval(autoTimer); autoTimer=null; } }

export function isAutoRunning(){ return !!autoTimer; }
