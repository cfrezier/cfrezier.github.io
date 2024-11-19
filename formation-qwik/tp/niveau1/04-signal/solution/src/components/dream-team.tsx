import {component$, Signal} from "@builder.io/qwik";

export default component$<{ dreamTeam: Signal<string> }>(({dreamTeam}) => {

  return (
    <secion>
      <h2>La Dream Team</h2>
      {dreamTeam.value}
    </secion>
  );
});
