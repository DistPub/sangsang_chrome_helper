function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}

function getFileNameByURL(url) {
    return url.replace(/.+:\/\//, '').replace(/[\/\?]/g, '_');
}

function captureScreenshotHandler(tab, results) {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
    }

    var dataURL = 'data:image/png;base64,' + results.data;

    if (localStorage.settings_download === 'true') {
        var filename = getFileNameByURL(tab.url) + '.png';
        console.log(filename);

        chrome.downloads.download({
            url: URL.createObjectURL(dataURItoBlob(dataURL)),
            filename: filename
        });
    }

    if (localStorage.settings_open === 'true') {
        var extensionTabId = null;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
            if (tabId != extensionTabId || changedProps.status != "complete")
                return;

            chrome.tabs.onUpdated.removeListener(listener);

            var views = chrome.extension.getViews({
                tabId: extensionTabId
            });

            var view = views[0];
            view.document.querySelector('img').setAttribute('src', dataURL);
        });

        chrome.tabs.create({url: 'screenshot.html'}, function (tab) {
            extensionTabId = tab.id;
        });
    }

    if (localStorage.settings_copy === 'true') {
        var extension = chrome.extension.getBackgroundPage();
        var clipboard = extension.document.querySelector('#clipboard');
        clipboard.value = dataURL;
        clipboard.select();
        extension.document.execCommand('copy');
    }

    chrome.debugger.detach({tabId: tab.id});
}

function captureWeiBo(tab) {
    chrome.tabs.executeScript(null, {file: "calculate_weibo_clip.js"}, function (results) {
        var clip = results[0];
        clip.width += 80;
        clip.height += 30;
        clip.scale = 1;

        chrome.debugger.sendCommand(
            {tabId: tab.id},
            'Page.captureScreenshot',
            {clip: clip},
            captureScreenshotHandler.bind(this, tab)
        );
    });
}

function attachHandler(tab) {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
    }

    setTimeout(captureWeiBo.bind(this, tab), 1000);
}

function clickedHandler(tab) {
    chrome.debugger.attach({tabId: tab.id}, '1.2', attachHandler.bind(this, tab));
}

chrome.browserAction.onClicked.addListener(clickedHandler);
