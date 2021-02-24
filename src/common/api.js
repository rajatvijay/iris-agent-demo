export const getIncidents = () => {
  return fetch(
    "https://iris-srv-stg-r5hb7kmcxq-uc.a.run.app/frontEndInterview/getIncidentsData"
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  });
};
