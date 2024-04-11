<script>
  import "../app.css";
  import {afterNavigate} from '$app/navigation';

  let is_active = false;
  let current_url = '';

  function onUrlChanged(change) {
    console.log("IN onUrlChanged: ", change.to.route.id);
    current_url = change.to.route.id;
  }


  afterNavigate(onUrlChanged);




</script>


<div class="navbar bg-base-100">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl">Chat Admin</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li class="px-2"><a href="/rooms" class:active={current_url=='/rooms'}>Rooms</a></li>
      <li class="px-2"><a href="/users" class:active={current_url=='/users'}>Users</a></li>
    </ul>
  </div>

<!--
  <div role="tablist" class="tabs tabs-boxed">
    <a role="tab" class="tab">Tab 1</a>
    <a role="tab" class="tab tab-active">Tab 2</a>
    <a role="tab" class="tab">Tab 3</a>
  </div>  
-->

</div>


<slot />

