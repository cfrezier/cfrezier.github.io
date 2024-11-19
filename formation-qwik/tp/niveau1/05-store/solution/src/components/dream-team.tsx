import {component$} from "@builder.io/qwik";

export default component$<{ dreamTeam: string[] }>(({dreamTeam}) => {

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
