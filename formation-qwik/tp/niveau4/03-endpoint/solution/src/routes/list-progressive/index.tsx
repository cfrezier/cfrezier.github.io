import {component$, createContextId, useStore} from "@builder.io/qwik";
import {Link, server$} from "@builder.io/qwik-city";
import type {SagaPowerRangers} from "../../../../ressources-tp/models/app.model";
import prJson from "../../../../ressources-tp/ressources/saga-power-rangers.json";

export const serverList = server$(
  // Async Generator Function
  async function* () {
    const data = prJson as SagaPowerRangers;

    for (const saga of data) {
      // Yield returns the array value during each iteration

      yield saga as SagaPowerRangers[0];

      // Waiting for 1 second before the next iteration
      // This simulates a delay in the execution
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
);

export const CTX = createContextId<{ list: SagaPowerRangers }>("ctx-progressive");

export default component$(() => {

  const list = useStore<SagaPowerRangers>([]);

  return (
    <section>
      <h2>Liste des power rangers</h2>
      <button
        onClick$={
          async () => {
            // call the async stream function and wait for the response
            const response = await serverList();
            // use a for-await-of loop to asynchronously iterate over the response
            for await (const value of response) {
              // add each value from the response to the message value
              list.push(value);
            }
            // do anything else
          }
        }
      >
        Charger les Power Rangers (c'est long car ils sont trop forts)
      </button>
      <div>{list.map(({id, nom, personnages, annee_de_debut}) => (
        <details key={id}>
          <summary>
            {nom} - {annee_de_debut}
          </summary>
          {personnages
            .map((powerRanger) => (
              <ul key={powerRanger.id}>
                <li>
                  <p class={`text-color-${powerRanger.couleur}`}>
                    {Object.values(powerRanger).join(" - ")}
                  </p>
                </li>
              </ul>
            ))}
        </details>))}</div>
    </section>
  );
});