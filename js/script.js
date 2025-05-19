  function berechneFehlzeiten() {
      const startDatum = new Date(document.getElementById("start").value);
      const endDatum = new Date(document.getElementById("ende").value);
      const aktuelleFehltage = parseInt(document.getElementById("fehltage").value);

      const arbeitstageProJahr = 220;
      const tageGesamt = (endDatum - startDatum) / (1000 * 60 * 60 * 24);
      const jahreGesamt = tageGesamt / 365;

      const arbeitstageGesamt = Math.round(jahreGesamt * arbeitstageProJahr);
      const erlaubteFehltage = Math.floor(arbeitstageGesamt * 0.10);
      const verbleibend = erlaubteFehltage - aktuelleFehltage;

      let ausgabe = `
        <strong>Gesamtdauer:</strong> ${jahreGesamt.toFixed(3)} Jahre<br>
        <strong>Arbeitstage (geschätzt):</strong> ${arbeitstageGesamt}<br>
        <strong>Erlaubte Fehltage (10 %):</strong> ${erlaubteFehltage}<br>
        <strong>Deine Fehltage:</strong> ${aktuelleFehltage}<br>
        <strong>Fehltage verbleibend:</strong> ${verbleibend >= 0 ? verbleibend : 0}
        <br><br>
      `;

      if (verbleibend < 0) {
        ausgabe += `<span style="color: red;">⚠️ Du hast die 10 %-Grenze überschritten. Eine Einzelfallprüfung ist wahrscheinlich nötig.</span>`;
      } else {
        ausgabe += `<span style="color: green;">✅ Du liegst unter 10 %. Keine Einzelfallprüfung notwendig.</span>`;
      }

      document.getElementById("ergebnis").innerHTML = ausgabe;
    }
