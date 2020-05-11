<script>
  import { fade } from 'svelte/transition';
  import Alert from "../components/Alert.svelte"
  import { navigateTo } from '../router.js';
  import api from "../api.js"

  let username;
  let email;
  let password;
  let alert = { toggle: false, content: "", type: "" }

  async function onSubmit() {
    let blob = await api.signUp(username, password, email)
    if (blob.status === 200) {
      let res = await blob.text();
      navigateTo('/signin');
    } else {
      let err = await blob.text();
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
  <h2>SignUp</h2>
  <form class="form">
    <Alert {...alert} />
    <input bind:value="{username}" type="text" placeholder="username" />
    <input bind:value="{email}" type="email" placeholder="email" />
    <input bind:value="{password}" type="password" placeholder="password" />
    <button on:click|preventDefault="{onSubmit}">Submit</button>
  </form>
</div>