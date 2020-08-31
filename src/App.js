import React, {useState} from "react";
import {Switch, Route, Link} from "react-router-dom";
import {Components, Form} from "react-formio";
import {
  Innholdstittel,
  Normaltekst,
  Sidetittel,
} from "nav-frontend-typografi";
import components from "./Custom";
import "nav-frontend-typografi-style";
import "formiojs/dist/formio.full.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import navdesign from "template";
import {Formio} from "formiojs";
import {FormPage} from "./FormPage";
import { styled } from "@material-ui/styles";

Components.setComponents(components);
Formio.use(navdesign);

const FormsList = ({forms, children}) => {
  return <ul>
    {forms
      .sort((a, b) => (a.modified < b.modified ? 1 : -1))
      .map(children)}
  </ul>;
};

const AllForms = ({forms}) => <FormsList forms={forms}>
  {form =>
    <li key={form._id}>
      <Link to={form.path}>
        <Normaltekst>{form.title}</Normaltekst>
      </Link>
    </li>}
</FormsList>;


function App({forms, className}) {
  const [submission, setSubmission] = useState({});
  return (
    <div className={className}>
      <MainContent>
      <Switch>
        <Route exact path="/">
          <h1>Velg et skjema</h1>
          <nav>
            <AllForms forms={forms}/>
          </nav>
        </Route>
        <Route
          exact
          path="/:formpath">
          <FormPage forms={forms} setSubmission={setSubmission} />
        </Route>
        <Route
          path="/:formpath/result"
          render={(routeProps) => {
            const form = forms.find(
              (form) => form.path === routeProps.match.params.formpath
            );
            if (!form) {
              return <h1>Laster..</h1>;
            }
            const resultForm =
              form.display === "wizard" ? {...form, display: "form"} : form;
            return (
              <>
                <Sidetittel>{form.title}</Sidetittel>
                <Innholdstittel>Din søknad</Innholdstittel>
                <Form
                  key="2"
                  form={resultForm}
                  options={{readOnly: true}}
                  submission={submission[form.path]}
                />
                <button onClick={window.print}>Skriv ut</button>
              </>
            );
          }}
        />
      </Switch>
      </MainContent>
    </div>
  );
}

const MainContent = styled("div") ({
  maxWidth: 600
})

export default styled(App)({
  display: "flex",
  //flexDirection: "column",
  //alignItems: "end",
  justifyContent: "center",
  //maxWidth: 600,
  padding: "2rem"
  }

  );