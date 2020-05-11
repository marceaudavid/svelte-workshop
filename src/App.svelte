<script>
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import Chat from './pages/Chat.svelte';
  import router, { route } from './router.js';
  import { onMount } from 'svelte';

  onMount(() => {
    route.set(window.location.pathname);
  });

  function onSignChange(event) {
    signedIn = event.detail;
  }
</script>

<main>
  <svelte:component this="{router[$route]}" />
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
