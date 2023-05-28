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

