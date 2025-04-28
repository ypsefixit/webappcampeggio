let risorse = [];

function formatDate(input) {
    const date = new Date(input);
    const giorno = String(date.getDate()).padStart(2, '0');
    const mese = String(date.getMonth() + 1).padStart(2, '0');
    return `${giorno}/${mese}`;
}

function todayString() {
    const oggi = new Date();
    const giorno = String(oggi.getDate()).padStart(2, '0');
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const anno = oggi.getFullYear();
    return `${giorno}-${mese}-${anno}`;
}

async function databaserisorse() {
    const response = await fetch('risorse.xlsx');
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    risorse = json.map(r => ({
        risorsa: String(r.risorsa).trim(),
        dimensione: parseFloat(r.dimensione),
        disponibile: r.disponibile ? r.disponibile : todayString()
    }));
    alert("Risorse caricate!");
}

function aggiornadisponibile() {
    const fileInput = document.getElementById('fileInputAggiorna').files[0];
    if (!fileInput) {
        alert("Seleziona un file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        json.forEach(row => {
            const r = risorse.find(el => el.risorsa === row.risorsa);
            if (r) {
                r.disponibile = row.disponibile ? row.disponibile : todayString();
            }
        });
        alert("Risorse aggiornate!");
    };
    reader.readAsArrayBuffer(fileInput);
}

function aggiornarisorsa() {
    const risorsaInput = document.getElementById('campoRisorsa').value.trim();
    const disponibileInput = document.getElementById('campoDisponibile').value;

    if (risorsaInput.length !== 4 || !disponibileInput) {
        alert("Inserisci tutti i campi correttamente!");
        return;
    }

    const r = risorse.find(el => el.risorsa === risorsaInput);
    if (r) {
        r.disponibile = disponibileInput.split('-').reverse().join('-');
        alert("Risorsa aggiornata!");
    } else {
        alert("Risorsa non trovata!");
    }
}

function ricercadisponibile() {
    const partenza = document.getElementById('campoPartenza').value;
    const lunghezza = parseFloat(document.getElementById('campoLunghezza').value);

    const results = risorse.filter(r => {
        const [d, m, y] = r.disponibile.split('-');
        const dataRisorsa = new Date(`${y}-${m}-${d}`);
        const dataFiltro = new Date(partenza);

        return r.dimensione >= lunghezza && dataRisorsa >= dataFiltro;
    }).sort((a, b) => {
        if (a.disponibile === b.disponibile) {
            if (a.dimensione === b.dimensione) {
                return a.risorsa.localeCompare(b.risorsa);
            }
            return a.dimensione - b.dimensione;
        }
        return new Date(a.disponibile.split('-').reverse().join('-')) - new Date(b.disponibile.split('-').reverse().join('-'));
    });

    const tbody = document.getElementById('tabellaRisultati').querySelector('tbody');
    tbody.innerHTML = '';

    results.forEach(r => {
        const row = `<tr><td>${r.risorsa}</td><td>${r.dimensione.toFixed(2)}</td><td>${formatDate(r.disponibile)}</td></tr>`;
        tbody.innerHTML += row;
    });

    alert(results.length ? "Ricerca completata!" : "Nessun risultato trovato!");
}
