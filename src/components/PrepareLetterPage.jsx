import React, { useEffect } from "react";
import styled from "@material-ui/styles/styled";
import { Innholdstittel, Normaltekst, Sidetittel, Systemtittel } from "nav-frontend-typografi";
import { scrollToAndSetFocus } from "../util/focus-management";
import PropTypes from "prop-types";
import { genererFoerstesideData } from "../util/forsteside";
import { lastNedFilBase64 } from "../util/pdf";

export function PrepareLetterPage({ form, submission }) {
  useEffect(() => scrollToAndSetFocus("main"), []);

  function lastNedFoersteside() {
    fetch("/fyllut/foersteside", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genererFoerstesideData(form, submission.data)),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          throw new Error("Failed to retrieve foersteside from soknadsveiviser " + JSON.stringify(response.body));
        }
      })
      .then((response) => response.json())
      .then((json) => json.foersteside)
      .then((base64EncodedPdf) => {
        lastNedFilBase64(base64EncodedPdf, "Førstesideark", "pdf");
      })
      .catch((e) => console.log("Failed to download foersteside", e));
  }

  return (
    <ResultContent tabIndex={-1}>
      <Sidetittel className="margin-bottom-large">{form.title}</Sidetittel>
      <section className="margin-bottom-default">
        <Innholdstittel className="margin-bottom-large">Last ned søknadspapirene</Innholdstittel>
        <Systemtittel className="margin-bottom-default">1. Du må legge ved disse vedleggene</Systemtittel>
        <Systemtittel className="margin-bottom-default">2. Last ned søknadspapirene til saken din</Systemtittel>
        <Normaltekst className="margin-bottom-default">
          Førstesidearket inneholder viktig informasjon om hvilken enhet i NAV som skal motta dokumentasjonen. Den
          inneholder også adressen du skal sende dokumentene til.
        </Normaltekst>
        {process.env.NODE_ENV === "development" && (
          <div className="margin-bottom-default">
            <button className="knapp fullbredde" onClick={lastNedFoersteside}>
              Last ned førsteside
            </button>
          </div>
        )}
        <form id={form.path} action="/fyllut/pdf-form" method="post" acceptCharset="utf-8" target="_blank" hidden>
          <textarea hidden={true} name="submission" readOnly={true} required value={JSON.stringify(submission)} />
          <textarea hidden={true} name="form" readOnly={true} required value={JSON.stringify(form)} />
        </form>
        <div>
          <input form={form.path} className="knapp fullbredde" type="submit" value="Last ned Søknad" />
        </div>
      </section>
      <section className="margin-bottom-large">
        <Systemtittel className="margin-bottom-default">3. Send søknaden i posten</Systemtittel>
        <Normaltekst className="margin-bottom-default">
          Følg instruksjonene på førstesiden for å sende søknaden i posten. Husk å legge ved eventuelle vedlegg som står
          på førstesidearket.
        </Normaltekst>
        <Systemtittel className="margin-bottom-default">4. Hva skjer videre?</Systemtittel>
        <Normaltekst className="margin-bottom-default">
          Du hører fra oss så fort vi har sett på saken din. Vi tar kontakt med deg om vi mangler noe.
        </Normaltekst>
      </section>
    </ResultContent>
  );
}

PrepareLetterPage.propTypes = {
  form: PropTypes.object.isRequired,
  submission: PropTypes.object.isRequired,
};

const ResultContent = styled("main")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});
