import {writable} from 'svelte/store'

export const count = writable(5);

export const user = writable({
	username: ''
});

