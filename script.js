let dbrisorse = {};

document.addEventListener("DOMContentLoaded", caricaRisorse);

function caricaRisorse() {
  fetch("risorse.csv")
    .then(response => response.text())
    .then(text => {
      const righe = text.trim().split("\n").slice(1);
      righe.forEach(riga => {
        const [ris, dim, disp] = riga.split(",");
        const codice = ris.trim().substring(1);
        dbrisorse[codice] = [
          parseFloat(dim),
          disp.trim() || new Date().toISOString().split("T")[0]
        ];
      });
    });
}

function caricadisponibile() {
  const file = document.getElementById("csvDisponibili").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split("\n").slice(1);
    lines.forEach(line => {
      const [ris, disp] = line.split(",");
      const codice = ris.trim().substring(1);
      if (dbrisorse[codice]) {
        dbrisorse[codice][1] = disp.trim();
      }
    });
    alert("Disponibilità aggiornata.");
  };
  reader.readAsText(file);
}

function aggiornaRisorsa() {
  const codice = document.getElementById("risorsaSingola").value;
  const data = document.getElementById("dataSingola").value;
  if (dbrisorse[codice]) {
    dbrisorse[codice][1] = data;
    alert("Risorsa aggiornata.");
  } else {
    alert("Risorsa non trovata.");
  }
}

function ricercaRisorse() {
  const lunghezza = parseFloat(document.getElementById("lunghezzaMezzo").value);
  const partenza = document.getElementById("dataPartenza").value;

  const risultati = Object.entries(dbrisorse)
    .filter(([_, [dim, disp]]) => dim >= lunghezza && disp >= partenza)
    .sort((a, b) => {
      const [da, [dima, dataa]] = a;
      const [db, [dimb, datab]] = b;
      if (dataa !== datab) return dataa.localeCompare(datab);
      if (dima !== dimb) return dima - dimb;
      return da.localeCompare(db);
    });

  const tbody = document.querySelector("#tabellaRisultati tbody");
  tbody.innerHTML = "";
  risultati.forEach(([cod, [dim, disp]]) => {
    tbody.innerHTML += `<tr><td>${cod}</td><td>${dim.toFixed(2)}</td><td>${disp}</td></tr>`;
  });
}