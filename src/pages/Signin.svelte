<script>
  import Alert from "../components/Alert.svelte"
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let url;
  export let ws;
  let username;
  let password;
  let alert = {toggle: false, content: "", type: ""}

  const dispatch = createEventDispatcher();

  onMount(async () => {
    let blob = await fetch(`${url}/status`, {
      credentials: 'include'
    })
    if (blob.status === 200) {
      let res = await blob.text();
      if (res !== "Visiteur") {
        await getTicket();
      }
    } else {
      let err = await blob.text();
      alert = {toggle: true, content: err, type: "error"}      
    }
  })

  async function onSignIn() {
      let login = await fetch(`${url}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      if (login.status === 200) {
        let res = await login.text();
        await getTicket();
      } else {
        let err = await login.text();
        alert = {toggle: true, content: err, type: "error"}
      }
  }

  async function getTicket() {
      let blob = await fetch(`${url}/wsTicket`, {
        credentials: 'include'
      });
      if (blob.status === 200) {
        let ticket = await blob.text();
        ws.send(ticket);
        dispatch('login', true);
        alert = {toggle: true, content: "Ticket received", type: "success"}
      } else {
        let err = await blob.text();
        alert = {toggle: true, content: err, type: "error"}
      }
  }
</script>

<style>
  .form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
</style>

<h2>SignIn</h2>
<form class="form">
  <Alert {...alert}/>
  <input bind:value="{username}" type="text" placeholder="username" />
  <input bind:value="{password}" type="password" placeholder="password" />
  <button on:click|preventDefault="{onSignIn}">Submit</button>
</form>
