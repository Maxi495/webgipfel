/* Isarwave Journal – Beiträge (DE/EN)
   Neuer Beitrag: Objekt oben in ARTICLES einfügen. Der neueste Beitrag mit
   featured: true erscheint groß auf der Übersicht. body ist HTML; jeder
   Block auf oberster Ebene wird beim Scrollen einzeln eingeblendet. */
window.IW_JOURNAL = (() => {
  // Fotos liegen lokal in assets/img (480/1200/2000 px, WebP); Teamfotos als Hochformat-Zuschnitt
  const img = (id, w = 1200) => `assets/img/${id}-${w <= 480 ? 480 : w <= 1200 ? 1200 : 2000}.webp`;
  const srcset = id => [480, 1200, 2000].map(w => `assets/img/${id}-${w}.webp ${w}w`).join(', ');
  const face = id => `assets/img/${id}-t320.webp`;

  const AUTHORS = {
    lena: { name: 'Dr. Lena Hofstätter', role: { de: 'Mitgründerin & CEO', en: 'Co-founder & CEO' }, img: '1534528741775-53994a69daeb' },
    felix: { name: 'Felix Auer', role: { de: 'Head of Hardware', en: 'Head of Hardware' }, img: '1507003211169-0a1dd7228f2d' },
    sophie: { name: 'Dr. Sophie Lindner', role: { de: 'Head of Machine Learning', en: 'Head of Machine Learning' }, img: '1438761681033-6461ffad8d80' },
    tobias: { name: 'Tobias Reiter', role: { de: 'Regulatory Affairs Lead', en: 'Regulatory Affairs Lead' }, img: '1560250097-0b93528c311a' },
    elif: { name: 'Elif Demir', role: { de: 'Clinical Research', en: 'Clinical Research' }, img: '1573496359142-b8d87734a5a2' },
  };

  const CATS = {
    essay: { de: 'Essay', en: 'Essay' },
    research: { de: 'Forschung', en: 'Research' },
    tech: { de: 'Technologie', en: 'Technology' },
    insight: { de: 'Einblicke', en: 'Inside Isarwave' },
    regulatory: { de: 'Regulatorik', en: 'Regulatory' },
    press: { de: 'Pressemitteilung', en: 'Press release' },
  };

  const ARTICLES = [
    {
      slug: 'eeg-aus-der-klinik',
      featured: true,
      cat: 'essay', date: '2026-09-30', author: 'lena', minutes: 6,
      image: '1715866404130-67627c9828e1',
      alt: { de: 'Ein Mann trägt zu Hause ein EEG-Stirnband und hält ein Tablet', en: 'A man wearing an EEG headband at home, holding a tablet' },
      title: { de: 'Warum wir das EEG aus der Klinik holen', en: 'Why we are taking EEG out of the clinic' },
      lead: {
        de: 'Ein Anfall hält sich nicht an Besuchszeiten. Über eine Methode, die seit hundert Jahren funktioniert, und die Frage, warum sie trotzdem so oft zu spät kommt.',
        en: 'A seizure does not keep to visiting hours. About a method that has worked for a hundred years, and why it still so often arrives too late.',
      },
      body: {
        de: `
<p>Als Hans Berger 1924 in Jena die ersten Hirnströme eines Menschen aufzeichnete, brauchte er dafür Silberdrähte unter der Kopfhaut und ein Galvanometer, das ein ganzes Zimmer füllte. Hundert Jahre später ist das EEG eine der wichtigsten Untersuchungen der Neurologie. Und doch hat sich an einer Sache erstaunlich wenig geändert: Gemessen wird meist dort, wo die Patientin gerade nicht lebt.</p>
<h2>Das Problem ist nicht die Messung, sondern der Moment</h2>
<p>Ein Routine-EEG dauert zwanzig bis dreißig Minuten. Viele Auffälligkeiten zeigen sich in dieser Zeit schlicht nicht. Sie treten nachts auf, nach einer durchwachten Woche oder nur alle paar Tage. Wer sie erfassen will, braucht Tage statt Minuten, und das bedeutet heute in der Regel einen stationären Aufenthalt mit geklebten Elektroden und Kabeln.</p>
<p>Das ist teuer, die Plätze sind knapp, und es verändert genau das, was man eigentlich beobachten will: den Alltag eines Menschen.</p>
<blockquote>Wir wollten nicht das EEG neu erfinden. Wir wollten es dorthin bringen, wo die Fragen entstehen.</blockquote>
<h2>Was ein Band ändern kann und was nicht</h2>
<p>Das Isarwave Band misst mit acht Kanälen. Ein klinisches EEG hat neunzehn oder mehr. Das ist kein Detail, das wir verstecken wollen, sondern eine bewusste Abwägung: Acht gut sitzende Trockenelektroden, die drei Tage lang tragbar sind, liefern für viele Fragestellungen mehr Information als neunzehn Elektroden für eine halbe Stunde.</p>
<p>Ob diese Abwägung trägt, entscheiden nicht wir, sondern die Daten. Genau dafür läuft seit März unsere Pilotstudie ISAR-01, in der das Band parallel zum klinischen Video-EEG aufzeichnet.</p>
<h2>Der Mensch bleibt am Ende der Kette</h2>
<p>Je länger eine Aufzeichnung, desto mehr Zeit kostet ihre Auswertung. Deshalb gehört zu jedem Band auch Isarwave Cortex, eine Software, die Stunden von Daten vorsortiert. Vorsortiert heißt nicht entschieden: Die Befundung bleibt bei der Ärztin oder dem Arzt. Unsere Aufgabe ist es, ihnen die Stunde 51 zu ersparen, in der nichts passiert, damit mehr Zeit für die zwölf Sekunden bleibt, in denen etwas passiert.</p>
<p>Wir sind ein kleines Team in Garching, und wir sind am Anfang. Aber wir glauben, dass ein gutes Langzeit-EEG kein Krankenhausbett braucht.</p>`,
        en: `
<p>When Hans Berger recorded the first human brain waves in Jena in 1924, he needed silver wires under the scalp and a galvanometer that filled an entire room. A hundred years later, EEG is one of the most important tests in neurology. And yet one thing has changed surprisingly little: recordings usually take place where the patient does not actually live.</p>
<h2>The problem is not the measurement, but the moment</h2>
<p>A routine EEG takes twenty to thirty minutes. Many abnormalities simply do not appear in that window. They occur at night, after a week of poor sleep or only every few days. Capturing them takes days rather than minutes, and today that usually means a hospital stay with glued electrodes and cables.</p>
<p>That is expensive, beds are scarce, and it changes exactly what you want to observe: a person’s everyday life.</p>
<blockquote>We did not set out to reinvent EEG. We wanted to bring it to where the questions arise.</blockquote>
<h2>What a headband can and cannot change</h2>
<p>The Isarwave Band records eight channels. A clinical EEG has nineteen or more. That is not a detail we want to hide but a deliberate trade-off: eight well-fitting dry electrodes that can be worn for three days provide more information for many clinical questions than nineteen electrodes for half an hour.</p>
<p>Whether that trade-off holds is not for us to decide but for the data. That is exactly why our pilot study ISAR-01 has been running since March, with the band recording alongside clinical video EEG.</p>
<h2>People stay at the end of the chain</h2>
<p>The longer a recording, the more time its review takes. That is why every band comes with Isarwave Cortex, software that pre-sorts hours of data. Pre-sorted does not mean decided: the diagnosis stays with the clinician. Our job is to spare them hour 51, in which nothing happens, so there is more time for the twelve seconds in which something does.</p>
<p>We are a small team in Garching, and we are at the beginning. But we believe a good long-term EEG should not need a hospital bed.</p>`,
      },
    },
    {
      slug: 'tragestudie-vorbereitung',
      cat: 'insight', date: '2026-08-21', author: 'elif', minutes: 4,
      image: '1715866443053-be9b28f1cef6',
      alt: { de: 'Eine Frau mit EEG-Stirnband und Messgerät am Oberteil schaut auf ein Tablet', en: 'A woman with an EEG headband and recorder clipped to her top looks at a tablet' },
      title: { de: 'Sieben Tage mit dem Band: Wie wir die Tragestudie vorbereiten', en: 'Seven days with the band: how we are preparing the wear study' },
      lead: {
        de: 'Bevor Patient:innen das Band eine Woche lang tragen, haben wir es selbst getragen. Notizen aus der Vorbereitung von ISAR-02.',
        en: 'Before patients wear the band for a week, we wore it ourselves. Notes from preparing ISAR-02.',
      },
      body: {
        de: `
<p>Eine Studie über den Alltag lässt sich nicht am Schreibtisch planen. Deshalb haben im Juli sechs Kolleg:innen aus unserem Team das Band jeweils sieben Tage am Stück getragen: im Büro, beim Radfahren, beim Kochen und vor allem in der Nacht.</p>
<h2>Was wir gelernt haben</h2>
<p>Die wichtigste Erkenntnis war unspektakulär: Das Laden muss zur Routine passen. Wer das Band morgens nach dem Duschen ablegt, braucht eine Erinnerung zu genau dieser Zeit, nicht um 21 Uhr. Die Companion App fragt deshalb am ersten Tag, wann das Laden am besten passt.</p>
<p>Die zweite Erkenntnis betraf das Tagebuch. Ereignisse wurden am zuverlässigsten erfasst, wenn das Eintragen weniger als fünf Sekunden dauerte. Freitextfelder blieben fast immer leer. Für ISAR-02 gibt es deshalb vordefinierte Ereignisse und eine Sprachnotiz.</p>
<blockquote>Die beste Studie ist die, bei der niemand an die Studie denken muss.</blockquote>
<h2>Wie es weitergeht</h2>
<p>Das Studienprotokoll liegt derzeit bei der Ethikkommission. Geplant ist, 25 Erwachsene mit bekannter Epilepsie für sieben Tage einzuschließen. Wir wollen wissen, wie lange das Band tatsächlich getragen wird und wie stabil die Signalqualität außerhalb der Klinik bleibt.</p>
<p>Wenn Sie in einer neurologischen Praxis arbeiten und sich vorstellen können, Patient:innen für die Studie anzusprechen, freuen wir uns über eine Nachricht.</p>`,
        en: `
<p>A study about everyday life cannot be planned at a desk. So in July, six colleagues from our team each wore the band for seven days straight: at the office, cycling, cooking and, above all, at night.</p>
<h2>What we learned</h2>
<p>The most important insight was unspectacular: charging has to fit into people’s routines. If you take the band off after your morning shower, you need a reminder at exactly that time, not at 9 p.m. So on day one, the Companion App now asks when charging suits you best.</p>
<p>The second insight concerned the diary. Events were logged most reliably when entering them took less than five seconds. Free-text fields almost always stayed empty. For ISAR-02 we therefore use predefined events and a voice note.</p>
<blockquote>The best study is one where nobody has to think about the study.</blockquote>
<h2>What comes next</h2>
<p>The study protocol is currently with the ethics committee. We plan to enrol 25 adults with known epilepsy for seven days. We want to know how long the band is actually worn and how stable signal quality remains outside the clinic.</p>
<p>If you work in a neurology practice and could imagine approaching patients about the study, we would be glad to hear from you.</p>`,
      },
    },
    {
      slug: 'trockenelektroden',
      cat: 'tech', date: '2026-07-08', author: 'felix', minutes: 5,
      image: '1715866549135-e3bc3c6148a9',
      alt: { de: 'Eine Fachkraft legt einer Frau ein EEG-Stirnband an', en: 'A clinician fits an EEG headband on a woman' },
      title: { de: 'Was wir aus 37 Elektroden-Prototypen gelernt haben', en: 'What we learned from 37 electrode prototypes' },
      lead: {
        de: 'Gel macht ein EEG gut und unbequem. Über den langen Weg zu einer Trockenelektrode, die durch Haare kommt und trotzdem nicht drückt.',
        en: 'Gel makes EEG good and uncomfortable. About the long road to a dry electrode that gets through hair without pressing.',
      },
      body: {
        de: `
<p>Klassische EEG-Elektroden funktionieren dank Gel. Es überbrückt Haare und Hautschuppen und sorgt für einen niedrigen Übergangswiderstand. Nach einem Tag ist es allerdings eingetrocknet, nach drei Tagen klebt es im Haar. Für ein Band, das man im Alltag trägt, kam Gel deshalb nie infrage.</p>
<h2>Stifte statt Flächen</h2>
<p>Unsere ersten Prototypen waren flache Elektroden mit leitfähigem Silikon. Auf der Stirn funktionierten sie gut, an den Schläfen und am Hinterkopf kaum: Dort sind Haare. Der Durchbruch kam mit federnden Stiften, die sich einzeln durch das Haar schieben. Heute besteht jede Elektrode aus zwölf flexiblen Polymerstiften mit einer Beschichtung aus Silber und Silberchlorid.</p>
<p>Klingt einfach, war es nicht. Zu harte Stifte drücken nach einer Stunde, zu weiche knicken um. Prototyp 22 war elektrisch hervorragend und nach vier Stunden unerträglich. Prototyp 31 war bequem, verlor aber nachts bei Seitenlage den Kontakt.</p>
<blockquote>Eine Elektrode, die man nach zwei Stunden absetzt, misst exakt null Stunden.</blockquote>
<h2>Kontakt, den man sehen kann</h2>
<p>Weil Trockenelektroden empfindlicher auf Bewegung reagieren, misst das Band die Übergangsimpedanz ununterbrochen mit. Verliert ein Kanal den Kontakt, vibriert das Band kurz, und die Companion App zeigt an, welche Stelle nachgedrückt werden sollte. In unseren Tests war das in den meisten Fällen nach wenigen Sekunden behoben.</p>
<p>Prototyp 37 ist der, den wir heute in der Pilotstudie einsetzen. Er ist nicht der letzte.</p>`,
        en: `
<p>Classic EEG electrodes work thanks to gel. It bridges hair and skin flakes and keeps contact impedance low. After a day, however, it has dried out, and after three days it is stuck in the hair. For a band worn in everyday life, gel was never an option.</p>
<h2>Pins instead of pads</h2>
<p>Our first prototypes were flat electrodes made of conductive silicone. They worked well on the forehead and barely at the temples and the back of the head, where there is hair. The breakthrough came with spring-loaded pins that each push through the hair individually. Today, every electrode consists of twelve flexible polymer pins with a silver/silver chloride coating.</p>
<p>It sounds simple. It was not. Pins that are too stiff start to press after an hour, pins that are too soft bend over. Prototype 22 was electrically excellent and unbearable after four hours. Prototype 31 was comfortable but lost contact at night when people slept on their side.</p>
<blockquote>An electrode that people take off after two hours records exactly zero hours.</blockquote>
<h2>Contact you can see</h2>
<p>Because dry electrodes are more sensitive to movement, the band continuously measures contact impedance. If a channel loses contact, the band vibrates briefly and the Companion App shows which spot needs a gentle press. In our tests, this was usually resolved within a few seconds.</p>
<p>Prototype 37 is the one we use in the pilot study today. It will not be the last.</p>`,
      },
    },
    {
      slug: 'ki-die-nicht-weiterlernt',
      cat: 'research', date: '2026-05-19', author: 'sophie', minutes: 5,
      image: '1647356191320-d7a1f80ca777',
      alt: { de: 'Abstraktes violett-blaues Fasergeflecht auf schwarzem Hintergrund', en: 'Abstract violet and blue mesh of fibres on a black background' },
      title: { de: 'Eine KI, die nicht weiterlernt. Mit Absicht.', en: 'An AI that does not keep learning. On purpose.' },
      lead: {
        de: 'Warum Isarwave Cortex im Einsatz eingefroren ist, wie wir neue Versionen prüfen und warum Nachvollziehbarkeit wichtiger ist als der letzte Prozentpunkt.',
        en: 'Why Isarwave Cortex is frozen in use, how we test new versions, and why traceability matters more than the last percentage point.',
      },
      body: {
        de: `
<p>„Lernt eure KI aus jeder Befundung dazu?“ Diese Frage hören wir oft, meist mit einem hoffnungsvollen Unterton. Die Antwort lautet: nein. Und das ist eine der wichtigsten Entscheidungen, die wir bei Cortex getroffen haben.</p>
<h2>Warum ein eingefrorenes Modell</h2>
<p>Ein Modell, das sich im Betrieb laufend verändert, verhält sich am Dienstag anders als am Montag. Für eine Software, die Ärzt:innen bei der Befundung unterstützt, ist das kein Feature, sondern ein Risiko. Niemand könnte im Nachhinein sagen, warum eine bestimmte Markierung gesetzt wurde.</p>
<p>Cortex arbeitet deshalb mit festen Versionen. Rückmeldungen aus der Befundung sammeln wir, aber sie fließen nur über eine neue Version ein, die vor der Freigabe vollständig geprüft wird.</p>
<blockquote>Wir optimieren nicht auf die beeindruckendste Zahl, sondern auf die Frage: Kann eine Ärztin jede Markierung nachvollziehen?</blockquote>
<h2>Wie wir prüfen</h2>
<p>Jede neue Version wird an Aufzeichnungen getestet, die beim Training nicht verwendet wurden und aus einer anderen Klinik stammen als die Trainingsdaten. Zwei Fachärzt:innen befunden diese Aufzeichnungen unabhängig voneinander, ohne die Markierungen von Cortex zu kennen. Erst danach vergleichen wir.</p>
<h2>Erklären statt behaupten</h2>
<p>Jede Markierung zeigt, welche Kanäle und Frequenzbänder sie ausgelöst haben. Das ist technisch aufwendiger als eine einfache Wahrscheinlichkeit, aber es verändert, wie mit Cortex gearbeitet wird: Wer sieht, warum etwas markiert wurde, kann schneller entscheiden, ob es relevant ist.</p>
<p>Wie gut Cortex dabei tatsächlich ist, werden wir nach Abschluss der Pilotstudie berichten, begutachtet und mit allen Zahlen, auch den unbequemen.</p>`,
        en: `
<p>“Does your AI learn from every review?” We hear this question often, usually with a hopeful undertone. The answer is no. And it is one of the most important decisions we have made with Cortex.</p>
<h2>Why a frozen model</h2>
<p>A model that keeps changing in operation behaves differently on Tuesday than on Monday. For software that supports clinicians in their reviews, that is not a feature but a risk. Nobody could say afterwards why a particular marker was set.</p>
<p>Cortex therefore works with fixed versions. We collect feedback from reviews, but it only enters through a new version that is fully tested before release.</p>
<blockquote>We do not optimise for the most impressive number, but for one question: can a clinician understand every single marker?</blockquote>
<h2>How we test</h2>
<p>Every new version is tested on recordings that were not used in training and that come from a different hospital than the training data. Two neurologists review these recordings independently, without seeing the Cortex markers. Only then do we compare.</p>
<h2>Explaining instead of claiming</h2>
<p>Every marker shows which channels and frequency bands triggered it. That is technically more demanding than a simple probability, but it changes how people work with Cortex: if you can see why something was flagged, you can decide faster whether it matters.</p>
<p>How well Cortex actually performs, we will report after the pilot study is complete: peer-reviewed and with all the numbers, including the uncomfortable ones.</p>`,
      },
    },
    {
      slug: 'isar-01-start',
      cat: 'press', date: '2026-03-24', author: 'elif', minutes: 3,
      image: '1715866734224-0b9eb2ac5fd6',
      alt: { de: 'Eine Studienmitarbeiterin bereitet neben einer Patientin eine EEG-Ableitung am Laptop vor', en: 'A study nurse prepares an EEG recording on a laptop next to a patient' },
      title: { de: 'ISAR-01: Die ersten Patientinnen und Patienten sind eingeschlossen', en: 'ISAR-01: The first patients have been enrolled' },
      lead: {
        de: 'Garching, 24. März 2026. Isarwave Neurotechnologies hat mit der klinischen Pilotstudie ISAR-01 begonnen. Die Studie vergleicht das Isarwave Band mit dem klinischen Video-EEG.',
        en: 'Garching, 24 March 2026. Isarwave Neurotechnologies has started the clinical pilot study ISAR-01, which compares the Isarwave Band with clinical video EEG.',
      },
      body: {
        de: `
<p>In zwei neurologischen Kliniken im Raum München tragen Patient:innen, die zur Abklärung einer Epilepsie stationär aufgenommen werden, das Isarwave Band zusätzlich zum klinischen Video-EEG. Beide Systeme zeichnen 24 Stunden lang gleichzeitig auf. Anschließend werden die Aufzeichnungen verblindet befundet und miteinander verglichen.</p>
<h2>Was die Studie untersucht</h2>
<p>Im Mittelpunkt stehen zwei Fragen: Wie gut stimmen die Signale des Bands mit denen eines klinischen EEGs mit Klebeelektroden überein? Und erkennt die Auswertungssoftware Isarwave Cortex dieselben auffälligen Abschnitte wie die befundenden Neurolog:innen? Geplant ist der Einschluss von 40 Erwachsenen bis Anfang 2027.</p>
<blockquote>Wir wollen wissen, was das Band kann, bevor wir sagen, was es kann.</blockquote>
<p>„Die Pilotstudie ist für uns der wichtigste Schritt seit der Gründung“, sagt Dr. Lena Hofstätter, Mitgründerin und Geschäftsführerin von Isarwave. „Die Ergebnisse veröffentlichen wir nach Abschluss in einer begutachteten Fachzeitschrift, unabhängig davon, wie sie ausfallen.“</p>
<h2>Über Isarwave</h2>
<p>Isarwave Neurotechnologies wurde 2024 in Garching bei München gegründet und entwickelt ein kabelloses EEG-Band mit Trockenelektroden sowie eine KI-gestützte Auswertungssoftware für Langzeit-EEGs. Isarwave Band und Isarwave Cortex befinden sich in der Entwicklung und sind derzeit nicht als Medizinprodukte zugelassen.</p>
<p>Pressekontakt: presse@isarwave.de</p>`,
        en: `
<p>At two neurology departments in the Munich area, patients admitted to hospital for the evaluation of suspected epilepsy wear the Isarwave Band in addition to clinical video EEG. Both systems record simultaneously for 24 hours. The recordings are then reviewed blind and compared.</p>
<h2>What the study examines</h2>
<p>The study focuses on two questions: how closely do the band’s signals agree with those of a clinical EEG using adhesive electrodes? And does the analysis software Isarwave Cortex identify the same notable segments as the reviewing neurologists? The plan is to enrol 40 adults by early 2027.</p>
<blockquote>We want to know what the band can do before we say what it can do.</blockquote>
<p>“The pilot study is the most important step for us since we were founded,” says Dr. Lena Hofstätter, co-founder and CEO of Isarwave. “We will publish the results in a peer-reviewed journal once the study is complete, regardless of how they turn out.”</p>
<h2>About Isarwave</h2>
<p>Isarwave Neurotechnologies was founded in 2024 in Garching near Munich and develops a wireless EEG headband with dry electrodes and AI-assisted analysis software for long-term EEG. Isarwave Band and Isarwave Cortex are under development and are not currently approved as medical devices.</p>
<p>Press contact: presse@isarwave.de</p>`,
      },
    },
    {
      slug: 'mdr-fuer-start-ups',
      cat: 'regulatory', date: '2026-02-11', author: 'tobias', minutes: 6,
      image: '1581093577421-f561a654a353',
      alt: { de: 'Eine Ingenieurin arbeitet in einem hellen Labor an einem Prüfaufbau', en: 'An engineer works on a test set-up in a bright laboratory' },
      title: { de: 'Was die MDR für ein Medtech-Start-up wirklich bedeutet', en: 'What the MDR really means for a medtech start-up' },
      lead: {
        de: 'Die europäische Medizinprodukteverordnung gilt als Bremse für junge Unternehmen. Wir sehen das differenzierter. Ein Werkstattbericht aus dem Regulatory-Team.',
        en: 'The European Medical Device Regulation is often seen as a brake on young companies. We see it in more nuanced terms. A report from our regulatory team.',
      },
      body: {
        de: `
<p>Seit Mai 2021 gilt in der EU die Medizinprodukteverordnung, kurz MDR. Für Start-ups ist sie vor allem eines: viel Papier. Technische Dokumentation, klinische Bewertung, Risikomanagement, Qualitätsmanagementsystem. Wer ein Medizinprodukt auf den Markt bringen will, braucht all das, bevor das erste Gerät verkauft ist.</p>
<h2>Früh anfangen ist billiger</h2>
<p>Unser wichtigster Rat an andere Gründer:innen: Regulatorik ist kein Projekt für das Jahr vor der Markteinführung. Wir haben unser Qualitätsmanagement von Anfang an an ISO 13485 ausgerichtet und die Softwareentwicklung an IEC 62304. Das hat uns am Anfang Zeit gekostet und spart uns jetzt Monate.</p>
<p>Jede Designentscheidung am Band wird dokumentiert, jede Änderung an Cortex nachvollziehbar versioniert. Was nach Bürokratie klingt, ist im Alltag einfach gute Ingenieursarbeit mit Protokoll.</p>
<blockquote>Die MDR fragt im Grunde nur: Könnt ihr beweisen, was ihr behauptet? Das sollte jedes Medtech-Unternehmen wollen.</blockquote>
<h2>Software ist auch ein Medizinprodukt</h2>
<p>Besonders für Cortex ist die MDR relevant. Software, die Ärzt:innen bei diagnostischen Entscheidungen unterstützt, ist selbst ein Medizinprodukt und wird entsprechend eingestuft. Das bedeutet unter anderem: Eine benannte Stelle prüft, bevor die Software auf den Markt kommt. Auch deshalb ist Cortex im Einsatz eingefroren und wird nur in geprüften Versionen aktualisiert.</p>
<h2>Wo wir stehen</h2>
<p>Das CE-Konformitätsbewertungsverfahren ist unser nächster großer Schritt. Die Daten aus der Pilotstudie ISAR-01 sind dafür ein wichtiger Baustein der klinischen Bewertung. Bis dahin gilt: Isarwave Band und Isarwave Cortex sind nicht als Medizinprodukte zugelassen, und wir sagen das auch so.</p>`,
        en: `
<p>The EU Medical Device Regulation, or MDR, has applied since May 2021. For start-ups it mainly means one thing: a lot of paper. Technical documentation, clinical evaluation, risk management, a quality management system. Anyone who wants to bring a medical device to market needs all of this before the first device is sold.</p>
<h2>Starting early is cheaper</h2>
<p>Our most important advice to other founders: regulation is not a project for the year before launch. We aligned our quality management with ISO 13485 and our software development with IEC 62304 from the very beginning. That cost us time at first and is saving us months now.</p>
<p>Every design decision on the band is documented, every change to Cortex is versioned and traceable. What sounds like bureaucracy is, day to day, simply good engineering with a record.</p>
<blockquote>At its core, the MDR only asks: can you prove what you claim? Every medtech company should want that.</blockquote>
<h2>Software is a medical device too</h2>
<p>The MDR is particularly relevant for Cortex. Software that supports clinicians in diagnostic decisions is itself a medical device and is classified accordingly. Among other things, this means a notified body reviews it before it can go to market. That is another reason why Cortex is frozen in use and only updated in tested versions.</p>
<h2>Where we stand</h2>
<p>The CE conformity assessment is our next big step. Data from the ISAR-01 pilot study is an important part of the clinical evaluation. Until then: Isarwave Band and Isarwave Cortex are not approved as medical devices, and we say so plainly.</p>`,
      },
    },
    {
      slug: 'seed-finanzierung',
      cat: 'press', date: '2025-11-04', author: 'lena', minutes: 3,
      image: '1577462281852-279bf4986f7b',
      alt: { de: 'Luftbild einer Stadt bei Nacht mit beleuchteten Straßen', en: 'Aerial view of a city at night with illuminated streets' },
      title: { de: 'Isarwave schließt Seed-Finanzierung über 3,4 Millionen Euro ab', en: 'Isarwave closes €3.4 million seed round' },
      lead: {
        de: 'Garching, 4. November 2025. Mit der Finanzierungsrunde bereitet Isarwave die klinische Pilotphase vor und erweitert das Team in Signalverarbeitung und Regulatory Affairs.',
        en: 'Garching, 4 November 2025. With the funding round, Isarwave is preparing its clinical pilot phase and expanding the team in signal processing and regulatory affairs.',
      },
      body: {
        de: `
<p>Isarwave Neurotechnologies hat eine Seed-Finanzierung über 3,4 Millionen Euro abgeschlossen. Die Runde wird von Isarhang Ventures angeführt, beteiligt sind außerdem der Mangfall Health Fund sowie mehrere Business Angels aus Medizintechnik und Neurologie, darunter Dr. Katrin Wolf und Prof. Dr. Henrik Brandl.</p>
<h2>Wofür das Geld eingesetzt wird</h2>
<p>Mit den Mitteln finanziert Isarwave die klinische Pilotstudie ISAR-01, die im Frühjahr 2026 in zwei neurologischen Kliniken im Raum München beginnen soll. Außerdem wächst das Team von neun auf vierzehn Personen, vor allem in Signalverarbeitung, Machine Learning und Regulatory Affairs.</p>
<blockquote>Klinische Entwicklung braucht Geduld. Wir sind froh, Partner gefunden zu haben, die sie mitbringen.</blockquote>
<p>„Wir haben bewusst nach Investoren gesucht, die verstehen, dass ein Medizinprodukt nicht in einem Jahr fertig ist“, sagt Dr. Lena Hofstätter, Mitgründerin und Geschäftsführerin. „Diese Runde gibt uns die Zeit, die Pilotstudie sorgfältig durchzuführen.“</p>
<h2>Über Isarwave</h2>
<p>Isarwave Neurotechnologies wurde 2024 in Garching bei München gegründet und entwickelt ein kabelloses EEG-Band mit Trockenelektroden sowie eine KI-gestützte Auswertungssoftware für Langzeit-EEGs. Die Produkte befinden sich in der Entwicklung und sind derzeit nicht als Medizinprodukte zugelassen.</p>
<p>Pressekontakt: presse@isarwave.de</p>`,
        en: `
<p>Isarwave Neurotechnologies has closed a €3.4 million seed round. The round is led by Isarhang Ventures, with participation from Mangfall Health Fund and several business angels from medical technology and neurology, including Dr. Katrin Wolf and Prof. Dr. Henrik Brandl.</p>
<h2>What the funding is for</h2>
<p>Isarwave will use the funds to finance the clinical pilot study ISAR-01, scheduled to begin in spring 2026 at two neurology departments in the Munich area. The team will also grow from nine to fourteen people, mainly in signal processing, machine learning and regulatory affairs.</p>
<blockquote>Clinical development takes patience. We are glad to have found partners who bring it.</blockquote>
<p>“We deliberately looked for investors who understand that a medical device is not finished in a year,” says Dr. Lena Hofstätter, co-founder and CEO. “This round gives us the time to run the pilot study carefully.”</p>
<h2>About Isarwave</h2>
<p>Isarwave Neurotechnologies was founded in 2024 in Garching near Munich and develops a wireless EEG headband with dry electrodes and AI-assisted analysis software for long-term EEG. The products are under development and are not currently approved as medical devices.</p>
<p>Press contact: presse@isarwave.de</p>`,
      },
    },
  ];

  const lang = () => window.IW_LANG || 'de';
  const pick = v => (v && typeof v === 'object' ? (v[lang()] || v.de) : v);
  const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString(lang() === 'en' ? 'en-GB' : 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  return { ARTICLES, AUTHORS, CATS, img, srcset, face, pick, fmtDate };
})();
