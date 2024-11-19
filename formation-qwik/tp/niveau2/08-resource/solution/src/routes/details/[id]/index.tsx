import {component$} from "@builder.io/qwik";
import {DocumentHead, Link, routeLoader$} from "@builder.io/qwik-city";
import {SAGA_POWER_RANGERS} from "../../../../../ressources-tp/ressources/saga-power-rangers";

export const useRouteLoader = routeLoader$(async (requestEvent) => {
  return SAGA_POWER_RANGERS.find(({id}) => id === requestEvent.params.id);
});

export const head: DocumentHead = ({resolveValue}) => {
  const saga = resolveValue(useRouteLoader);
  return {
    title: `Saga: ${saga?.nom}`,
  };
};


export default component$(() => {
  const saga = useRouteLoader();

  return (
    <>
      <Link href={`/`}>Retour à la liste</Link>
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
