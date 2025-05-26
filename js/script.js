// Eingabe Check zur Validierung
function checkDatum(changedField) {
  const startInput = document.getElementById("start");
  const endInput = document.getElementById("ende");
  const startHinweis = document.getElementById("startHinweis");
  const endeHinweis = document.getElementById("endeHinweis");

  const startDatum = new Date(startInput.value);
  const endDatum = new Date(endInput.value);

  if (changedField === "start") {
    // Standardzustand zurücksetzen
    startInput.style.border = "";
    startHinweis.style.display = "none";
    // Prüfen nur wenn beide Felder ausgefüllt sind
    if (startDatum > endDatum) {
      startInput.style.border = "1px solid red";
	  startInput.value = "";
      startHinweis.style.display = "inline";
    }
  }

  if (changedField === "ende") {
    // Standardzustand zurücksetzen
    endInput.style.border = "";
    endeHinweis.style.display = "none";
    // Prüfen nur wenn beide Felder ausgefüllt sind
    if (endDatum < startDatum) {
      endInput.style.border = "1px solid red";
	  endInput.value = "";
      endeHinweis.style.display = "inline";
    }
  }
}

// Berechnen Button Aktivieren / Deaktivieren
	
function berechenenBtn() {
  const btn = document.getElementById("berechenenBtn");
  const start = document.getElementById("start").value;
  const ende = document.getElementById("ende").value;
  const fehltage = document.getElementById("fehltage").value;

    if (start == "" || ende == "" || fehltage == "") {
      btn.disabled = true;
       btn.classList.add("btnAktivieren");
       
      let pdfAngaben = document.getElementById("pdfAngaben");
      let ergebnis = document.getElementById("ergebnis");

      pdfAngaben.hidden = true;
      ergebnis.hidden = true;

    } else {
      btn.disabled = false;
      btn.classList.remove("btnAktivieren");
    }
}

// Hilfsfunktionen zur Umwandlung des Datums
function berechneJahreUndMonate(startDatum, endDatum) {
  const start = new Date(startDatum);
  const ende = new Date(endDatum);

  let jahre = ende.getFullYear() - start.getFullYear();
  let monate = ende.getMonth() - start.getMonth();
  let tage = ende.getDate() - start.getDate();

  if (tage < 0) {
    monate -= 1;
  }

  if (monate < 0) {
    jahre -= 1;
    monate += 12;
  }

  return { jahre, monate };
}

function formatiereJahreUndMonate(jahre, monate) {
  const teile = [];
  if (jahre > 0) teile.push(`${jahre} Jahr${jahre !== 1 ? 'e' : ''}`);
  if (monate > 0) teile.push(`${monate} Monat${monate !== 1 ? 'e' : ''}`);
  return teile.length > 0 ? teile.join(" und ") : "0 Monate";
}

// Hauptfunktion zur Berechnung
function berechneFehlzeiten() {
  const start = new Date(document.getElementById("start").value);
  const ende = new Date(document.getElementById("ende").value);
  const fehltage = parseInt(document.getElementById("fehltage").value, 10);
  const arbeitstageProJahr = 220;
  const tageGesamt = (ende - start) / (1000 * 60 * 60 * 24);
  const jahreGesamt = tageGesamt / 365;
  const arbeitstage = Math.round(jahreGesamt * arbeitstageProJahr);
  const erlaubt = Math.floor(arbeitstage * 0.1);
  const rest = erlaubt - fehltage;

  const { jahre, monate } = berechneJahreUndMonate(start, ende);
  const dauerFormatiert = formatiereJahreUndMonate(jahre, monate);

  let output = `
    <strong>Gesamtdauer:</strong> ${dauerFormatiert} (${jahreGesamt.toFixed(2)} Jahre)<br>
    <strong>Arbeitstage (geschätzt):</strong> ${arbeitstage}<br>
    <strong>Erlaubte Fehltage (10%):</strong> ${erlaubt}<br>
    <strong>Deine Fehltage:</strong> ${fehltage}<br>
    <strong>Fehltage verbleibend:</strong> ${rest >= 0 ? rest : 0}<br><br>
  `;

  output += rest < 0
    ? `<span style="color:red;">⚠️<br> Du hast die 10 %-Grenze überschritten.<br> Eine Einzelfallprüfung ist wahrscheinlich nötig.</span>`
    : `<span style="color:green;">✅ Du liegst unter 10 %. Keine Einzelfallprüfung notwendig.</span>`;

  document.getElementById("ergebnis").innerHTML = output;

  let pdfAngaben = document.getElementById("pdfAngaben");
  let ergebnis = document.getElementById("ergebnis");

  pdfAngaben.hidden = false;
  ergebnis.hidden = false;
}

// PDF-Export zur Speicherung
function exportAsPDF() {
  const form = document.getElementById('pdfAngaben');

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.getElementById("name").value;
  const traeger = document.getElementById("traeger").value;
  const beruf = document.getElementById("beruf").value;
  const kammer = document.getElementById("kammer").value;
  const inhalt = document.getElementById("ergebnis").innerHTML;
  const now = new Date().toLocaleDateString("de-DE");

  const container = document.getElementById("pdf-container");
  container.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 2cm; font-size: 12pt; background: white; width: 100%; box-sizing: border-box;">
      <h1 style="text-align:center; margin-top: 0;">📄 Fehlzeitenbericht</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Träger:</strong> ${traeger}</p>
      <p><strong>Beruf:</strong> ${beruf}</p>
      <p><strong>Kammer:</strong> ${kammer}</p>
      <p><strong>Erstellt am:</strong> ${now}</p>
      <hr>
      ${inhalt}
      <hr>
      <p style="font-size:10pt; color:#666;">
        Hinweis: 
        <br> Die hier dargestellten Berechnungen basieren auf öffentlich zugänglichen Richtwerten.
        <br> Sie sind nicht rechtsverbindlich. 
        <br> Sie ersetzt keine rechtlich verbindliche Auskunft durch die Kammer.
      </p>
    </div>
  `;

  const element = container.firstElementChild;

  const opt = {
    margin: 10,
    filename: `fehlzeitenbericht_${name}_${now.replace(/\./g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      letterRendering: true,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    }
  };

  html2pdf().set(opt).from(element).save();
}

function showTooltip(e) {
  document.getElementById('readmeTooltip').style.display = 'block';
}
function hideTooltip() {
  document.getElementById('readmeTooltip').style.display = 'none';
}

function resetEingaben() {
  document.getElementById('start').value = '';
  document.getElementById('ende').value = '';
  document.getElementById('fehltage').value = '';
  // Hinweise und Styles zurücksetzen
  document.getElementById('startHinweis').style.display = 'none';
  document.getElementById('endeHinweis').style.display = 'none';
  document.getElementById('start').style.border = '';
  document.getElementById('ende').style.border = '';
  berechenenBtn();
}
