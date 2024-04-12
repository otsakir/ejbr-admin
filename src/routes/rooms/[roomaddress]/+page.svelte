<script>

import {makeFetch} from '../../../lib/network.js'
import {onMount} from 'svelte'
import {config} from '../../../stores/UtilStore.js'
import * as utils from '$lib/utils.js'

export let data;
$: room_name = utils.roomFirstName(data.roomaddress);

export let params = {};
let room_options ={};
let room_options_copy = {};
let room_options_promise = {};
let affiliations = '';
let users = '';
let selectedUser = '';



function getUsers() {
	users = makeFetch('/api/registered_users', {}, {host: $config.ejabberdVirtualHost});
	users.then((userData)=>{
		if (userData.length > 0) selectedUser = userData[0];
	});
}

function addMember(member) {

	makeFetch('/api/set_room_affiliation', {}, {name: room_name, jid: member+'@'+$config.ejabberdVirtualHost, affiliation: 'member', service: $config.mucHost} )
	.then(()=>{
		getRoomAffiliations();
	});
}


// function roomFirstName(fullname) {
// 	let parts = fullname.split("@"); 
// 	if (parts.length > 1)
// 		return parts[0];
// 	return fullname;
// }


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
	getUsers();
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

	<!-- breadcrumbs -->
	<div class="text-sm breadcrumbs">
	  <ul>
	    <li><a href="/">Home</a></li>  
	    <li><a href="/rooms">Rooms</a></li>
	    <li>{data.roomaddress}</li>
	  </ul>
	</div>

	<div class="flex gap-8 justify-between">
		<div>
			<h1 class="text-3xl py-4 font-semibold">{data.roomaddress}</h1>
		</div>

		<div class="flex flex-row-reverse my-4">
			<button on:click={reload} class="btn">Reload</button>
		</div>		
	</div>

	
	<!-- members  heading -->
	<div class="mb-8"> 
		<h3 class="text-2xl font-bold pt-8">Μembers</h3>
		<hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
	</div>


	<!-- add members -->
	<div class="flex justify-between gap-2 mb-4"> 
		<select bind:value={selectedUser} class="select select-bordered w-full max-w-xs">
			{#await users}
				<option disabled selected>No users</option>
			{:then users}
				{#each users as user}
					<option value={user}>{user}</option>
				{/each}
			<!--{/await}-->
			{/await}
		</select>
		<button disabled={selectedUser==''} class="btn btn-square disabled:opacity-30" on:click={addMember(selectedUser)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
		</button>

	</div>


	<!-- members list -->
	{#await affiliations}
		Loading affiliations...
	{:then affiliations}
		<div class="overflow-x-auto">
		  <table class="table">
		    <!-- head -->
		    <thead>
		      <tr>
		        <th>Userame</th>
		        <th class="flex flex-row-reverse">Role for this room</th>
		      </tr>
		    </thead>
		    <tbody>
		    		{#if affiliations.length > 0}
			    		{#each affiliations as aff (aff.username)}
					      <tr>
					        <td>{aff.username}</td>
					        <td class="flex flex-row-reverse">
						        <select bind:value={aff.affiliation} on:change={roleSelectChanged(aff)}  class="select w-full max-w-xs">
								  <option value="owner">owner</option>
								  <option value="member">member</option>
								  <option value="none">none (just guest)</option>
								</select>
							</td>
					      </tr>
						{/each}
					{:else}
						<tr><td>No members</td></tr>
					{/if}
		    </tbody>
		  </table>
		</div>
	{:catch error}
		Error getting affiliations
	{/await}


	<!-- options heading -->
	<div class="mb-8"> 
		<h3 class="text-2xl font-bold pt-8">Options</h3>
		<hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700">
	</div>

	<!-- options table -->
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
