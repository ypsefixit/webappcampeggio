
let risorse = [];

document.getElementById("form-aggiorna-risorse").addEventListener("submit", function(event) {
    event.preventDefault();
    const file = document.getElementById("carica-risorse").files[0];
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                results.data.forEach((row) => {
                    const risorsa = row[0];
                    const dimensione = parseFloat(row[1]);
                    const disponibile = row[2] ? dayjs(row[2], "DD-MM-YYYY").format("DD/MM") : dayjs().format("DD/MM");
                    risorse.push({ risorsa, dimensione, disponibile });
                });
                alert("Risorse aggiornate!");
            },
            header: false
        });
    }
});

document.getElementById("form-aggiorna-singola-risorsa").addEventListener("submit", function(event) {
    event.preventDefault();
    const risorsa = document.getElementById("risorsa").value;
    const liberaFinoA = dayjs(document.getElementById("libera-fino-a").value).format("DD/MM");
    const risorsaFound = risorse.find(r => r.risorsa === risorsa);
    if (risorsaFound) {
        risorsaFound.disponibile = liberaFinoA;
        alert("Risorsa aggiornata!");
    } else {
        alert("Risorsa non trovata!");
    }
});

document.getElementById("form-ricerca").addEventListener("submit", function(event) {
    event.preventDefault();
    const partenzaIl = dayjs(document.getElementById("partenza-il").value).format("DD/MM");
    const lunghezza = parseFloat(document.getElementById("lunghezza").value);
    const risultati = risorse.filter(r => r.dimensione >= lunghezza && dayjs(r.disponibile, "DD/MM").isSameOrAfter(partenzaIl));
    risultati.sort((a, b) => dayjs(a.disponibile, "DD/MM").isBefore(dayjs(b.disponibile, "DD/MM")) ? -1 : 1);
    displayResults(risultati);
});

function displayResults(results) {
    const tbody = document.getElementById("risultati-ricerca").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    results.forEach((r) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = r.risorsa;
        row.insertCell(1).textContent = r.dimensione;
        row.insertCell(2).textContent = r.disponibile;
    });
}
