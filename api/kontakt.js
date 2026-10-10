/**
 * Kontaktformular webgipfel — Versand ueber Resend
 * ------------------------------------------------
 * Gegenstueck zu FORM_ENDPOINT in assets/site.js.
 * Erwartet genau die Daten, die das Formular auf kontakt.html sendet:
 *   name, email, unternehmen, nachricht, datenschutz, thema (Array)
 *
 * Bewusst ohne npm-Paket: ruft die Resend-REST-API direkt per fetch auf.
 * Dadurch braucht das Projekt kein package.json, keine Abhaengigkeiten und
 * keinen Build-Schritt. Node 18+ auf Vercel bringt fetch bereits mit.
 *
 * Umgebungsvariablen (in Vercel setzen, NIE im Repository):
 *   RESEND_API_KEY   Schluessel aus Resend, beginnt mit re_
 *   CONTACT_FROM     Absender. Ohne verifizierte Domain: onboarding@resend.dev
 *   CONTACT_TO       Empfaenger. Ohne verifizierte Domain MUSS das die
 *                    E-Mail-Adresse des Resend-Kontoinhabers sein.
 */

const MAX = { name: 120, email: 160, unternehmen: 160, nachricht: 5000, thema: 200 };

const text = (v, grenze) => (typeof v === "string" ? v.trim().slice(0, grenze) : "");
const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, fehler: "Methode nicht erlaubt." });
  }

  let daten = req.body;
  if (typeof daten === "string") {
    try { daten = JSON.parse(daten); } catch { daten = {}; }
  }
  if (!daten || typeof daten !== "object") daten = {};

  // Honigtopf. Das Formular hat derzeit kein solches Feld — die Pruefung steht
  // hier trotzdem, damit sie greift, sobald eines ergaenzt wird.
  if (text(daten.webseite, 200) !== "") {
    return res.status(200).json({ ok: true });
  }

  const name = text(daten.name, MAX.name);
  const email = text(daten.email, MAX.email);
  const unternehmen = text(daten.unternehmen, MAX.unternehmen);
  const nachricht = text(daten.nachricht, MAX.nachricht);

  // thema kommt als Array; einzelne Werte und Fehlen ebenfalls abfangen.
  const thema = (Array.isArray(daten.thema) ? daten.thema : [daten.thema])
    .filter((t) => typeof t === "string" && t.trim())
    .map((t) => t.trim().slice(0, 60))
    .slice(0, 10);

  // Die Einwilligung wird clientseitig geprueft — serverseitig noch einmal,
  // weil Clientpruefungen umgangen werden koennen.
  const einwilligung = daten.datenschutz === true ||
    daten.datenschutz === "on" || daten.datenschutz === "true";

  const felder = {};
  if (!name) felder.name = "Bitte geben Sie Ihren Namen an.";
  if (!mailOk(email)) felder.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (!nachricht) felder.nachricht = "Bitte schreiben Sie uns kurz, worum es geht.";
  if (!einwilligung) felder.datenschutz = "Bitte bestätigen Sie die Datenschutzerklärung.";
  if (Object.keys(felder).length) {
    return res.status(400).json({ ok: false, felder });
  }

  const KEY = process.env.RESEND_API_KEY;
  const FROM = process.env.CONTACT_FROM;
  const TO = process.env.CONTACT_TO;

  if (!KEY || !FROM || !TO) {
    // Nie verraten, WELCHE Variable fehlt — das waere eine Auskunft ueber die
    // Serverkonfiguration. Im Vercel-Log steht es, fuer den Besucher nicht.
    console.error("Konfiguration unvollstaendig:", {
      RESEND_API_KEY: !!KEY, CONTACT_FROM: !!FROM, CONTACT_TO: !!TO,
    });
    return res.status(500).json({ ok: false, fehler: "Versand derzeit nicht möglich." });
  }

  const themaText = thema.length ? thema.join(", ") : "—";

  const klartext = [
    "Neue Projektanfrage über webgipfel.",
    "",
    "Name:         " + name,
    "E-Mail:       " + email,
    "Unternehmen:  " + (unternehmen || "—"),
    "Thema:        " + themaText,
    "",
    "Nachricht:",
    nachricht,
    "",
    "— Datenschutzerklärung wurde bestätigt.",
  ].join("\n");

  const zeile = (k, v) =>
    '<tr><td style="padding:3px 18px 3px 0;color:#6b7a8d;vertical-align:top">' + k +
    '</td><td style="padding:3px 0">' + v + "</td></tr>";

  const html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#0e1a2b">' +
    '<p style="margin:0 0 18px;font-size:17px"><strong>Neue Projektanfrage über webgipfel</strong></p>' +
    '<table style="border-collapse:collapse"><tbody>' +
    zeile("Name", escapeHtml(name)) +
    zeile("E-Mail", '<a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + "</a>") +
    zeile("Unternehmen", escapeHtml(unternehmen || "—")) +
    zeile("Thema", escapeHtml(themaText)) +
    "</tbody></table>" +
    '<p style="margin:20px 0 6px;color:#6b7a8d">Nachricht</p>' +
    '<p style="margin:0;white-space:pre-wrap">' + escapeHtml(nachricht) + "</p>" +
    '<p style="margin:24px 0 0;font-size:13px;color:#6b7a8d">' +
    "Die Datenschutzerklärung wurde beim Absenden bestätigt.</p>" +
    "</div>";

  try {
    const antwort = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // Damit „Antworten" direkt beim Anfragenden landet, nicht bei Resend.
        reply_to: email,
        subject: "webgipfel — Anfrage von " + name + (unternehmen ? " (" + unternehmen + ")" : ""),
        text: klartext,
        html,
      }),
    });

    if (!antwort.ok) {
      const detail = await antwort.text();
      console.error("Resend hat abgelehnt:", antwort.status, detail);
      return res.status(502).json({ ok: false, fehler: "Versand fehlgeschlagen." });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Versand fehlgeschlagen:", e && e.message);
    return res.status(502).json({ ok: false, fehler: "Versand fehlgeschlagen." });
  }
};
