import {RequestHandler} from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({json}) => {
  const resp = await fetch("http://localhost:8080");
  const data = await resp.json();
  json(200, data);
};