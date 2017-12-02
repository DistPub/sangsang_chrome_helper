function getWeiboCard(ul) {
    let current = ul;
    while (current.parentElement) {
        current = current.parentElement;

        if (current.classList.contains('WB_cardwrap') && current.classList.contains('WB_feed_type'))
            break;
    }
    return current;
}

function getClipByUlElement(ul) {
    var nav = document.querySelector('.WB_global_nav');
    var msg = document.querySelector('.webim_fold');
    var fold = document.querySelector('.W_fold');
    var panel = document.querySelector('.mini_panel_area');
    var delay = 3000;

    if (nav) {
        nav.style.visibility = 'hidden';
        setTimeout(() => {nav.style.visibility = 'visible';}, delay);
    }

    if (msg) {
        msg.style.visibility = 'hidden';
        setTimeout(() => {msg.style.visibility = 'visible';}, delay);
    }

    if (fold) {
        fold.style.visibility = 'hidden';
        setTimeout(() => {fold.style.visibility = 'visible';}, delay);
    }

    if (panel) {
        panel.style.visibility = 'hidden';
        setTimeout(() => {panel.style.visibility = 'visible';}, delay);
    }

    var detailClip = getWeiboCard(ul).querySelector('.WB_feed_detail').getBoundingClientRect();
    var handleClip = getWeiboCard(ul).querySelector('.WB_feed_handle').getBoundingClientRect();

    var dppx = window.devicePixelRatio ||
        (window.matchMedia && window.matchMedia("(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches? 2 : 1) ||
        1;

    var clip = {
        x: scrollX + detailClip.x,
        y: scrollY + detailClip.y,
        width: detailClip.width,
        height: detailClip.height + handleClip.height,
        scale: 1 / dppx
    };

    function getOS() {
      var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
      } else if (/Android/.test(userAgent)) {
        os = 'Android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
      }

      return os;
    }

    var os = getOS();

    if (os == 'Windows') {
        clip.x *= dppx;
        clip.y *= dppx;
    } else if (os == 'Mac OS') {
        var scale = 1.1;
        clip.x *= scale;
        clip.y *= scale;
        clip.width *= scale;
        clip.height *= scale;
    }

    return clip;
}

let id = 0;
let weibos = {};

function captureClickHandler(id) {
    chrome.runtime.sendMessage({ul: id, type:'capture'});
}

function arrowDownClickHandler(ul) {
    let capture = document.createElement('li');
    capture.innerHTML = '<a href="javascript:void(0);">桑桑网页助手截图</a>';
    weibos[++id] = ul;
    capture.onclick = captureClickHandler.bind(this, id);
    ul.prepend(capture);
    ul.classList.add('sangsang_inject');
}

document.querySelector('body').addEventListener('click', (e) => {
    if (e.target.classList.contains('ficon_arrow_down')) {
        let ul = e.target.parentElement.parentElement.querySelector('.layer_menu_list ul');

        if (ul.classList.contains('sangsang_inject')) {
            return;
        }

        arrowDownClickHandler(ul);
    }
});

function messageHandler(request, sender, sendResponse) {
    if (request.type === 'calculate') {
        let clip = getClipByUlElement(weibos[request.ul]);
        sendResponse({clip: clip});
    }
}

chrome.runtime.onMessage.addListener(messageHandler);
