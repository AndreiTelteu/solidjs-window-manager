import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';

export default function MyComputer(props: any): Component {
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
  ) as Component; // I don't know how to fix vscode typescript issue other that this ugly fix
}
