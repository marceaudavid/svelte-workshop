<script>
  import { fade } from 'svelte/transition';
  import Alert from "../components/Alert.svelte"
  import { onMount } from 'svelte';
  import { navigateTo } from "../router.js"
  import api from "../api.js"

  let username;
  let password;
  let alert = { toggle: false, content: "", type: "" }

  onMount(async () => {
    let blob = await api.getStatus()
    if (blob.status === 200) {
      let res = await blob.text();
      if (res !== "Visiteur") {
        navigateTo("/chat")
      }
    }
  })

  async function onSubmit() {
    let login = await api.signIn(username, password)
    if (login.status === 200) {
      let res = await login.text();
      navigateTo("/chat")
    } else {
      let err = await login.text();
      alert = { toggle: true, content: err, type: "error" }
      setTimeout(() => alert = { toggle: false, content: '', type: '' }, 5000)
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

<div transition:fade="{{delay: 250, duration: 300}}">
  <h2>SignIn</h2>
  <form class="form">
    <Alert {...alert} />
    <input bind:value="{username}" type="text" placeholder="username" />
    <input bind:value="{password}" type="password" placeholder="password" />
    <button on:click|preventDefault="{onSubmit}">Submit</button>
  </form>
</div>