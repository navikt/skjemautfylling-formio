# skjemautfylling-formio

Her finner du:

-   publiserte skjemadefinisjoner i mappen `forms`
-   publiserte oversettelser i mappen `translations`
-   publiserte ressurser i mappen `resources`
-   git sha i filen MONOREPO som er versjonen til tilhørende `fyllut-base` docker image

Dette bygges sammen til applikasjonen FyllUt, og deployes til `prod-gcp` når en skjemabygger
publiserer en endring.

## Bygg og deploy

Imagene for `prod`, `dev` og `delingslenke` bygges her, `FROM` `fyllut-base` fra
monorepoet `skjemabygging-formio`. Under deploy hentes NAIS-konfigurasjonen
(`.nais/fyllut/`) fra monorepoet på git sha-en som ligger i filen `MONOREPO`.
Applikasjonskode og NAIS-konfigurasjon deployes derfor alltid sammen.

`preprod` og `preprod-alt` deployes derimot fra monorepoet, og kjører rett på
`fyllut-base` uten innholdet fra dette repoet.

Merk at bygget her setter to ulike git sha-er i imaget:

| Variabel | Peker på |
| --- | --- |
| `GIT_SHA` | dette repoet, altså innholdet: skjemadefinisjoner, oversettelser og ressurser |
| `MONOREPO_GIT_SHA` | monorepoet, altså applikasjonskoden |

I `fyllut-base` peker begge variablene på applikasjonskoden. `GIT_SHA` betyr
altså ikke det samme i miljøene som bygges her som i `preprod`/`preprod-alt`.
Bruk `MONOREPO_GIT_SHA` når du utvetydig trenger versjonen av applikasjonskoden.

`GIT_SHA` endrer seg her hver gang et hvilket som helst skjema publiseres, og
sier derfor ingenting om hvorvidt ett bestemt skjema er endret.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #skjemadigitalisering.
