<script>
  import { createEventDispatcher } from 'svelte';

  export let ws;
  export let url;
  let message;
  let messages = [];
  let markers = {};

  const dispatch = createEventDispatcher();

  function onSendMsg() {
    ws.send(`msg:${message}`);
    message = '';
  }

  function onSendPosition(event) {
    let map = document.getElementById('map').getBoundingClientRect();
    ws.send(`mov:${event.clientX - map.x},${event.clientY - map.y}`);
  }

  function onLogout() {
    fetch(`${url}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    dispatch('logout', false);
  }

  ws.addEventListener('message', (msg) => {
    let message = msg.data.split(':').map((el) => el.trim());
    let user = message[0];
    let type = message[1];
    if (type === 'msg') {
      messages = [...messages, `${message[0]} : ${message[2]}`];
    } else if (type === 'mov') {
      let coords = message[2].split(',');
      if (coords[1] >= 500) {
        coords[1] = 500;
      }
      if (coords[0] >= 500) {
        coords[0] = 500;
      }
      markers = {
        ...markers,
        [user]: {
          x: Math.abs(parseInt(coords[0])),
          y: Math.abs(parseInt(coords[1])),
        },
      };
    } else {
      messages = [...messages, msg.data];
    }
  });
</script>

<style>
  .chat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #map {
    position: relative;
    width: 500px;
    height: 500px;
    border: 1px solid black;
  }

  .logout {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .marker {
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    transition: top 1s, left 1s;
  }

  .messages {
    height: 200px;
    width: 500px;
    overflow: auto;
  }
</style>

<button class="logout" on:click|preventDefault="{onLogout}">Logout</button>
<div class="chat">
  <h2>GoChat</h2>
  <form id="chat-form">
    <input bind:value="{message}" />
    <button on:click|preventDefault="{onSendMsg}">Submit</button>
  </form>
  <div id="map" on:click|preventDefault="{onSendPosition}">
    {#each Object.entries(markers) as [marker, pos]}
    <div class="marker" style={`top:${pos.y}px;left:${pos.x}px`}>{marker}</div>
    {/each}
  </div>
  <ul class="messages">
    {#each messages as item}
    <li>{item}</li>
    {/each}
  </ul>
</div>