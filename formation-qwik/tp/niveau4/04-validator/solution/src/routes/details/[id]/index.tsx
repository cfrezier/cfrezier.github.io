import {component$, useStore} from "@builder.io/qwik";
import {
  DocumentHead,
  Form,
  JSONObject,
  Link,
  RequestEventAction,
  routeAction$,
  routeLoader$,
  validator$
} from "@builder.io/qwik-city";
import type {SagaPowerRangers} from "../../../../../ressources-tp/models/app.model";

export const useRouteLoader = routeLoader$(async (requestEvent) => {
  const resp = await fetch("http://localhost:8080");
  return ((await resp.json()) as SagaPowerRangers).find(({id}) => id === requestEvent.params.id);
});

export const head: DocumentHead = ({resolveValue}) => {
  const saga = resolveValue(useRouteLoader);
  return {
    title: `Saga: ${saga?.nom}`,
  };
};


export default component$(() => {
  const saga = useRouteLoader();

  const editStore = useStore<{
    editing: boolean;
    adding: boolean;
    nom?: string;
    couleur?: string;
    zord?: string;
    id?: number;
  }>({editing: false, adding: false});

  const editAction = useEditAction();
  const addAction = useAddAction();

  return (
    <>
      <Link href={`/`}>Retour à la liste</Link>
      <h1>SAGA: {saga.value?.nom}</h1>
      <h2>Personnages</h2>
      <ul>
        {saga.value?.personnages.map(({id, nom, couleur, zord}) => (
          <li key={id}>
            <p>{nom} - {couleur} - {zord}</p>
            <button onClick$={() => {
              editStore.editing = true;
              editStore.adding = false;
              editStore.nom = nom;
              editStore.couleur = couleur;
              editStore.zord = zord;
              editStore.id = id;
            }}>Éditer
            </button>
          </li>
        ))}
      </ul>
      <button onClick$={() => {
        editStore.editing = false;
        editStore.adding = true;
        editStore.nom = '';
        editStore.couleur = '';
        editStore.zord = '';
        editStore.id = undefined;
      }}>Ajouter
      </button>
      {!editStore.editing ? <></> : <>
        <h2> Edition </h2>
        <Form action={editAction}
              onSubmitCompleted$={() => {
                editStore.editing = false;
              }}>
          <input name="nom" value={editStore.nom}/>
          <input name="couleur" value={editStore.couleur}/>
          <input name="zord" value={editStore.zord}/>
          <input name="id" value={editStore.id} hidden={true}/>
          <button type="submit">Update Power Ranger</button>
        </Form>
        {editAction.value?.failed && <p>{editAction.value.message}</p>}
        {editAction.value?.ok && <p>Power Ranger updated successfully</p>}
      </>
      }
      {(!editStore.adding) ? <></> : <>
        <h2> Ajout </h2>
        <Form action={addAction}
              onSubmitCompleted$={() => {
                editStore.adding = false;
              }}>
          <input name="nom" value={editStore.nom}/>
          <input name="couleur" value={editStore.couleur}/>
          <input name="zord" value={editStore.zord}/>
          <input name="sagaId" value={saga.value?.id} hidden={true}/>
          <button type="submit">Add Power Ranger</button>
        </Form>
      </>
      }
      {addAction.value?.failed && <p>{addAction.value.message}</p>}
      {addAction.value?.ok && <p>Power Ranger added successfully</p>}
    </>
  );
});

export const factorized = (method: string) => async (validation: JSONObject, {fail}: RequestEventAction<any>) => {
  const updatedPR = await fetch('http://localhost:8080', {
    method: method,
    body: JSON.stringify(validation),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!updatedPR.ok) {
    return fail(500, {message: `Impossible to ${method === 'PUT' ? 'update' : 'add'} Power Ranger.`});
  }
  return {ok: true};
}

export const factorizedValidator = validator$(async (ev, data: any) => {
  const {nom, couleur, zord} = data;
  if (nom && couleur && zord) {
    console.log('VALID');
    return {
      success: true,
      data
    };
  }
  console.error('INVALID');
  return {
    success: false,
    error: {
      message: "missing field",
      status: 400
    },
  };
});

export const useEditAction = routeAction$(factorized('PUT'), factorizedValidator);

export const useAddAction = routeAction$(factorized('POST'), factorizedValidator);