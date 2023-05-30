function queryById(name) {
    return document.getElementById(name)
}

function querySelector(selector) {
    return document.querySelector(selector)
}

function querySelectorAll(selector) {
    return document.querySelectorAll(selector)
}

function setToStorage(name, value, callback) {
    browser.storage.local.set({[name]: value}, callback)
}

function showScreen(name) {
    document.documentElement.setAttribute("presentedScreen", name);
}

function showDropdown(element) {
  var event;
  event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousedown', true, true, window);
  element.dispatchEvent(event);
};

function getCurrentTab() {
    return browser.tabs.query({ currentWindow: true, active: true })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkHashType(hash) {
   const sha256Regex = /^[a-f0-9]{64}$/i;
   const sha1Regex = /^[a-f0-9]{40}$/i;
   const md5Regex = /^[a-f0-9]{32}$/i;

   if (sha256Regex.test(hash)) {
       return 'sha256';
   } else if (sha1Regex.test(hash)) {
       return 'sha1';
   } else if (md5Regex.test(hash)) {
       return 'md5';
   } else {
       return 'Unknown';
   }
}

