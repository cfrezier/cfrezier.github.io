import {component$, createContextId, useContext, useContextProvider, useSignal, useStore} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PowerRangerList from "~/components/power-ranger-list";
import DreamTeam from "../components/dream-team";

export const dreamTeamContextId = createContextId<string[]>('dreamTeam');

export default component$(() => {
  const color = useSignal("");
  useContextProvider(dreamTeamContextId, useStore([]))

  return (
    <>
      <input bind:value={color}/>
      <PowerRangerList color={color}></PowerRangerList>
      <DreamTeam></DreamTeam>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
