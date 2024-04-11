import {writable} from 'svelte/store'

export const count = writable(5);

export const user = writable({
	username: ''
});

export const config = writable({
	mucHost: "localhost",	// conference.chat.retalia.org
	ejabberdVirtualHost: "localhost" 	// chat.retalia.org
});

