import {component$, useContext} from "@builder.io/qwik";
import {dreamTeamContextId} from "~/routes";

export default component$(() => {

  const dreamTeam = useContext(dreamTeamContextId);

  return (
    <secion>
      <h2>La Dream Team</h2>
      <ul>
        {dreamTeam.map((nom) => (
          <li key={nom}>{nom}</li>
        ))}
      </ul>
    </secion>
  );
});
