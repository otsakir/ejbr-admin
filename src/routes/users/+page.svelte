<script>

import {onMount} from 'svelte';
import {makeFetch} from '../../lib/network.js'
import {config} from '../../stores/UtilStore.js'

let users = '';
let newUserName = '';
let newUserPassword = '';

function init() {
	getUsers();
	newUserName = '';
	newUserPassword = '';
}

function getUsers() {
	users = makeFetch('/api/registered_users', {}, {host: $config.ejabberdVirtualHost});
}

function removeUser(username) {
	makeFetch('/api/unregister', {}, {user: username, host: $config.ejabberdVirtualHost})
	.then(()=>{getUsers()});
}


const usernameRegex = new RegExp('^[a-z][a-z_]+$');
function validUsername(username) {
	const result = usernameRegex.test(username);
	console.log(result);
	return result;

}

function addUser(username, password) {
	makeFetch('/api/register', {}, {user: username, password: password, host: $config.ejabberdVirtualHost})
	.then(()=>{
		init();
	});

}


onMount(() => {
	init();
});


</script>

<div class="container mx-auto">

	<!-- breadcrumbs -->
	<div class="text-sm breadcrumbs">
	  <ul>
	    <li><a href="/">Home</a></li>  
	    <li>Users</li>
	  </ul>
	</div>

	<div class="flex gap-8 justify-between">
		<div>
			<h1 class="text-3xl py-4 font-semibold">Users</h1>
		</div>

		<div class="flex flex-row-reverse my-4">
			<button on:click={getUsers} class="btn">Reload</button>
		</div>		
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
		        <th></th>
		        <th></th>
		      </tr>
		    </thead>
		    <tbody>

		    	{#each users as user, i}

				      <!-- row 1 -->
				      <tr>
				        <td>{user}</td>
				        <td></td>
				        <td class="flex flex-row-reverse">
				        	<button class="btn btn-square" on:click={removeUser(user)}>
				        		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
				        	</button>
				        </td>
				      </tr>

				{/each}
		    </tbody>
		  </table>
		</div>

	{:catch error}
	<p>error logging in: {error}</p>
	{/await}

	<h3 class="text-xl py-2 font-semibold">New</h3>

	<div class="flex justify-between gap-2">

		<label class="input input-bordered flex items-center gap-2">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
		  <input bind:value={newUserName} type="text" class="grow" placeholder="Username" />
		  <input bind:value={newUserPassword} type="password" class="grow" placeholder="Password" />
		</label>

		<button disabled={!validUsername(newUserName)}  class="btn btn-square disabled:opacity-30" on:click={addUser(newUserName, newUserPassword)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
		</button>

	</div>






</div>



