import {component$} from "@builder.io/qwik";
import {useLocation} from "@builder.io/qwik-city";
import {SAGA_POWER_RANGERS} from "../../../../../ressources-tp/ressources/saga-power-rangers";

export default component$(() => {
  const routeLocation = useLocation();

  const saga = SAGA_POWER_RANGERS.find(({id}) => id === routeLocation.params.id);

  return (
    <>
      <h1>SAGA: {saga?.nom}</h1>
      <h2>Personnages</h2>
      <ul>
        {saga?.personnages.map(({id, nom, couleur, zord}) => (
          <li key={id}>
            <p>{nom} - {couleur} - {zord}</p>
          </li>
        ))}
      </ul>
    </>
  );
});