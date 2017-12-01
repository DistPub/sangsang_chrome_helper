var toSmallBtn = document.querySelector('[action-type="feed_list_media_toSmall"]');

if (toSmallBtn)
    toSmallBtn.click();

var detailClip = document.querySelector('.WB_feed_detail').getBoundingClientRect();
var handleClip = document.querySelector('.WB_feed_handle').getBoundingClientRect();
var clip = {
    x: scrollX + detailClip.x,
    y: scrollY + detailClip.y,
    width: detailClip.width,
    height: detailClip.height + handleClip.height
};
var results = {
    clip: clip,
    devicePixelRatio: devicePixelRatio
};
results;
