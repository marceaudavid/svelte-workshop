<script>
  import Signin from "./pages/Signin.svelte"
  import Signup from "./pages/Signup.svelte"
  import Chat from "./pages/Chat.svelte"

  let signedIn = false
  let url = `https://backend.cleverapps.io`
  let ws = new WebSocket(`ws://backend.cleverapps.io`);

  function onSignChange(event) {
    signedIn = event.detail
  }
</script>

<main>
  {#if !signedIn}
  <Signup url={url} />
  <Signin url={url} ws={ws} on:login={onSignChange}/>
  {/if}
  {#if signedIn}
  <Chat url={url} ws={ws} on:logout={onSignChange}/>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>