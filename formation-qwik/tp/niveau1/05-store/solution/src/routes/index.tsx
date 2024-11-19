import {component$, useSignal, useStore} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PowerRangerList from "~/components/power-ranger-list";
import DreamTeam from "../components/dream-team";

export default component$(() => {
  const color = useSignal("");
  const dreamTeam = useStore([]);

  return (
    <>
      <input bind:value={color}/>
      <PowerRangerList color={color} dreamTeam={dreamTeam}></PowerRangerList>
      <DreamTeam dreamTeam={dreamTeam}></DreamTeam>
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
