let risorse = [];

function formatDate(dateStr) {
    const parts = dateStr.split(/[-\/]/);
    if (parts.length >= 3) {
        let [d, m, y] = parts;
        if (y.length === 4) [d, m, y] = [parts[2], parts[1], parts[0]];
        return d.padStart(2, '0') + '-' + m.padStart(2, '0') + '-' + y.slice(-4);
    }
    return dateStr;
}

function databaserisorse() {
    fetch('risorse.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').slice(1);
            const today = new Date();
            const todayStr = today.toLocaleDateString('it-IT').split('/').reverse().join('-');
            risorse = lines.map(line => {
                const [ris, dim, disp] = line.split(',');
                let disponibile = formatDate(disp?.trim() || todayStr);
                const dispDate = new Date(disponibile.split('-').reverse().join('-'));
                if (dispDate < today) disponibile = todayStr;
                return {
                    risorsa: ris.trim(),
                    dimensione: parseFloat(dim.trim()),
                    disponibile: disponibile
                };
            });
            alert('Dati risorse caricati.');
        });
}

function aggiornadisponibile() {
    const input = document.getElementById('fileInput');
    if (!input.files.length) {
        alert('Caricare un file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').slice(1);
        lines.forEach(line => {
            const [ris, disp] = line.split(',');
            const index = risorse.findIndex(r => r.risorsa === ris.trim());
            if (index >= 0) {
                risorse[index].disponibile = formatDate(disp.trim());
            }
        });
        alert('Risorse aggiornate.');
    };
    reader.readAsText(input.files[0]);
}

function aggiornarisorsa() {
    const risorsa = document.getElementById('risorsaSingola').value.trim();
    const liberaFinoA = document.getElementById('liberaFinoA').value;
    if (risorsa.length !== 4 || !liberaFinoA) {
        alert('Dati non validi.');
        return;
    }
    const index = risorse.findIndex(r => r.risorsa === risorsa);
    if (index >= 0) {
        risorse[index].disponibile = formatDate(liberaFinoA);
        alert('Risorsa aggiornata.');
    } else {
        alert('Risorsa non trovata.');
    }
}

function ricercadisponibile() {
    const partenzaIl = document.getElementById('partenzaIl').value;
    const lunghezza = parseFloat(document.getElementById('lunghezza').value);
    if (!partenzaIl || isNaN(lunghezza)) {
        alert('Inserire dati validi.');
        return;
    }
    const dataFiltro = new Date(partenzaIl);
    const risultati = risorse.filter(r => 
        parseFloat(r.dimensione) >= lunghezza &&
        new Date(r.disponibile.split('-').reverse().join('-')) >= dataFiltro
    ).sort((a, b) => {
        const da = new Date(a.disponibile.split('-').reverse().join('-'));
        const db = new Date(b.disponibile.split('-').reverse().join('-'));
        if (da - db !== 0) return da - db;
        if (a.dimensione - b.dimensione !== 0) return a.dimensione - b.dimensione;
        return a.risorsa.localeCompare(b.risorsa);
    });
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = '';
    risultati.forEach(r => {
        const row = `<tr><td>${r.risorsa}</td><td>${r.dimensione.toFixed(2)}</td><td>${r.disponibile.split('-').reverse().join('/')}</td></tr>`;
        tbody.innerHTML += row;
    });
    alert('Ricerca completata.');
}
