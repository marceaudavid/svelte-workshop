<script>
  import { fade, fly } from 'svelte/transition';
  import Alert from '../components/Alert.svelte';
  import { navigateTo } from '../router.js';
  import { onMount } from 'svelte';
  import api from '../api.js';


  let ws;
  let message;
  let messages = [];
  let markers = {};
  let alert = { toggle: false, content: '', type: '' };

  onMount(async () => {
    let blob = await api.getStatus()
    if (blob.status === 200) {
      let res = await blob.text();
      if (res !== "Visiteur") {
        let blob = await api.getTicket();
        if (blob.status === 200) {
          let ticket = await blob.text();
          alert = { toggle: true, content: "Ticket received", type: "success" }
          setTimeout(() => alert = { toggle: false, content: '', type: '' }, 5000)
          ws = await api.startWebsocket(ticket, onMessage, onClose);
        } else {
          let err = await blob.text();
          alert = { toggle: true, content: err, type: "error" }
          setTimeout(() => alert = { toggle: false, content: '', type: '' }, 5000)
          navigateTo("/signin")
        }
      }
    } else {
      navigateTo("/signin")
    }
  });

  function onMessage(msg) {
    let message = msg.data.split(':').map((el) => el.trim());
    let user = message[0];
    let type = message[1];
    if (type === 'msg') {
      messages = [...messages, `${message[0]} : ${message[2]}`];
    } else if (type === 'mov') {
      let coords = message[2].split(',');
      let x = Math.abs(parseInt(coords[0]));
      let y = Math.abs(parseInt(coords[1]));
      if (x >= 500) {
        x = 500;
      }
      if (y >= 500) {
        y = 500;
      }
      markers = {
        ...markers,
        [user]: {
          x,
          y,
        },
      };
    } else {
      messages = [...messages, msg.data];
    }
  }

  function onClose() {
    alert = { toggle: true, content: "Connection closed", type: "error" }
    setTimeout(() => onLogout(), 5000)
  }

  function onSendMsg() {
    ws.send(`msg:${message}`);
    message = '';
  }

  function onSendPosition(event) {
    let map = document.getElementById('map').getBoundingClientRect();
    ws.send(`mov:${event.clientX - map.x},${event.clientY - map.y}`);
  }

  async function onLogout() {
    await api.logout();
    navigateTo('/');
  }
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

  .legend {
    position: absolute;
    transition: top 1s, left 1s;
  }

  .messages {
    height: 200px;
    width: 500px;
    overflow: auto;
  }
</style>

<div transition:fade="{{delay: 250, duration: 300}}">
  <button class="logout" on:click|preventDefault="{onLogout}">Logout</button>
  <div class="chat">
    <Alert {...alert} />
    <h2>GoChat</h2>
    <form id="chat-form">
      <input bind:value="{message}" />
      <button on:click|preventDefault="{onSendMsg}">Submit</button>
    </form>
    <div id="map" on:click|preventDefault="{onSendPosition}">
      {#each Object.entries(markers) as [user, position]}
    <div class="marker" style="{`top:${position.y}px;left:${position.x}px`}"></div>
    <div class="legend" style="{`top:${position.y+15}px;left:${position.x+15}px`}">{user}</div>
    {/each}
  </div>
  <ul class="messages">
    {#each messages as item}
    <li transition:fly="{{delay: 0, duration: 300, x: 100, y: 0, opacity: 0.5}}">{item}</li>
    {/each}
  </ul>
</div>
</div>