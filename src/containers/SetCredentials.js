

export function getAuthHeader(){

    let user =localStorage.getItem("user");
    let password = localStorage.getItem("pass");
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + Buffer.from(user + ":" + password).toString('base64'));
    return headers;
}

