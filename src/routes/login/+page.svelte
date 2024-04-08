<script>

import {goto} from '$app/navigation';
import {user} from '../../stores/UtilStore';
import {makeFetch} from '../../lib/network.js' 


function gotoUsers() {
	goto('/users');
}


// returns a promise that resolves or gets rejected with error message
function tryLogin() {
	console.log("making fetch...");
	$user.username = '';
	loginResult = makeFetch("http://localhost/auth/login", {nologin: true}, {username:username, password:password});
	loginResult.then(function () {
		console.log("got login result");
		$user.username = username;
		goto('/');
	});
}

let loginResult = '';
let username = '';
let password = '';

</script>



<h3>Login page</h3>

<a href="/rooms">Rooms</a>



<!--
<script>

import {user} from '../stores/UtilStore'
import {makeFetch} from '../lib/network.js' 

let headers = new Headers();
let loginResult = '';
let username = '';
let password = '';

// $: authHeader = 'Basic ' + btoa($user.username + ":" + $user.password); //  "admin@chat.retalia.org:Hai5ieb4eKae7loo")

//headers.set('Authorization', authHeader);
//headers.append('Content-Type', 'application/json');



// returns a promise that resolves or gets rejected with error message
function tryLogin() {
	console.log("making fetch...");
	$user.username = '';
	loginResult = makeFetch("http://localhost/auth/login", {nologin: true}, {username:username, password:password});
	loginResult.then(function () {
		console.log("got login result");
		$user.username = username;
		push('/');
	});
}



</script>





-->


Username<br>
<input bind:value={username} /> <br/>

Password<br>
<input bind:value={password} /> <br/>

<button on:click={tryLogin}>Try login</button> <br/>


{#await loginResult}
	Loading registered users...
{:then result}
	Result: {result}
{:catch error}
	<p>error logging in: {error}</p>
{/await}


