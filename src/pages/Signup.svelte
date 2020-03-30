<script>
  import Alert from "../components/Alert.svelte"

  export let url;
  let username;
  let email;
  let password;
  let alert = {toggle: false, content: "", type: ""}

  async function onSignUp() {
      let blob = await fetch(`${url}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          email
        })
      });
      if (blob.status === 200) {
        let res = await blob.text();
        alert = {toggle: true, content: res, type: "success"}
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

<h2>SignUp</h2>
<form class="form">
  <Alert {...alert}/>
  <input bind:value="{username}" type="text" placeholder="username" />
  <input bind:value="{email}" type="email" placeholder="email" />
  <input bind:value="{password}" type="password" placeholder="password" />
  <button on:click|preventDefault="{onSignUp}">Submit</button>
</form>
