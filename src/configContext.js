import React, { useState, useEffect } from "react";

class HttpError extends Error {}

const AppConfigContext = React.createContext();
function AppConfigProvider({ children }) {
  const [dokumentinnsendingBaseURL, setDokumentinnsendingBaseURL] = useState(
    "https://tjenester.nav.no/dokumentinnsending"
  );

  useEffect(() => {
    try {
      fetch("/skjema/config", { headers: { accept: "application/json" } })
        .then((config) => {
          if (!config.ok) {
            throw new HttpError(config.statusText);
          }
          return config.json();
        })
        .then((json) => {
          if (json.NAIS_CLUSTER_NAME === "dev-gcp")
            setDokumentinnsendingBaseURL("https://tjenester-q0.nav.no/dokumentinnsending");
        });
    } catch (error) {
      console.error("Could not fetch config from server. Reason: " + error.message);
    }
  }, []);
  return <AppConfigContext.Provider value={{ dokumentinnsendingBaseURL }}>{children}</AppConfigContext.Provider>;
}

export { AppConfigProvider, AppConfigContext };
