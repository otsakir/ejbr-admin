<script>


import {onMount} from 'svelte';
import {makeFetch} from '../../lib/network.js'
import {config} from '../../stores/UtilStore'

let rooms = '';
let rooms_filter = '';



function getRooms() {
	rooms = makeFetch('/api/muc_online_rooms_by_regex', {}, {service:$config.mucHost, regex:rooms_filter});
	console.log(rooms);
}

function filterTextKeyDown(event)  {
	if (event.key == 'Enter') {
		getRooms();
	}
}



onMount(() => {
	getRooms();
});

/* experimental debounce stuff

function delayedClick() {
	console.log("clicked!");
}

let timer;
function setTimer() {
	clearTimeout(timer);
	timer = setTimeout(function () {
		console.log("timeout!");
	}, 1000);
}

function setDebounce(f, timeout) {
	let timer;
	clearTimeout(timer);
	timer = setTimeout(f, timeout);
}
*/

</script>



<!--<button on:click={setTimer}>Delayed click</button>-->


<div class="container mx-auto">
 
	<h3 class="text-xl py-2">Rooms</h3>

	<div class="flex flex-row-reverse my-4">
		<button on:click={getRooms} class="btn">Reload</button>
		<input bind:value={rooms_filter} type="text" placeholder="Type room filter (regex)" class="input input-bordered w-full max-w-xs mx-2" on:keydown={filterTextKeyDown} />
	</div>

	{#await rooms}
		Loading rooms...
	{:then rooms}

		<div class="overflow-x-auto">
		  <table class="table">
		    <!-- head -->
		    <thead>
		      <tr>
		        <th>Room</th>
		        <th>Public</th>
		        <th>Participants</th>
		      </tr>
		    </thead>
		    <tbody>
		    			{#each rooms as room (room.jid)}
				      <tr>
				        <td><a class="link link-hover" href={"/rooms/"+room.jid}>{room.jid}</a></td>
				        <td>{room.public=="true" ? "yes": "no"}</td>
				        <td>{room.participants}</td>
				      </tr>

							{/each}
		    </tbody>
		  </table>
		</div>


	{:catch error}
		<p>error loadin rooms: {error}</p>
	{/await}

<!--
	<h3>Go to an arbitrary room</h3>
	<a href="/rooms/fuckroom">Fuck room</a>

-->


</div>