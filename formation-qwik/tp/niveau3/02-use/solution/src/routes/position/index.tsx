import {$, component$, useOn, useOnDocument, useOnWindow, useStore} from "@builder.io/qwik";

export default component$(() => {

  const store = useStore(
    {
      element: {x: 0, y: 0},
      window: {x: 0, y: 0},
      document: {x: 0, y: 0},
    },
    {deep: true}
  );
  useOn(
    'mousemove',
    $((event) => {
      store.element.x = event.x;
      store.element.y = event.y;
    })
  );
  useOnDocument(
    'mousemove',
    $((event) => {
      store.document.x = event.x;
      store.document.y = event.y;
    })
  );
  useOnWindow(
    'mousemove',
    $((event) => {
      store.window.x = event.x;
      store.window.y = event.y;
    })
  );

  return <>
    <h1>Position</h1>
    <h3>Works both in MPA and SPA</h3>
    <ul>
      <li>
        Element: ({store.element.x}, {store.element.y})
      </li>
      <li>
        Document: ({store.document.x}, {store.document.y})
      </li>
      <li>
        Window: ({store.window.x}, {store.window.y})
      </li>
    </ul>
  </>
})