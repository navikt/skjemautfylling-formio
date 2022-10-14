# Hvordan teste notifyDeploy.mjs fra lokal maskin

Kjør yarn på toppnivå for å installere avhengigheter.

Opprett en .env fil i denne mappen:

    PUSHER_APP_SECRET=<pusher-app-secret>
    BYGGER_URL=https://skjemabygging-experimental.dev.nav.no
    # BYGGER_URL=http://localhost:8080

Pusher secret må tilhøre den pusher-instansen som byggeren også er koblet mot.

Kall skriptet med `testdata`-filen og `success|failure` som input:

    cat testdata | node notifyDeploy.mjs success
    cat testdata | node notifyDeploy.mjs failure

Endre på innholdet i `testdata` for å teste ulike hendelser.

Vær innlogget i byggeren for å se at meldingen vises som forventet.
