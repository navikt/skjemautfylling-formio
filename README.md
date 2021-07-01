# skjemautfylling-formio

Her ligger publiserte skjemadefinisjoner i mappen `forms`, og de pakkes sammen med applikasjonen `fyllut`
som hentes vha. git submodul [skjemabygging-formio](https://github.com/navikt/skjemabygging-formio), og deployes
til produksjon.

# Komme i gang

For at filene i git submodulen `skjemabygging-formio` skal hentes må følgende kommando kjøres på rotnivå i
dette repo'et:

```
git submodule update --init
```

:warning: Innholdet i mappen `skjemabygging-formio` skal ikke endres herfra. Sjekk ut
[skjemabygging-formio](https://github.com/navikt/skjemabygging-formio) for å gjøre kodeendringer i selve applikasjonen.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #skjemadigitalisering.
