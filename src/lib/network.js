import {goto} from '$app/navigation'


export async function makeFetch(url, options, body) {

	// options.nologin : do not redirect to /login in case we get an authentication error


	let response;

	if (body) 
		response = await fetch(url, {
			mode: "cors",
			method: "POST",
			body: JSON.stringify(body)
		});
	else
		response = await fetch(url, {
			mode: "cors",
			method: "GET",
		});

	console.log("response status:", response.status);
	if (response.status == 401) {
		if (options.nologin)
			return "Status 401 - auth failed";
		else {
			goto("/login");
			throw "error 401";
		}
		

	} else
	if (response.status == 200) {
		return response.json();
		//return "200 OK";

	} else {
		return "error ?";
	}

	// try {
	// 	console.log(response);
	// 	const data = await response.json();
	// 	return "Success"; // data;
	// } catch {
	// 	return "error";
	// }	

}