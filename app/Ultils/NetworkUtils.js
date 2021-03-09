import NetInfo from "@react-native-community/netinfo";

import RNFetchBlob from 'rn-fetch-blob'


export function addNetworkCheckListener(callback) {
    NetInfo.addEventListener(callback);
}



export function isNetworkAvailable(callback) {
    NetInfo.fetch().then(state => {
        callback(state);
    });
}

export function call(url, data) {
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Accept', "application/json");
    var body = buildBody(data);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };

    return fetch(url, requestOptions).then(response => {
            // is this a network error?
            if (!response) {
                console.log('api network error', "", "raw")
                return;
            }

            // response status "OK"?
            if (response.status == 200) {
                // note that if deserializing fails, we will land in the catch clause
                return response.json();
            }

            // bad HTTP status
            console.log('api response not ok', response.status, "GetResultatEviction", "raw");

        })
        .catch(error => {
            console.log(error);
            throw error;
        });

}

export function getFileContent(url, data) {
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Accept', "application/json");
    var body = buildBody(data);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };

    return fetch(url, requestOptions).then(response => {
            // is this a network error?
            if (!response) {
                console.log('api network error', "", "raw")
                return;
            }

            // response status "OK"?
            if (response.status == 200) {
                // note that if deserializing fails, we will land in the catch clause
                return response.text();
            }

            // bad HTTP status
            console.log('api response not ok', response.status, "GetResultatEviction", "raw");

        })
        .catch(error => {
            console.log(error);
            throw error;
        });

}

function buildBody(dataParams) {
    /*	var p =
        {
            languageID: getLanguageID(),
            version: apiVersion,
            data: dataParams
        };*/
    var p = dataParams;
    //p.clientversion = '100';
    // TODO: return client token for API level security
    return JSON.stringify(p);
}

// function to download file
export function downloadFile(link, data) {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir; // this is the pictures directory. You can check the available directories in the wiki.
    var date = new Date();
    let options = {
        fileCache: true,
        addAndroidDownloads: {
            useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification: true,
            path: PictureDir + "/guestReport_" + Math.floor(date.getTime() + date.getSeconds() / 2) + ".pdf", // this is the path where your downloaded file will live in
            description: 'Downloading Report.'
        }
    };

    var body = buildBody(data);
    var requestOptions = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        body: body,
    };
    return config(options).fetch('GET', link, requestOptions).then((res) => {
        var responseStatus = res.status;

        // status OK?
        if (responseStatus === 200) {
            var contentType = response.headers.get('content-type');

            // expected content types for download: 'application/pdf' or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            if (contentType.startsWith('application/')) {
                // fetch filename from content disposition header
                var contentDisposition = response.headers.get('content-disposition'),
                    m;
                response.headers.forEach(element => {
                    var test = element;
                });

                return res.blob();
            }
        }
    });
}