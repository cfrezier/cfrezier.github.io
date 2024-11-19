import {component$, Signal} from "@builder.io/qwik";
import {SAGA_POWER_RANGERS} from "../../../ressources-tp/ressources/saga-power-rangers";
import DreamTeam from "./dream-team";

export default component$<{ color: Signal<string>; dreamTeam: Signal<string> }>(({color, dreamTeam}) => {

  return (
    <section>
      <h2>Liste des power rangers</h2>
      {SAGA_POWER_RANGERS.map(({id, nom, personnages, annee_de_debut}) => (
        <details key={id}>
          <summary>
            {nom} - {annee_de_debut}
          </summary>
          {personnages
            .filter((powerRanger) => color.value.length === 0 || powerRanger.couleur === color.value)
            .map((powerRanger) => (
              <ul key={powerRanger.nom}>
                <li>
                  <p class={`text-color-${powerRanger.couleur}`}>
                    {Object.values(powerRanger).join(" - ")}
                  </p>
                  <button onClick$={() => dreamTeam.value = powerRanger.nom}>Ajouter à l'équipe</button>
                </li>
              </ul>
            ))}
        </details>
      ))}
    </section>
  );
});
