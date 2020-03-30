<script>
  import { slide } from 'svelte/transition';
  import { backOut } from 'svelte/easing';

  export let type;
  export let content;
  export let toggle;
</script>

<style>
  .alert {
    color: white;
    font-family: inherit;
    font-size: inherit;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border-radius: 2px;
  }
  .success {
    background-color: green;
  }
  .error {
    background-color: red;
  }
</style>

{#if toggle}
<div class="alert {type}" transition:slide="{{delay: 250, duration: 300, easing: backOut }}">
  {content}
</div>
{/if}
