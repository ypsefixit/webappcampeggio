// Database interno delle risorse
let databaseRisorse = [];

// Carica file Excel iniziale all'avvio
document.addEventListener('DOMContentLoaded', async function() {
  document.getElementById('searchDate').valueAsDate = new Date();

  const selectDimension = document.getElementById('searchDimension');
  for (let i = 5; i <= 9; i += 0.5) {
    const option = document.createElement('option');
    option.value = i.toFixed(1);
    option.textContent = i.toFixed(1);
    selectDimension.appendChild(option);
  }

  await loadInitialData();
});

async function loadInitialData() {
  try {
    const response = await fetch('risorse.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    databaseRisorse = data.map(row => ({
      risorsa: String(row.risorsa).padStart(4, '0'),
      dimensione: parseFloat(row.dimensione).toFixed(2),
      disponibile: dayjs().format('DD/MM/YYYY')
    }));
  } catch (error) {
    console.error('Errore nel caricamento dati:', error);
  }
}

document.getElementById('uploadDisponibilita').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const disponibilita = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    disponibilita.forEach(item => {
      const risorsa = String(item.risorsa).padStart(4, '0');
      const disponibile = item.disponibile;
      const risorsaIndex = databaseRisorse.findIndex(r => r.risorsa === risorsa);
      if (risorsaIndex !== -1) {
        databaseRisorse[risorsaIndex].disponibile = disponibile;
      }
    });

    showAlert('Disponibilità aggiornata!', 'success');
  };
  reader.readAsArrayBuffer(file);
});

document.getElementById('btnSearch').addEventListener('click', function() {
  const searchDate = dayjs(document.getElementById('searchDate').value);
  const searchDimension = parseFloat(document.getElementById('searchDimension').value);

  const risultati = databaseRisorse.filter(risorsa => {
    const disponibileDate = dayjs(risorsa.disponibile, 'DD/MM/YYYY');
    return disponibileDate.isSameOrAfter(searchDate) && parseFloat(risorsa.dimensione) >= searchDimension;
  });

  risultati.sort((a, b) => {
    const da = dayjs(a.disponibile, 'DD/MM/YYYY');
    const db = dayjs(b.disponibile, 'DD/MM/YYYY');
    if (!da.isSame(db)) return da.isAfter(db) ? 1 : -1;
    if (a.dimensione !== b.dimensione) return a.dimensione - b.dimensione;
    return a.risorsa.localeCompare(b.risorsa);
  });

  populateTable(risultati);
});

function populateTable(data) {
  const tbody = document.getElementById('resultTable').querySelector('tbody');
  tbody.innerHTML = '';
  const today = dayjs();

  data.forEach(row => {
    const disponibileDate = dayjs(row.disponibile, 'DD/MM/YYYY');
    const tr = document.createElement('tr');

    if (disponibileDate.isBefore(today)) {
      tr.classList.add('table-danger');
    } else {
      tr.classList.add('table-success');
    }

    tr.innerHTML = `
      <td>${row.risorsa}</td>
      <td>${row.dimensione}</td>
      <td>${row.disponibile}</td>
    `;

    tbody.appendChild(tr);
  });
}

document.getElementById('btnUpdate').addEventListener('click', function() {
  const codiceRisorsa = document.getElementById('updateRisorsa').value.trim();
  const nuovaDataInput = document.getElementById('updateData').value;
  const nuovaData = nuovaDataInput ? dayjs(nuovaDataInput).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY');

  const index = databaseRisorse.findIndex(r => r.risorsa === codiceRisorsa);
  if (index !== -1) {
    databaseRisorse[index].disponibile = nuovaData;
    showAlert(`Risorsa ${codiceRisorsa} aggiornata con disponibilità: ${nuovaData}`, 'success');
  } else {
    showAlert('Risorsa non trovata.', 'danger');
  }
});

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.querySelector('.container').prepend(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
