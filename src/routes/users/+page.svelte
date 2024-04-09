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
	<div class="flex flex-col">
	  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
	    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
	      <div class="overflow-hidden">
	        <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
		          <thead
		            class="border-b border-neutral-200 font-medium dark:border-white/10">
		            <tr>
		              <th scope="col" class="px-6 py-3">Username</th>
		              <th scope="col" class="px-6 py-3">Last</th>
		              <th scope="col" class="px-6 py-3">Handle</th>
		            </tr>
		          </thead>
		          <tbody>
					{#each users as user}
						<tr class="border-b border-neutral-200 dark:border-white/10">
			              <td class="whitespace-nowrap px-6 py-3">{user}</td>
			              <td class="whitespace-nowrap px-6 py-3">Otto</td>
			              <td class="whitespace-nowrap px-6 py-3">@mdo</td>
			            </tr>
					{/each}
				</tbody>
	        </table>
	      </div>
	    </div>
	  </div>
	</div>

{:catch error}
	<p>error logging in: {error}</p>
{/await}

<p>
	<button on:click={getUsers}>Reload</button> <br/>
</p>