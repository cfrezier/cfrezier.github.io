import type {Signal} from "@builder.io/qwik";
import {
  component$,
  Resource,
  useContext,
  useResource$,
  useStore,
  useStylesScoped$,
  useVisibleTask$
} from "@builder.io/qwik";
import style from "./power-ranger-list.css?inline";
import {dreamTeamContextId} from "~/routes";
import {Link} from "@builder.io/qwik-city";
import type {SagaPowerRangers} from "../../../ressources-tp/models/app.model";

export default component$<{ color: Signal<string> }>(({color}) => {

  useStylesScoped$(style);
  const dreamTeam = useContext(dreamTeamContextId);

  const resource = useResource$(
    async () => {
      const resp = await fetch("http://localhost:8080");
      return (await resp.json()) as SagaPowerRangers;
    }
  );

  const store = useStore<{ start: number, length: number, running: boolean, interval: any }>({
    start: 0,
    length: 10,
    running: false,
    interval: undefined
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    toggleRun(store);
  });

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
              {getName(`${nom} - ${annee_de_debut}`, store.start, store.length)} - <Link href={`/details/${id}`}>Détails
              de la Saga</Link>
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
      <button onClick$={() => toggleRun(store)}>
        Défilement {store.running ? 'On' : 'Off'}
      </button>
      <h3>Pas besoin de sérialiser, car uniquement fait côté front !</h3>
    </section>
  );
});

export function updateScroll(store: { start: number }) {
  store.start++;
}

export function getName(nom: string, start: number, length: number): string {
  const _start = start % nom.length;
  const _length = length === -1 ? nom.length : length;
  let _nom = nom;
  while (_nom.length < start + length) {
    _nom += ' ' + nom;
  }
  return _nom.substring(_start, _start + _length);
}

export function toggleRun(store: { start: number, length: number, running: boolean, interval: any }) {
  if (store.running) {
    store.running = false;
    clearInterval(store.interval);
    store.start = 0;
    store.length = -1;
  } else {
    store.running = true;
    store.start = 0;
    store.length = 10;
    store.interval = setInterval(() => {
      updateScroll(store);
    }, 500);
  }
}