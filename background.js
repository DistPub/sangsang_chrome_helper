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

function getWeiboURL(params, type) {
    function crc32(str) {
        str = String(str);
        var table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
        if (typeof(crc) == 'undefined') {
            crc = 0;
        }
        var x = 0,
            y = 0;
        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            y = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = '0x' + table.substr(y * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        return crc ^ (-1);
    }

    var url, zone, ext;
    var url_pre = 'http://ww';
    if (typeof(type) == 'undefined') type = 'bmiddle';
    if (params.pid[9] == 'w') {
        zone = (crc32(params.pid) & 3) + 1;
        url = url_pre + zone + '.sinaimg.cn/' + type + '/' + params.pid;
    } else {
        zone = ((params.pid.substr(-2, 2), 16) & 0xf) + 1;
        url = url_pre + zone + '.sinaimg.cn/' + type + '/' + params.pid;
    }
    return url + params.ext;
}

async function captureScreenshotHandler(tab, results) {
    chrome.debugger.detach({tabId: tab.id});
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
    }

    var dataURL = 'data:image/png;base64,' + results.data;

    var download = localStorage.settings_download ? JSON.parse(localStorage.settings_download) : false;
    var open = localStorage.settings_open ? JSON.parse(localStorage.settings_open) : true;
    var copy = localStorage.settings_copy ? JSON.parse(localStorage.settings_copy) : false;

    if (download) {
        var filename = getFileNameByURL(tab.url) + '.png';
        console.log(filename);

        chrome.downloads.download({
            url: URL.createObjectURL(dataURItoBlob(dataURL)),
            filename: filename
        });
    }

    if (open) {
        var form = new FormData();
        form.append('b64_data', results.data);

        var response = await fetch("http://picupload.service.weibo.com/interface/pic_upload.php?ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog", {
            method: "POST",
            body: form,
            credentials: 'include'
        });
        var text = await response.text();

        try {
            var splitIndex = text.indexOf('{"');
            rs = JSON.parse(text.substring(splitIndex));
            console.log(rs);

            var params = {
                pid: rs.data.pics.pic_1.pid,
                ext: '.jpg'
            };
            var imageUrl = getWeiboURL(params, 'large');
            console.log(imageUrl);

            var extensionTabId = null;

            chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
                if (tabId != extensionTabId || changedProps.status != "complete")
                    return;

                chrome.tabs.onUpdated.removeListener(listener);

                var views = chrome.extension.getViews({
                    tabId: extensionTabId
                });

                var view = views[0];
                view.document.querySelector('img').setAttribute('src', imageUrl);
            });

            chrome.tabs.create({url: 'screenshot.html'}, function (tab) {
                extensionTabId = tab.id;
            });
        } catch (error) {
            alert('上传失败，请登录微博后再试~');
            chrome.tabs.create({ url: 'http://weibo.com/?topnav=1&mod=logo' });
        }
    }

    if (copy) {
        var extension = chrome.extension.getBackgroundPage();
        var clipboard = extension.document.querySelector('#clipboard');
        clipboard.value = dataURL;
        clipboard.select();
        extension.document.execCommand('copy');
    }
}

function captureWeiBo(tab) {
    chrome.tabs.sendMessage(tab.id, {ul: tab.ul, type:'calculate'}, (response) => {
        console.log(response);

        if (!response) {
            chrome.debugger.detach({tabId: tab.id});
            alert('截图失败，请确认当前网页是微博的详情页面！\n点击微博的时间可打开微博详情页面~');
            return;
        }

        chrome.debugger.sendCommand(
            {tabId: tab.id},
            'Page.captureScreenshot',
            {clip: response.clip},
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

function messageHandler(request, sender, sendResponse) {
    if (request.type === 'capture') {
        sender.tab.ul = request.ul;
        chrome.debugger.attach({tabId: sender.tab.id}, '1.2', attachHandler.bind(this, sender.tab));
    }
}

chrome.runtime.onMessage.addListener(messageHandler);
