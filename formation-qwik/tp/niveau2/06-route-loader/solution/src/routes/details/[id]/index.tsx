import {component$} from "@builder.io/qwik";
import {routeLoader$} from "@builder.io/qwik-city";
import {SAGA_POWER_RANGERS} from "../../../../../ressources-tp/ressources/saga-power-rangers";

export const useRouteLoader = routeLoader$(async (requestEvent) => {
  return SAGA_POWER_RANGERS.find(({id}) => id === requestEvent.params.id);
});

export default component$(() => {
  const saga = useRouteLoader();

  return (
    <>
      <h1>SAGA: {saga.value?.nom}</h1>
      <h2>Personnages</h2>
      <ul>
        {saga.value?.personnages.map(({id, nom, couleur, zord}) => (
          <li key={id}>
            <p>{nom} - {couleur} - {zord}</p>
          </li>
        ))}
      </ul>
    </>
  );
});

