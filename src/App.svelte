<script>
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import Chat from './pages/Chat.svelte';
  import router from './router.js';
  import { route } from './store/store.js';
  import { onDestroy } from 'svelte';

  let component;

  const unsubscribe = route.subscribe((value) => {
    component = router[$route];
  });

  onDestroy(unsubscribe);
</script>

<main>
  <svelte:component this="{component}" />
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
