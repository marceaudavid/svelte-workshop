<script>
  export let ws;
  let message;
  let messages = [];

  function onSendMsg() {
    ws.send(message);
    message = '';
  }

  ws.addEventListener('message', msg => {
    messages = [...messages, msg.data];
  });
</script>

<h2>GoChat</h2>
<form id="chat-form">
  <input bind:value="{message}" />
  <button on:click|preventDefault="{onSendMsg}">Submit</button>
</form>
<ul class="messages">
  {#each messages as item}
  <li>{item}</li>
  {/each}
</ul>
