# Live-Demo-Start über den Permission Handler

## Frontend-Ablauf

1. Das Portfolio fordert ein CSRF-Cookie an.
2. Es prüft `GET /api/auth/me/`.
3. Bei `401` versucht es einmal den bestehenden Refresh-Endpunkt und prüft den Status erneut.
4. Nur bei bestätigter Portfolio-Sitzung fordert es über `POST /api/auth/demo-assertion/` eine kurzlebige Assertion für das ausgewählte Projekt an.
5. Die Assertion wird unverändert im JSON-Body an den Permission Handler gesendet.
6. Das Frontend fragt den zurückgegebenen Statuspfad ab und navigiert erst nach `state=ready` zum serverseitig gelieferten relativen Zielpfad.

Die Assertion wird weder in einer URL noch in Local Storage abgelegt. Das Demo-Session-Cookie bleibt `HttpOnly` und wird nicht durch JavaScript gelesen.

## Same-Origin-Routen

Das Portfolio verwendet für den Permission Handler den reservierten Präfix:

`/permission-api/`

Beispiele der Frontend-Aufrufe:

- `POST /permission-api/api/demo/authorize/`
- `GET /permission-api/api/demo/status/`

Der Handler selbst stellt die Endpunkte unter `/api/demo/` bereit. Der Reverse Proxy muss den Präfix `/permission-api/` entfernen und intern an den Permission Handler weiterleiten. Der bestehende Portfolio-Backend-Pfad `/api/` bleibt davon unberührt.

Die lokale Angular-Entwicklungsproxy-Konfiguration leitet `/permission-api/**` bereits an den T-95-Host weiter. Das funktioniert erst, wenn dort die passende Nginx-Route und der interne Handler-Dienst installiert und freigegeben sind.

## Sicherheitsgrenzen und offener Deployment-Schritt

- Die Demo-Buttons enthalten keine direkten Projekt-URLs.
- Das Frontend verwendet ausschließlich den vom Permission Handler zurückgegebenen relativen Zielpfad und prüft, dass die Navigation auf derselben Domain bleibt.
- Der Permission Handler entscheidet über Grant, Projektstatus, Startbereitschaft und Zielpfad.
- Die vier Projekt-Slugs werden an die Backend-Allowlist übergeben; nicht konfigurierte oder deaktivierte Demos müssen serverseitig mit Fehlerstatus abgewiesen werden.
- Die Nginx-Route `/permission-api/` ist noch nicht auf dem T-95 eingerichtet.
- Die geschützten Demo-Routen und APIs sind noch nicht durch Nginx `auth_request` abgesichert. Daher ist diese Frontend-Änderung allein keine produktive Freigabe.

Vor einem Live-Test müssen Handler-Deployment, Nginx-Weiterleitung, Host-Agent und die projektbezogenen `auth_request`-Regeln separat eingerichtet und geprüft werden. Es wurden in diesem Arbeitsschritt keine Server- oder Nginx-Konfigurationen geändert.
