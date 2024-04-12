<script>


import {onMount} from 'svelte';
import {makeFetch} from '../../lib/network.js'
import {config} from '../../stores/UtilStore'
import * as utils from '$lib/utils.js'

let rooms = '';
let rooms_filter = '';
let newRoomName;



function getRooms() {
	rooms = makeFetch('/api/muc_online_rooms_by_regex', {}, {service:$config.mucHost, regex:rooms_filter});
	console.log(rooms);
}

function filterTextKeyDown(key,f)  {
	if (key == 'Enter') {
		f();
	}
}

const usernameRegex = new RegExp('^.+$');
function validRoomName(roomname) {
	const result = usernameRegex.test(roomname);
	console.log(result);
	return result;

}

function addRoom(name) {
	if (validRoomName(newRoomName))
		makeFetch('/api/create_room', {}, {name: name, service: $config.mucHost, host: $config.ejabberdVirtualHost})
		.then(()=>{
			init();
		});
}

function removeRoom(name) {
	makeFetch('/api/destroy_room', {}, {name: name, service: $config.mucHost})
	.then(()=>{
		init();
	});	
}


function init() {
	getRooms();	
	newRoomName = '';
}

onMount(() => {
	init();
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
 
 	<!-- breadcrumbs -->
	<div class="text-sm breadcrumbs">
	  <ul>
	    <li><a href="/">Home</a></li>  
	    <li>Rooms</li>
	  </ul>
	</div>


	<div class="flex gap-8 justify-between">
		<div>
			<h1 class="text-3xl py-4 font-semibold">Rooms</h1>
		</div>

		<div class="flex flex-row-reverse my-4">
			<button on:click={getRooms} class="btn">Reload</button>
			<input bind:value={rooms_filter} type="text" placeholder="Type room filter (regex)" class="input input-bordered w-full max-w-xs mx-2" on:keydown={(event)=>{filterTextKeyDown(event.key, getRooms);}} />
		</div>		
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
		        <th></th>
		      </tr>
		    </thead>
		    <tbody>
		    			{#each rooms as room (room.jid)}
				      <tr>
				        <td><a class="link link-hover" href={"/rooms/"+room.jid}>{utils.roomFirstName(room.jid)}</a></td>
				        <td>{room.public=="true" ? "yes": "no"}</td>
				        <td>{room.participants}</td>
				        <td class="flex flex-row-reverse">
				        	<button class="btn btn-square" on:click={removeRoom(utils.roomFirstName(room.jid))}>
				        		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
				        	</button>
				        </td>
				      </tr>

							{/each}
		    </tbody>
		  </table>
		</div>


	{:catch error}
		<p>error loadin rooms: {error}</p>
	{/await}

	<h3 class="text-xl py-2 font-semibold mt-4">New</h3>

	<div class="flex justify-between gap-2">

<!--
		<label class="input input-bordered flex items-center gap-2">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
		</label>
	-->

		<input bind:value={newRoomName} on:keydown={(event)=>{filterTextKeyDown(event.key, ()=>{addRoom(newRoomName)});}} type="text" class="input input-bordered w-full max-w-xs" placeholder="room name" />

		<button disabled={!validRoomName(newRoomName)}  class="btn btn-square disabled:opacity-30" on:click={addRoom(newRoomName)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>

	</div>


</div>