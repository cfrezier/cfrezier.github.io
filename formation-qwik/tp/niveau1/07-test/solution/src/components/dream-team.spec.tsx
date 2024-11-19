import {createDOM} from "@builder.io/qwik/testing";
import { test, expect } from "vitest";
import PowerRangerList from "~/components/power-ranger-list";
import DreamTeam from "~/components/dream-team";

test(`[ExampleTest Component]: Should render ⭐`, async () => {
  const { screen, render } = await createDOM();
  await render(<DreamTeam dreamTeam={['power ranger 1', 'power ranger 2']} />);
  expect(screen.outerHTML).toContain("power ranger 1");
  expect(screen.outerHTML).toContain("power ranger 2");
});