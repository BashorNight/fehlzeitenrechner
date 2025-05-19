function calculate() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const absentDays = parseInt(document.getElementById("absentDays").value) || 0;

  if (isNaN(startDate) || isNaN(endDate)) {
    document.getElementById("result").innerText = "Bitte gültige Daten eingeben.";
    return;
  }

  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const workdays = Math.floor((totalDays / 365) * 220); // Durchschnittlich 220 Arbeitstage pro Jahr

  const maxAllowed = Math.floor(workdays * 0.1);
  const remaining = maxAllowed - absentDays;

  let message = `Erlaubte Fehltage: ${maxAllowed}\n`;
  message += `Bisherige Fehltage: ${absentDays}\n`;

  if (remaining >= 0) {
    message += `Du darfst noch ${remaining} Tage fehlen.`;
  } else {
    message += `Du hast ${-remaining} Tage zu viel gefehlt – es wird eine Einzelfallprüfung nötig sein.`;
  }

  document.getElementById("result").innerText = message;
}
