document.addEventListener("DOMContentLoaded", () => {
    // Imposta data minima per i campi date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("libera-fino-a").setAttribute("min", today);
    document.getElementById("partenza-il").setAttribute("min", today);

    // Gestione aggiorna disponibile
    document.getElementById("aggiorna-disponibile-btn").addEventListener("click", () => {
        const fileInput = document.getElementById("file-upload");
        if (fileInput.files.length === 0) {
            alert("Seleziona un file CSV.");
            return;
        }
        // Logica per aggiornare disponibile
        alert("Funzione aggiorna disponibile eseguita.");
    });

    // Gestione aggiorna risorsa
    document.getElementById("aggiorna-risorsa-btn").addEventListener("click", () => {
        const risorsa = document.getElementById("risorsa").value;
        const liberaFinoA = document.getElementById("libera-fino-a").value;

        if (!risorsa || risorsa.length !== 4) {
            alert("Inserisci una risorsa valida (4 caratteri).");
            return;
        }
        if (!liberaFinoA) {
            alert("Seleziona una data valida.");
            return;
        }

        // Logica per aggiornare risorsa
        alert("Funzione aggiorna risorsa eseguita.");
    });

    // Gestione ricerca
    document.getElementById("ricerca-btn").addEventListener("click", () => {
        const partenzaIl = document.getElementById("partenza-il").value;
        const lunghezza = document.getElementById("lunghezza").value;

        if (!partenzaIl) {
            alert("Seleziona una data di partenza.");
            return;
        }

        // Logica per la ricerca
        alert("Funzione ricerca eseguita.");
    });
});
