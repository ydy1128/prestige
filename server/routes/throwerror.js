const throwError = (res, code, message) => {
    let errorState = {};
    switch (code) {
        case 400: // 일반적인 요청실패
	        errorState = { code, error: "BAD REQUEST", message: ""};
	        break;
        case 401: // 리소스 접근 권한을 가지고 있지 않다
	        errorState = { code, error: "UNAUTHORIZED", message: "Not logged in / Unauthorized user"};
	        break;
        case 403: // 감춰진 리소스에 접근하려 할 때
	        errorState = { code, error: "FORBIDDEN", message: "The information is not allowed to access"};
	        break;
        case 404: // URI와 매치되는 리소스가 없다
	        errorState = { code, error: "NOT FOUND", message: "No resource"};
	        break;
        case 405: // 지원하지 않는 요청(예를 들어 POST 요청을 받는 컨트롤러 리소스에 GET 요청을 보낸다든가)
	        errorState = { code, error: "METHOD NOT ALLOWED", message: "Wrong method call"};
	        break;
	    case 409: // 리소스 상태에 의하여 해당 요청 자체를 수행할 수 없는 경우 (이미 삭제된 리소스를 또 삭제한다든가 비어있는 리스트에서 무언가를 요청한다든가)
	        errorState = { code, error: "CONFLICT", message: "The resource is not available"};
	        break;
        default: // case 500: 일반적인 서버 에러;
        	errorState = { code, error: "INTERNAL SERVER ERROR", message: "Unknown server error"};
        	break;
    }
    if (message != undefined) 
    	errorState.message = message;
    console.error(errorState.message);
    return res.status(code).json(errorState);
}

export default throwError;