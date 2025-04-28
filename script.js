
let risorse = [];
document.querySelectorAll('.accordion-button').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    document.querySelectorAll('.accordion-content').forEach(c => {
      if (c !== content) c.style.maxHeight = null;
    });
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

function formatDate(dateStr) {
  const parts = dateStr.split(/[-\/]/);
  if (parts.length >= 3) {
    let [d, m, y] = parts;
    if (y.length === 4) [d, m, y] = [parts[2], parts[1], parts[0]];
    return d.padStart(2, '0') + '-' + m.padStart(2, '0') + '-' + y.slice(-4);
  }
  return dateStr;
}

function aggiornadisponibile() {
  const input = document.getElementById('file-risorse');
  if (!input.files.length) {
    alert('Caricare un file.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n').slice(1);
    risorse = lines.map(line => {
      const [ris, dim, disp] = line.split(',');
      return {
        risorsa: ris.trim(),
        dimensione: parseFloat(dim?.trim() || 0),
        disponibile: formatDate(disp?.trim() || new Date().toLocaleDateString('it-IT').split('/').reverse().join('-'))
      };
    });
    alert('Risorse aggiornate.');
  };
  reader.readAsText(input.files[0]);
}

function aggiornarisorsa() {
  const risorsa = document.getElementById('input-risorsa').value.trim();
  const disponibile = document.getElementById('input-disponibile').value;
  if (risorsa.length !== 4 || !disponibile) {
    alert('Inserire dati validi.');
    return;
  }
  const r = risorse.find(r => r.risorsa === risorsa);
  if (r) {
    r.disponibile = formatDate(disponibile);
    alert('Risorsa aggiornata.');
  } else {
    alert('Risorsa non trovata.');
  }
}

function ricercadisponibile() {
  const partenza = document.getElementById('input-partenza').value;
  const lunghezza = parseFloat(document.getElementById('input-lunghezza').value);
  if (!partenza || isNaN(lunghezza)) {
    alert('Inserire dati validi.');
    return;
  }
  const dataPartenza = new Date(partenza);
  const risultati = risorse.filter(r =>
    r.dimensione >= lunghezza &&
    new Date(r.disponibile.split('-').reverse().join('-')) >= dataPartenza
  ).sort((a, b) => a.dimensione - b.dimensione);
  const tbody = document.querySelector('#tabella-risultati tbody');
  tbody.innerHTML = '';
  risultati.forEach(r => {
    const row = `<tr><td>\${r.risorsa}</td><td>\${r.dimensione.toFixed(2)}</td><td>\${r.disponibile.split('-').reverse().join('/')}</td></tr>`;
    tbody.innerHTML += row;
  });
}
