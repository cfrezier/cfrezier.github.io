import { component$ } from '@builder.io/qwik';

interface HelloWorldProps {
  name: string;
}
export default component$<HelloWorldProps>(({name}) => {
  return <div>Hello {name}!</div>;
});