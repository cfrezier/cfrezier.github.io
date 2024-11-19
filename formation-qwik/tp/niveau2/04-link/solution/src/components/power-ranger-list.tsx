import {component$, Signal, useContext, useStylesScoped$} from "@builder.io/qwik";
import {SAGA_POWER_RANGERS} from "../../../ressources-tp/ressources/saga-power-rangers";
import style from "./power-ranger-list.css?inline";
import {dreamTeamContextId} from "~/routes";
import {Link} from "@builder.io/qwik-city";

export default component$<{ color: Signal<string> }>(({color}) => {

  useStylesScoped$(style);
  const dreamTeam = useContext(dreamTeamContextId);

  return (
    <section>
      <h2>Liste des power rangers</h2>
      {SAGA_POWER_RANGERS.map(({id, nom, personnages, annee_de_debut}) => (
        <details key={id}>
          <summary>
            {nom} - {annee_de_debut} - <Link href={`/details/${id}`}>Détails de la Saga</Link>
          </summary>
          {personnages
            .filter((powerRanger) => color.value.length === 0 || powerRanger.couleur === color.value)
            .map((powerRanger) => (
              <ul key={powerRanger.nom}>
                <li>
                  <p class={`text-color-${powerRanger.couleur}`}>
                    {Object.values(powerRanger).join(" - ")}
                  </p>
                  <button onClick$={() => dreamTeam.push(powerRanger.nom)}>Ajouter à l'équipe</button>
                </li>
              </ul>
            ))}
        </details>
      ))}
    </section>
  );
});
