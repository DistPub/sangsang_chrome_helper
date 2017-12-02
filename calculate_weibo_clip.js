var toSmallBtn = document.querySelector('[action-type="feed_list_media_toSmall"]');
var nav = document.querySelector('.WB_global_nav');
var msg = document.querySelector('#WB_webim');
var fold = document.querySelector('.W_fold');
var panel = document.querySelector('.mini_panel_area');

if (toSmallBtn)
    toSmallBtn.click();

if (nav) {
    nav.style.visibility = 'hidden';
    setTimeout(() => {nav.style.visibility = 'visible';}, 2000);
}

if (msg) {
    msg.style.visibility = 'hidden';
    setTimeout(() => {msg.style.visibility = 'visible';}, 2000);
}

if (fold) {
    fold.style.visibility = 'hidden';
    setTimeout(() => {fold.style.visibility = 'visible';}, 2000);
}

if (panel) {
    panel.style.visibility = 'hidden';
    setTimeout(() => {panel.style.visibility = 'visible';}, 2000);
}

var detailClip = document.querySelector('.WB_feed_detail').getBoundingClientRect();
var handleClip = document.querySelector('.WB_feed_handle').getBoundingClientRect();

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

var results = {
    clip: clip
};
console.log(results);
results;
