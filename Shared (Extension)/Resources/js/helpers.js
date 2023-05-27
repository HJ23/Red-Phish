const token = "pts_l62yrakfu3c6ezf56fh6jivzv2vcwjrf";
const badDomain = "737updatesboeing.com";

const API = {
    Domain: 'https://domain-intel.aws.us.pangea.cloud/v1/reputation',
    Url: 'https://url-intel.aws.us.pangea.cloud/v1/reputation',
    Ip: 'https://ip-intel.aws.us.pangea.cloud/v1/reputation',
    File: 'https://file-intel.aws.us.pangea.cloud/v1/reputation',
    User: 'https://user-intel.aws.us.pangea.cloud/v1/user/breached'
};

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
