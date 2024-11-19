import {component$, Resource, Signal, useContext, useResource$, useStylesScoped$} from "@builder.io/qwik";
import style from "./power-ranger-list.css?inline";
import {dreamTeamContextId} from "~/routes";
import {Link} from "@builder.io/qwik-city";
import {SagaPowerRangers} from "../../../ressources-tp/models/app.model";

export default component$<{ color: Signal<string> }>(({color}) => {

  useStylesScoped$(style);
  const dreamTeam = useContext(dreamTeamContextId);

  const resource = useResource$(
    async () => {
      const resp = await fetch("http://localhost:8080");
      return (await resp.json()) as SagaPowerRangers;
    }
  );

  return (
    <section>
      <h2>Liste des power rangers</h2>
      <Resource
        value={resource}
        onPending={() => <>Loading sagas...</>}
        onRejected={() => <>Error getting sagas... maybe you forgot to lauch the server ?</>}
        onResolved={sagas => sagas.map(({id, nom, personnages, annee_de_debut}) => (
          <details key={id}>
            <summary>
              {nom} - {annee_de_debut} - <Link href={`/details/${id}`}>Détails de la Saga</Link>
            </summary>
            {personnages
              .filter((powerRanger) => color.value.length === 0 || powerRanger.couleur === color.value)
              .map((powerRanger) => (
                <ul key={powerRanger.id}>
                  <li>
                    <p class={`text-color-${powerRanger.couleur}`}>
                      {Object.values(powerRanger).join(" - ")}
                    </p>
                    <button onClick$={() => dreamTeam.push(powerRanger.nom)}>Ajouter à l'équipe</button>
                  </li>
                </ul>
              ))}
          </details>
        ))}>
      </Resource>
    </section>
  );
});
