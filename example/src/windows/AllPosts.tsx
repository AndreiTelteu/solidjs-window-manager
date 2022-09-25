import { Component, splitProps } from 'solid-js';
import { createSignal, onMount, createResource } from "solid-js";

export default function AllPosts(attrs: any): Component {
  const [props, rest] = splitProps(attrs, ["windowUpdateProps", "windowApi"]);
  
  onMount(() => {
    props.windowUpdateProps({
      title: "All posts",
      loading: true
    });
    setTimeout(() => {
      props.windowUpdateProps({
        loading: false
      });
    }, 1500);
  });
  
  const [data] = createResource(async () => {
    let posts = await fetch('https://jsonplaceholder.typicode.com/posts/?limit=100')
      .then(response => response.json());
    return { posts };
  });

  return (
    <div>
      <p>My computer:</p>
      Path: {JSON.stringify(data())}
    </div>
  ) as Component;
};
