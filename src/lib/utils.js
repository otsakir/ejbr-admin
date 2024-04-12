

export function roomFirstName(fullname) {
	let parts = fullname.split("@"); 
	if (parts.length > 1)
		return parts[0];
	return fullname;
}