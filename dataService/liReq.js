




export const makeGetRequest = function (url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
export const makePostRequest = function (url,data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
       
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        let jdata=JSON.stringify(data)
        xhr.send(jdata);
    });
}

export const getApiData = function (uri) {
    return makeGetRequest(uri)
     
};
export const postApiData = function (uri,data) {
   
    return makePostRequest(uri,data) 
};
export const postApiData2 = function (uri,data) {
    var fdata = new FormData();
    let props=Object.getOwnPropertyNames(data)
    for (var i = 0; i < props.length; i++) {
        fdata.append(props[i], data[props[i]]);
    }
    return makePostRequest(uri,fdata) 
};