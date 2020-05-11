<script>
  import Alert from "../components/Alert.svelte"
  import { onMount } from 'svelte';
  import { navigateTo } from "../router.js"
  import api from "../api.js"

  let username;
  let password;
  let alert = {toggle: false, content: "", type: ""}

  onMount(async () => {
    let blob = await api.getStatus()
    if (blob.status === 200) {
      let res = await blob.text();
      if (res !== "Visiteur") {
        navigateTo("/chat")
      }
    } else {
      let err = await blob.text();
    }
  })

  async function onSubmit() {
      let login = await api.signIn(username, password)
      if (login.status === 200) {
        let res = await login.text();
        navigateTo("/chat")
      } else {
        let err = await login.text();
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
  <button on:click|preventDefault="{onSubmit}">Submit</button>
</form>
