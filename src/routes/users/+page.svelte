<script>

import {onMount} from 'svelte';
import {makeFetch} from '../../lib/network.js'

let users = '';

function getUsers() {
	users = makeFetch('http://localhost/api/registered_users', {}, {host: "chat.retalia.org"});
}

onMount(() => {
	getUsers();
});


</script>


<h3>Registered Users</h3>



{#await users}
	Loading registered users...
{:then users}
	<ul>
		{#each users as user}
		<li>{user}</li>
		{/each}
	</ul>

{:catch error}
	<p>error logging in: {error}</p>
{/await}

<p>
	<button on:click={getUsers}>Reload</button> <br/>
</p>