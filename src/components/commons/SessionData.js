const getCookie = (key) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + key + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
const getLoginData = () => {
	let loginData = getCookie('key');
    if(loginData != undefined)
    	loginData = JSON.parse(atob(loginData));
	return loginData;
}

export default getLoginData;