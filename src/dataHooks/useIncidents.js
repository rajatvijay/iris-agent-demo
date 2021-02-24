import { useEffect, useState } from "react";
import { getIncidents } from "../common/api";

export const useIncidentsData = () => {
  const [status, setStatus] = useState("idle");
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("loading");
    getIncidents()
      .then((response) => {
        setStatus("success");
        setIncidents(parseIncidentsResponse(response));
      })
      .catch((error) => {
        setStatus("error");
        setError(error.message);
      });
  }, []);

  return {
    status,
    incidents,
    error,
  };
};

function parseIncidentsResponse(incidentsResponse) {
  return incidentsResponse.recentIncidents.reduce((incidents, item) => {
    return [
      ...incidents,
      ...item.incidents.map((incident) => ({
        ...incident,
        source: item.incidentSource,
        cases: incident.cases.length,
      })),
    ];
  }, []);
}
