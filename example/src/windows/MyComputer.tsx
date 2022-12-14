import { JSX, createSignal, onMount } from 'solid-js';

export default function MyComputer(props: any): JSX.Element {
  onMount(() => {
    props?.windowUpdateProps({
      title: 'My computer',
      loading: true,
    });
    setTimeout(() => {
      props?.windowUpdateProps({
        title: 'My computer: ' + props?.path,
        loading: false,
      });
    }, 1500);
  });

  return (
    <div>
      <p>My computer:</p>
      Path: {props?.path}
    </div>
  );
}
