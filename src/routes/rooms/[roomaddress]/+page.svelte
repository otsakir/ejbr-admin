<script>

import {makeFetch} from '../../../lib/network.js'
import {onMount} from 'svelte'
import {config} from '../../../stores/UtilStore.js'

export let data;
$: room_name = roomName();

export let params = {};
let room_options ={};
let room_options_copy = {};
let room_options_promise = {};
let affiliations = '';



function roomName() {
	let parts = data.roomaddress.split("@"); 
	if (parts.length > 1)
		return parts[0];
	return data.roomaddress;
}


// convert string "true"/"false" values to boolean true/false. Return result
function fixBooleanInObject(o) {
	let o2 = {};
	for (const property in o) {
		if (o[property] == "true")
			o2[property] = true;
		else
		if (o[property] == "false")
			o2[property] = false;
		else
			o2[property] = o[property];
	}

	console.log(o2);
	return o2;
}


function getRoomOptions() {
	room_options_promise = makeFetch('/api/get_room_options', {}, {name: room_name, service: $config.mucHost});
	room_options_promise.then((ro) => {
		room_options = fixBooleanInObject(ro);
		room_options_copy = {...room_options};
	});
	/*.then((ro) => {
		console.log("Got room options", ro );
		room_options = ro;
	});
	*/
}

function getRoomAffiliations() {
	affiliations = makeFetch('/api/get_room_affiliations', {}, {name: room_name, service: $config.mucHost});
}

function updateRoomOption(option, value) {
	if (value != room_options_copy[option]) {
		makeFetch('/api/change_room_option', {}, {name: room_name, service:$config.mucHost, option: option, value: value})
		.catch((error) => {
			console.log("error updatin room option ", option, ":", error);
		});
	} else {
		console.log("option ", option, " hasn't changed. Server won't be updated");
	}
}

// curl  -X POST -H "Content-Type: application/json"  --data '{"name":"retalia-room","service":"conference.chat.retalia.org"}' --user "admin@chat.retalia.org:Hai5ieb4eKae7loo"   http://chat.retalia.org:5280/api/get_room_affiliations

function reload() {
	getRoomOptions();
	getRoomAffiliations();	
}

onMount(() => {
	reload();
});

function roleSelectChanged(aff) {
	console.log("roleSelectChanged", aff);
	// 	curl  -X POST -H "Content-Type: application/json"  --data '{"name":"retalia-room","service":"conference.chat.retalia.org", "jid": "otsakir@chat.retalia.org","affiliation":"member"}' --user "admin@chat.retalia.org:Hai5ieb4eKae7loo"   http://chat.retalia.org:5280/api/set_room_affiliation
	
	makeFetch('/api/set_room_affiliation', {}, {name: room_name, service: $config.mucHost, jid: aff.username+"@"+aff.domain, affiliation:aff.affiliation})
	.catch((error) => {
		console.log("error updating user affiliation");
	});
	
}


</script>


