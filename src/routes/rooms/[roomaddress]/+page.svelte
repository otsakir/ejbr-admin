<script>

import {makeFetch} from '../../../lib/network.js'
import {onMount} from 'svelte'

export let data;
$: room_name = roomName();

export let params = {}
let room_options = {}

function roomName() {
	let parts = data.roomaddress.split("@"); 
	if (parts.length > 1)
		return parts[0];
	return data.roomaddress;
}


function getRoomOptions() {

	makeFetch('http://localhost/api/get_room_options', {}, {name: room_name, service: "conference.chat.retalia.org"}).then((ro) => {
		console.log("Got room options", ro );
		room_options = ro;
	});
}

onMount(() => {
	getRoomOptions();
});

</script>


<h3>Room details</h3>

<p>Room name is {data.roomaddress}</p>


<button on:click="{getRoomOptions}">Reload</button>

<h2>Room options</h2>
<ul>
	{#each Object.entries(room_options) as [key, value], index (key)}
			<li>{key} - {value}</li>
	{/each}
</ul>
