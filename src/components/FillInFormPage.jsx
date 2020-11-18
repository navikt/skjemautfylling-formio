import React from "react";
import { useHistory } from "react-router-dom";
import { Sidetittel } from "nav-frontend-typografi";
import { NavForm } from "skjemabygging-formio";
import { styled } from "@material-ui/styles";

export const Header = styled(Sidetittel)({
  margin: "2rem 0 2rem 0",
});

export const FillInFormPage = ({ form, submission, setSubmission }) => {
  const history = useHistory();

  return (
    <main tabIndex={-1}>
      <Header>{form.title}</Header>
      <NavForm
        key="1"
        form={form}
        submission={submission[form.path]}
        onSubmit={(submission) => {
          setSubmission({ [form.path]: submission });
          history.push(`/${form.path}/oppsummering`);
        }}
      />
    </main>
  );
};
