const throwError = (silent, data, error, message) =>{
    let $toastContent;
    let message_head = '<span style="color: #FFB4BA">';
    let message_tail = '</span>';
    let default_message = '';
    if(!silent){
        console.log(error.code)
        switch(error.code){
            case 0: // 클라이언트 버그, try / catch
                default_message = '클라이언트 에러. <br />관리자에게 문의하세요.';
                console.log(error.lineNumber)
                break;
            case 400: // 일반적인 요청실패
                default_message = '입력하신 정보가 잘못되었습니다.';
                break
            case 401: // 리소스 접근 권한을 가지고 있지 않다
                default_message = '세션이 만료 되었습니다. <br />로그인 하세요.';
                setTimeout(()=> {location.reload(false);}, 2000);
                break;
            case 403: // 감춰진 리소스에 접근하려 할 때
                default_message = '해당 자료에 대해 권한이 없습니다.';
                setTimeout(()=> {location.reload(false);}, 2000);
                break;
            case 404: // URI와 매치되는 리소스가 없다
            case 405: // 지원하지 않는 요청(예를 들어 POST 요청을 받는 컨트롤러 리소스에 GET 요청을 보낸다든가)
                default_message = '잘못된 접근입니다. <br />관리자에게 문의하세요.';
                break;
            case 409: // 리소스 상태에 의하여 해당 요청 자체를 수행할 수 없는 경우 (이미 삭제된 리소스를 또 삭제한다든가 비어있는 리스트에서 무언가를 요청한다든가)
                default_message = '해당 자료('+data+')가 존재하지 않습니다.';
                break;
            default: // case 500: 일반적인 서버 에러;
                default_message = '서버 에러. <br />관리자에게 문의하세요.';
                break;
        }
    }
    if(message == undefined || message == '')
        message = default_message;
    $toastContent = message_head + message + message_tail;
    Materialize.toast($toastContent, 2000);
    return false;
}

export default throwError;