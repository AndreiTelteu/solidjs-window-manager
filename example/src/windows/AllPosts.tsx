import { JSX, createEffect, For, splitProps } from 'solid-js';
import { createSignal, onMount, createResource } from 'solid-js';
import { VirtualContainer } from '@minht11/solid-virtual-container';

export default function AllPosts(attrs: any): JSX.Element {
  const [props, rest] = splitProps(attrs, ['windowUpdateProps', 'windowApi']);
  const [filterUser, setFilterUser] = createSignal<{ id: number; username?: string }>({ id: 0 });

  onMount(() => {
    props.windowUpdateProps({
      title: 'All posts',
      loading: true,
    });
  });

  createEffect(() => {
    let newWindowProps: any = {};
    if (data.loading == false) {
      newWindowProps.title =
        (filterUser()?.id ? filterUser()?.username + "'s posts" : 'All posts') + ' (' + (data()?.length || 0) + ')';
      newWindowProps.loading = false;
    } else {
      newWindowProps.loading = true;
    }
    props.windowUpdateProps(newWindowProps);
  });

  const [data] = createResource(filterUser, async () => {
    let posts = await fetch(
      'https://jsonplaceholder.typicode.com' + (filterUser()?.id ? `/user/${filterUser()?.id}/posts` : '/posts'),
    ).then((response) => response.json());
    return posts;
  });
  const [users] = createResource(async (user) => {
    let users = await fetch('https://jsonplaceholder.typicode.com/users').then((response) => response.json());
    return users;
  });

  let scrollRef;
  return (
    <div style="flex: 1; height: 100%; overflow: hidden; display: flex; flex-direction: column; align-items: stretch;">
      <div style="display: flex; flex-direction: row; align-items: center; padding: 10px; border-bottom: 1px solid #ccc;">
        <span style="flex: 1;">
          {filterUser()?.id ? filterUser()?.username + "'s posts" : 'All posts'}:{' '}
          {!data.loading ? '(' + data()?.length + ')' : ''}
        </span>
        <label style="flex-shrink: 0;">
          <select
            value={filterUser()?.id}
            onInput={(event) => {
              const id = parseInt((event.target as HTMLSelectElement).value);
              const user = (users() || []).find((i) => i.id == id);
              setFilterUser({ id, username: user?.username });
            }}
          >
            <option value={0}>Filter by user</option>
            <For
              each={users.loading == false ? users() : []}
              children={(item: any) => <option value={item.id}>{item.username}</option>}
            />
          </select>
        </label>
      </div>

      <div style="display: flex; flex-direction: row; align-items: center; padding: 10px; border-bottom: 1px solid #ccc; font-size: 12px; font-weight: bold;">
        <span style="flex-shrink: 0; width: 30px;">ID</span>
        <span style="flex: 1;">Title</span>
        <span style="flex-shrink: 0; width: 80px;">Author</span>
        <span style="flex-shrink: 0; width: 56px;"></span>
      </div>
      <div ref={scrollRef} style="flex: 1; overflow: auto;">
        <VirtualContainer
          items={data()}
          scrollTarget={scrollRef}
          itemSize={{ height: 46 }}
          children={(props2: any) => {
            const author = () => (users() || []).find((i) => i.id == props2.item.userId);
            return (
              <div tabIndex={props2.tabIndex} role="listitem" style={props2.style} class="VirtualContainer-listitem">
                <div
                  style={`
                  display: flex; flex-direction: row; align-items: center; align-items: center;
                  padding: 0 10px; border-bottom: 1px solid #ccc; font-size: 13px; width: 100%; height: 100%;
                  ${props2.index % 2 != 0 ? 'background: rgba(0, 0, 0, 0.04)' : ''}
                `}
                >
                  <span style="flex-shrink: 0; width: 30px;">{props2.item.id}</span>
                  <span style="flex: 1; word-break: break-all;">{props2.item.title}</span>
                  <span style="flex-shrink: 0; width: 80px; word-break: break-all;">
                    {author() ? author().username : ''}
                  </span>
                  <span style="flex-shrink: 0; width: 56px;">
                    <button
                      type="button"
                      style="appearance: none; background: none; border: none;"
                      onClick={() => props?.windowApi?.openWindow?.('MyComputer')}
                    >
                      EDIT
                    </button>
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>
      <style>{`
        .VirtualContainer-listitem {
          width: 100%;
        }
        .VirtualContainer-listitem:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        .VirtualContainer-listitem button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
