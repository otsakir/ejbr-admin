<script>


import {onMount} from 'svelte';
import {makeFetch} from '../../lib/network.js'

let rooms = '';
let rooms_filter = '';


function getRooms() {
	rooms = makeFetch('http://localhost/api/muc_online_rooms_by_regex', {}, {service:"conference.chat.retalia.org", regex:rooms_filter});
	// rooms.then((r) => {
	// 	console.log("got rooms response");
	// 	//rooms = r;
	// });

	console.log(rooms);
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

<h3>This is rooms page</h3>


<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
      <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Slow-carb next level shoindxgoitch ethical authentic, scenester sriracha forage.</h1>
      <button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">Button</button>
    </div>
  </div>
</section>


<!--<button on:click={setTimer}>Delayed click</button>-->


<div class="container mx-auto">
 
	<h3>Rooms</h3>

	<p>
		<input bind:value={rooms_filter} placeholder="room filter (regex)"> <button on:click={getRooms}>Reload</button> <br/>
	</p>

	{#await rooms}
		Loading rooms...
	{:then rooms}
		<div class="flex flex-col">
		  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
		    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
		      <div class="overflow-hidden">
		        <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
			          <thead
			            class="border-b border-neutral-200 font-medium dark:border-white/10">
			            <tr>
			              <th scope="col" class="px-6 py-3">Room</th>
			              <th scope="col" class="px-6 py-3">Public</th>
			              <th scope="col" class="px-6 py-3">CRAP</th>
			            </tr>
			          </thead>
			          <tbody>
						{#each rooms as room (room.jid)}
							<!--<li><a href={"/rooms/"+{room.jid}</a>, {room.public=="true" ? "public": "private"} ({room.participants})</li>-->
							<tr class="border-b border-neutral-200 dark:border-white/10">
				              <td class="whitespace-nowrap px-6 py-3"><a href={"/rooms/"+room.jid}>{room.jid}</a></td>
				              <td class="whitespace-nowrap px-6 py-3">{room.public=="true" ? "yes": "no"}</td>
				              <td class="whitespace-nowrap px-6 py-3">CRAP</td>
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

	<h3>Go to an arbitrary room</h3>
	<a href="/rooms/fuckroom">Fuck room</a>


</div>