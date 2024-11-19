import {component$, useSignal} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PowerRangerList from "~/components/power-ranger-list";

export default component$(() => {
  const color = useSignal("");
  return (
    <>
      <input bind:value={color}/>
      <PowerRangerList color={color}></PowerRangerList>
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
