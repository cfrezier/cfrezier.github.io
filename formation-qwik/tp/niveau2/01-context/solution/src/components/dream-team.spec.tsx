import {createDOM} from "@builder.io/qwik/testing";
import {expect, test} from "vitest";
import DreamTeam from "~/components/dream-team";
import {component$, useContextProvider} from "@builder.io/qwik";
import {dreamTeamContextId} from "~/routes";
import DreamTeamSpec from "~/components/dream-team.spec";

export default component$(() => {
  useContextProvider(dreamTeamContextId, ['power ranger 1', 'power ranger 2']);
});

test(`[ExampleTest Component]: Should render ⭐`, async () => {
  const {screen, render} = await createDOM();
  await render(<DreamTeamSpec><DreamTeam/></DreamTeamSpec>);
  expect(screen.outerHTML).toContain("power ranger 1");
  expect(screen.outerHTML).toContain("power ranger 2");
});