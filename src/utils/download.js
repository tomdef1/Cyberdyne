export function downloadJSON(name, data){
  try {
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/[^a-z0-9-_\.]/gi,'_');
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
  } catch(err){
    console.error('snapshot download failed', err);
    alert('Snapshot download failed');
  }
}
