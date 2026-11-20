# Live-Demo-Start über den Permission Handler

## Browser- und Dialogablauf

1. Beim Klick auf eine Live-Demo öffnet das Frontend synchron ein leeres Browserfenster bzw. einen neuen Tab. Das verhindert, dass der Browser die spätere Navigation nach längerer asynchroner Arbeit als Popup blockiert.
2. Das Portfolio fordert ein CSRF-Cookie an und prüft `GET /api/auth/me/`.
3. Bei `401` versucht es einmal den bestehenden Refresh-Endpunkt und prüft den Status erneut.
4. Ist keine gültige Sitzung vorhanden, bleibt das leere Browserfenster zunächst offen und das Portfolio zeigt den Zugangsdialog. Bei erfolgreichem Login wird ausschließlich das zuvor gewählte Projekt fortgesetzt.
5. Wird stattdessen eine Registrierung gestartet, wird das ausgewählte Projekt verworfen und das leere Browserfenster geschlossen. Nach der E-Mail-Aktivierung muss der Nutzer die gewünschte Demo erneut anklicken.
6. Nach bestätigter Anmeldung fordert das Frontend über `POST /api/auth/demo-assertion/` eine kurzlebige Assertion für das ausgewählte Projekt an.
7. Die Assertion wird unverändert im JSON-Body an den Permission Handler gesendet.
8. Das Frontend fragt den zurückgegebenen Statuspfad alle zwei Sekunden ab und navigiert erst bei `state=ready` zum serverseitig gelieferten relativen Zielpfad.
9. Bei Ablehnung, Ablauf, Fehler, Abbruch oder ungültigem Redirect wird das leere Browserfenster geschlossen.

Während des Starts bleibt der Fortschrittsdialog im Portfolio sichtbar. Das Frontend versucht, den neuen Browserkontext während der Wartezeit aus dem Vordergrund zu nehmen. Browser können `focus()` und `blur()` ignorieren; das Verhalten und die Darstellung von Tabs/Fenstern kann daher nicht garantiert werden.

Die Assertion wird weder in einer URL noch in Local Storage abgelegt. Das Demo-Session-Cookie bleibt `HttpOnly` und wird nicht durch JavaScript gelesen.

## Same-Origin-Routen

Das Portfolio verwendet für den Permission Handler den reservierten Präfix:

`/permission-api/`

Beispiele der Frontend-Aufrufe:

- `POST /permission-api/api/demo/authorize/`
- `GET /permission-api/api/demo/status/`

Der Handler selbst stellt die Endpunkte unter `/api/demo/` bereit. Der Reverse Proxy muss den Präfix `/permission-api/` entfernen und intern an den Permission Handler weiterleiten. Der bestehende Portfolio-Backend-Pfad `/api/` bleibt davon unberührt.

Die lokale Angular-Entwicklungsproxy-Konfiguration leitet `/permission-api/**` an den T-95-Host weiter. Das funktioniert erst, wenn dort die passende Nginx-Route und der interne Handler-Dienst installiert und freigegeben sind.

## Sicherheitsgrenzen und offener Deployment-Schritt

- Die Demo-Buttons enthalten keine direkten Projekt-URLs.
- Das Frontend verwendet ausschließlich den vom Permission Handler zurückgegebenen relativen Zielpfad und prüft, dass die Navigation auf derselben Domain bleibt.
- Nur `state=ready` wird als erfolgreiche Bereitschaft akzeptiert. `failed`, `revoked` und `expired` beenden den Start ohne Navigation.
- Der Permission Handler entscheidet über Grant, Projektstatus, Startbereitschaft und Zielpfad.
- Die vier Projekt-Slugs werden an die Backend-Allowlist übergeben; nicht konfigurierte oder deaktivierte Demos müssen serverseitig mit Fehlerstatus abgewiesen werden.
- Die Nginx-Route `/permission-api/` ist noch nicht auf dem T-95 eingerichtet.
- Die geschützten Demo-Routen und APIs sind noch nicht durch Nginx `auth_request` abgesichert. Daher ist diese Frontend-Änderung allein keine produktive Freigabe.

Vor einem Live-Test müssen Handler-Deployment, Nginx-Weiterleitung, Host-Agent und die projektbezogenen `auth_request`-Regeln separat eingerichtet und geprüft werden. Es wurden in diesem Arbeitsschritt keine Server- oder Nginx-Konfigurationen geändert.
