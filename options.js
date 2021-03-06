function loadSettings() {
    var download = localStorage.settings_download ? JSON.parse(localStorage.settings_download) : false;
    var open = localStorage.settings_open ? JSON.parse(localStorage.settings_open) : true;
    var copy = localStorage.settings_copy ? JSON.parse(localStorage.settings_copy) : false;

    document.querySelector('#download').checked = download;
    document.querySelector('#open').checked = open;
    document.querySelector('#copy').checked = copy;
}

function downloadChangeHandler() {
    localStorage.settings_download = document.querySelector('#download').checked;
}

function openChangeHandler() {
    localStorage.settings_open = document.querySelector('#open').checked;
}

function copyChangeHandler() {
    localStorage.settings_copy = document.querySelector('#copy').checked;
}

function initSettings() {
    document.querySelector('#download').onchange = downloadChangeHandler;
    document.querySelector('#open').onchange = openChangeHandler;
    document.querySelector('#copy').onchanage = copyChangeHandler;
}

function saveSettings() {
    downloadChangeHandler();
    openChangeHandler();
    copyChangeHandler();
}

function loadHandler() {
    loadSettings();
    initSettings();
    saveSettings();
}

window.onload = loadHandler;
