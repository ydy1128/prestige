const throwError = (res, code) => {
    let errorState = {};
    let errorCode = 0;
    switch (code) {
        case 1:
	        errorCode = 400
	        errorState = { code, error: "INVALID ID" };
	        break;
        case 2:
	        errorCode = 403
	        errorState = { code, error: "NOT LOGGED IN" };
	        break;
        case 3:
	        errorCode = 404
	        errorState = { code, error: "NO RESOURCE" };
	        break;
        case 4:
	        errorCode = 403
	        errorState = { code, error: "PERMISSION FAILURE" };
	        break;
        case 5:
	        errorCode = 400
	        errorState = { code, error: "EMPTY CONTENTS" };
        default:
        	errorCode = 500;
        	errorState = {code, error: "INTERNAL SERVER ERROR"};

    }
    return res.status(errorCode).json(errorState)
}

export default throwError;