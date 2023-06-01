function show(platform, enabled) {
    document.querySelector("html").setAttribute("controlTabsPlatform", `${platform}`);
}

// MARK: - Custom

// Set Extension Name
const extensionName = "RedPhish: Detect Cyber Threats";

const nameAreas = document.querySelectorAll(".pastExtensionName");
for (const name of nameAreas) {
    name.innerHTML = extensionName;
}

// Activation Buttons
const activationButtons = document.querySelectorAll(".controlTabsPurpose_activation");
for (const button of activationButtons) {
    button.onclick = function() {
        document.querySelector("html").setAttribute("controlTabsPurpose", "activation");
    }
}

// Usage Buttons
const usageButtons = document.querySelectorAll(".controlTabsPurpose_usage");
for (const button of usageButtons) {
    button.onclick = function() {
        document.querySelector("html").setAttribute("controlTabsPurpose", "usage");
    }
}

// Iphone Tabs
const iphoneButtons = document.querySelectorAll(".controlTabsPlatform_iphone");
for (const button of iphoneButtons) {
    button.onclick = function() {
        document.querySelector("html").setAttribute("controlTabsIosPlatform", "iphone");
    }
}

// Ipad Tabs
const ipadButtons = document.querySelectorAll(".controlTabsPlatform_ipad");
for (const button of ipadButtons) {
    button.onclick = function() {
        document.querySelector("html").setAttribute("controlTabsIosPlatform", "ipad");
    }
}
