import {component$} from "@builder.io/qwik";
import {RequestHandler} from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Mon power rangers</h1>
    </>
  );
});

export const onRequest: RequestHandler = async (requestEvent) => {
  if (requestEvent.request.headers.get("Authentication")) {
    await requestEvent.next();
  } else {
    requestEvent.json(401, {error: "Unauthorized"});
  }
};