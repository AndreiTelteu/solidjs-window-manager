import { JSX, createEffect, For, splitProps } from 'solid-js';
import { createSignal, onMount, createResource } from 'solid-js';
import { VirtualContainer } from '@minht11/solid-virtual-container';

export default function AllPosts(attrs: any): JSX.Element {
  const [props, rest] = splitProps(attrs, ['windowUpdateProps', 'windowApi', 'post']);
  const [filterUser, setFilterUser] = createSignal<{ id: number; username?: string }>({ id: 0 });

  onMount(() => {
    props.windowUpdateProps({
      title: 'Edit post: ' + props.post.title,
      loading: true,
    });
  });

  createEffect(() => {
    let newWindowProps: any = {};
    if (data.loading == false) {
      newWindowProps.loading = false;
    } else {
      newWindowProps.loading = true;
    }
    props.windowUpdateProps(newWindowProps);
  });

  const [data] = createResource(async () => {
    let post = await fetch('https://jsonplaceholder.typicode.com/posts/' + props.post.id).then((response) =>
      response.json(),
    );
    return post;
  });

  return (
    <div style="flex: 1; height: 100%; overflow: hidden; display: flex; flex-direction: column; align-items: stretch;">
      <div style="display: flex; flex-direction: row; align-items: center; padding: 10px; border-bottom: 1px solid #ccc;">
        <span style="flex: 1;">
          <b>Title:</b> <br />
          {props.post.title}
        </span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; padding: 10px; border-bottom: 1px solid #ccc;">
        <span style="flex: 1;">
          <b>Body:</b> <br />
          {props.post.body}
        </span>
      </div>
    </div>
  );
}
