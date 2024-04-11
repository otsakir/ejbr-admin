<script>

import {onMount} from 'svelte';
import {makeFetch} from '../../lib/network.js'
import {config} from '../../stores/UtilStore.js'

let users = '';

function getUsers() {
	users = makeFetch('/api/registered_users', {}, {host: $config.ejabberdVirtualHost});
}

onMount(() => {
	getUsers();
});


</script>

<div class="container mx-auto">

	<h3 class="text-xl py-2">Registered Users</h3>

	<div class="flex flex-row-reverse my-4">
		<button on:click={getUsers} class="btn">Reload</button>
	</div>

	{#await users}
		Loading registered users...
	{:then users}

		<div class="overflow-x-auto">
		  <table class="table">
		    <!-- head -->
		    <thead>
		      <tr>
		        <th>Username</th>
		        <th>Full name</th>
		        <th>Role</th>
		      </tr>
		    </thead>
		    <tbody>

		    	{#each users as user, i}

				      <!-- row 1 -->
				      <tr>
				        <td>{user}</td>
				        <td>Quality Control Specialist</td>
				        <td>Blue</td>
				      </tr>

				{/each}
		    </tbody>
		  </table>
		</div>

	{:catch error}
	<p>error logging in: {error}</p>
	{/await}


</div>