<div class="container mx-auto">

	<p>Room name is {data.roomaddress}</p>


	<div class="flex flex-row-reverse my-4">
		<button on:click={reload} class="btn">Reload</button>
	</div>



	<h3 class="text-xl py-2">Room members</h3>
	{#await affiliations}
		Loading affiliations...
	{:then affiliations}

		<div class="overflow-x-auto">
		  <table class="table">
		    <!-- head -->
		    <thead>
		      <tr>
		        <th>Userame</th>
		        <th>Role</th>
		      </tr>
		    </thead>
		    <tbody>
		    		{#each affiliations as aff (aff.username)}
				      <tr>
				        <td>{aff.username}</td>
				        <td>
					        <select bind:value={aff.affiliation} on:change={roleSelectChanged(aff)}  class="select w-full max-w-xs">
							  <option value="owner">owner</option>
							  <option value="member">member</option>
							  <option value="none">none (just guest)</option>
							</select>
						</td>
				      </tr>
					{/each}
		    </tbody>
		  </table>
		</div>

	{:catch error}
		Error getting affiliations
	{/await}



	<h3 class="text-xl py-2">Room options</h3>
	{#await room_options_promise}
		Loading room details...
	{:then}
		<div class="overflow-x-auto">
		  <table class="table">
		    <!-- head -->
		    <thead>
		      <tr>
		        <th>Option</th>
		        <th>Value</th>
		      </tr>
		    </thead>
		    <tbody>
				<tr>
					<td>Title</td>
					<td>
						<input bind:value={room_options.title} on:blur={()=>updateRoomOption('title', room_options.title)} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</td>
				</tr>
				<tr>
					<td>Description</td>
					<td>
						<!--<input bind:value={room_options.description} on:blur={()=>updateRoomOption('description', room_options.description)} type="text" placeholder="Room description" class="input input-bordered w-full max-w-xs" /> -->
						<textarea bind:value={room_options.description} on:blur={()=>updateRoomOption('description', room_options.description)} class="textarea textarea-bordered w-full max-w-xs" placeholder="Room description"></textarea>
					</td>
				</tr>

				<!-- public -->
				<tr>
					<td>Public</td> <!-- public -->	
					<td>
						<input bind:checked={room_options.public} on:change={()=>updateRoomOption('public', room_options.public ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>					

				<tr>
					<td>Can edit subject</td> <!-- allow_change_subj -->	
					<td>
						<input bind:checked={room_options.allow_change_subj} on:change={()=>updateRoomOption('allow_change_subj', room_options.allow_change_subj ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>	

				<tr>
					<td>Allow query users</td> <!-- allow_query_users -->	
					<td>
						<input bind:checked={room_options.allow_query_users} on:change={()=>updateRoomOption('allow_query_users', room_options.allow_query_users ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>	

				<tr>
					<td>Allow private messages</td> <!-- allow_private_messages -->	
					<td>
						<input bind:checked={room_options.allow_private_messages} on:change={()=>updateRoomOption('allow_private_messages', room_options.allow_private_messages ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>				

				<!--
					allow_private_messages_from_visitors 	anyone
				-->
				
				<tr>
					<td>Allow visitor status</td> <!-- allow_visitor_status -->
					<td>
						<input bind:checked={room_options.allow_visitor_status} on:change={()=>updateRoomOption('allow_visitor_status', room_options.allow_visitor_status ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Allow visitor change nickname</td> <!-- allow_visitor_nickchange -->
					<td>
						<input bind:checked={room_options.allow_visitor_nickchange} on:change={()=>updateRoomOption('allow_visitor_nickchange', room_options.allow_visitor_nickchange ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Public list</td> <!-- public_list -->
					<td>
						<input bind:checked={room_options.public_list} on:change={()=>updateRoomOption('public_list', room_options.public_list ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>	

				<tr>
					<td>Persistent</td> <!-- persistent -->
					<td>
						<input bind:checked={room_options.persistent} on:change={()=>updateRoomOption('persistent', room_options.persistent ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Moderated</td> <!-- moderated -->
					<td>
						<input bind:checked={room_options.moderated} on:change={()=>updateRoomOption('moderated', room_options.moderated ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Protected with captcha</td> <!-- captcha_protected -->
					<td>
						<input bind:checked={room_options.captcha_protected} on:change={()=>updateRoomOption('captcha_protected', room_options.captcha_protected ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Members by default</td> <!-- members_by_default -->
					<td>
						<input bind:checked={room_options.members_by_default} on:change={()=>updateRoomOption('members_by_default', room_options.members_by_default ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Members only</td> <!-- members_only -->
					<td>
						<input bind:checked={room_options.members_only} on:change={()=>updateRoomOption('members_only', room_options.members_only ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>		
				
				<tr>
					<td>Allow user invites</td> <!-- allow_user_invites -->
					<td>
						<input bind:checked={room_options.allow_user_invites} on:change={()=>updateRoomOption('allow_user_invites', room_options.allow_user_invites ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Allow subscription</td> <!-- allow_subscription -->
					<td>
						<input bind:checked={room_options.allow_subscription} on:change={()=>updateRoomOption('allow_subscription', room_options.allow_subscription ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Password protected</td> <!-- password_protected -->
					<td>
						<input bind:checked={room_options.password_protected} on:change={()=>updateRoomOption('password_protected', room_options.password_protected ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>

				<tr>
					<td>Password</td>
					<td>
						<input bind:value={room_options.password} on:blur={()=>updateRoomOption('password', room_options.password)} type="password" placeholder="Type password" class="input input-bordered w-full max-w-xs" />
					</td>
				</tr>	

				<tr>
					<td>Anonymous</td> <!-- anonymous -->
					<td>
						<input bind:checked={room_options.anonymous} on:change={()=>updateRoomOption('anonymous', room_options.anonymous ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>	

				<!--
				presence_broadcast 	[moderator,participant,visitor]
				-->						
																						
				<tr>
					<td>Allow voice requests</td> <!-- allow_voice_requests -->
					<td>
						<input bind:checked={room_options.allow_voice_requests} on:change={()=>updateRoomOption('allow_voice_requests', room_options.allow_voice_requests ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>


				<tr>
					<td>Voice request interval</td> <!-- voice_request_min_interval -->
					<td>
						<input bind:value={room_options.voice_request_min_interval} on:blur={()=>updateRoomOption('voice_request_min_interval', room_options.voice_request_min_interval.toString())} type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</td>
				</tr>

				<tr>
					<td>Max users</td> <!-- max_users -->
					<td>
						<input bind:value={room_options.max_users} on:blur={()=>updateRoomOption('max_users', room_options.max_users.toString())} type="number" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
					</td>
				</tr>	

				<tr>
					<td>Logging</td> <!-- logging -->
					<td>
						<input bind:checked={room_options.logging} on:change={()=>updateRoomOption('logging', room_options.logging ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>	

				<tr>
					<td>Message archiving</td> <!-- mam -->
					<td>
						<input bind:checked={room_options.mam} on:change={()=>updateRoomOption('mam', room_options.mam ? "true" : "false")} type="checkbox" class="toggle" />
					</td>
				</tr>	


				<!-- TODO - add the following
				vcard 	
				vcard_xupdate 	undefined
				captcha_whitelist 	{0,nil}
				pubsub 	
				enable_hats 	false
				lang 	en
				-->

						
		    </tbody>
		  </table>
		</div>	
	{:catch error}
		Error getting room options
	{/await}


</div>
