# DT-ProfiSchweissnaht – Schweißnahtberechnung

Dieses Repository enthält die Web-Anwendung **DT-ProfiSchweissnaht** zur professionellen Schweißnahtberechnung im Stahlbau und Maschinenbau. Die Anwendung deckt Berechnungsverfahren nach aktuellen Normen wie **EN 1993-1-8 (Eurocode 3)** sowie die klassischen Ansätze nach **Roloff/Matek** ab.

## 🚀 Live-Versionen

Um die Anwendung direkt im Browser zu nutzen, stehen folgende Versionen über GitHub Pages zur Verfügung:

*   **[DT-ProfiSchweissnaht – Testversion](https://dietertepe.github.io/dt-profischweissnaht-web/DT-ProfiSchweissnaht_Testversion.html)**
*   *[Hier optional den Link zur Hauptversion einfügen, falls vorhanden]*

---

## 🛠️ Funktionsumfang

Die Oberfläche ist modular aufgebaut und ermöglicht eine lückenlose Verfolgung des gesamten Berechnungsprozesses:

1. **Eingabe & Konfiguration**
    * **Grundeinstellungen & Werkstoffe:** Schnelle Auswahl von Festigkeitswerten und Stahlgüten.
    * **Nahtart & Geometrie:** Definition von Kehlnähten, Stumpfnähten und spezifischen Nahtvorbereitungen.
    * **Lasten & Beiwerte:** Eingabe von mechanischen Einwirkungen und Anpassung normspezifischer Sicherheitsbeiwerte.
    * **Schweißparameter & Wärmeführung:** Integration von Vorwärmtemperaturen und Ermittlung der t8/5-Abkühlzeit nach **EN 1011-2**.

2. **Ergebnisse & Auswertung**
    * **Visuelles Nahtbild:** Dynamische Generierung von interaktiven Grafiken im SVG-Format.
    * **Detaillierter Rechenweg:** Transparente Aufschlüsselung der Formeln zur einfachen Überprüfung der Nachweise.
    * **Wirtschaftlichkeit:** Integriertes Modul zur Berechnung von Materialmengen, Schweißzeiten und Drahtbedarf.

3. **Dokumentation & Export**
    * Erstellung von professionellen Berichten als **PDF-Druck**, **Word-Dokument (.rtf)** oder im anwendungseigenen **Datensatz-Format (.dts)**.

---

## 🔍 Hinweise zur Suchmaschinen-Indexierung (SEO)

Falls die Webseiten (insbesondere die Testversion) nicht direkt in den Suchergebnissen von Google auftauchen, liegt dies meist an den technischen Eigenheiten von Single-Page-Apps auf GitHub Pages. 

### Maßnahmen zur Indexierung:
*   **Interne Verlinkung:** Durch die Listung der URLs in dieser `README.md` wird der Googlebot bei der Überprüfung des Repositorys direkt auf die HTML-Seiten geleitet.
*   **Search Console:** Es wird empfohlen, das genaue URL-Präfix in der [Google Search Console](https://search.google.com/search-console/about) zu hinterlegen und eine `sitemap.xml` im `root`-Verzeichnis dieses Projekts zu platzieren.

---

*Hinweis: Die Berechnungen erfolgen ohne Gewähr. Vor einer produktiven Nutzung im konstruktiven Ingenieurbau sind die Ergebnisse stets gegen die Originalnormen zu prüfen.*
