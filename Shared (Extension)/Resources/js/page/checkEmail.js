(function() {
    
    // Alert when mail page is opened
    
    var lastUrl = location.href;

    new MutationObserver(() => {
        browser.storage.local.get(StorageKey.Power, function (obj) {
            const isEnabled = obj[StorageKey.Power];
            
            if (isEnabled == true) {
                const url = location.href;
                  
                if (url !== lastUrl) {
                  lastUrl = url;
                  onURLChanged();
                }
            }
        })
    }).observe(document, {subtree: true, childList: true});
    
    function onURLChanged() {
        const url = location.href;
        
        // Check if email function and token is on
        
        browser.storage.local.get([StorageKey.Token,
                                   StorageKey.Power,
                                   StorageKey.FeatureEmailChecker], function (obj) {
            
            const isFunctionActive = obj[StorageKey.Power] == null ? true : obj[StorageKey.Power];
            const isActive = obj[StorageKey.Power] == null ? true : obj[StorageKey.Power];
            const isFeatureActive = obj[StorageKey.FeatureEmailChecker] == null ? false : obj[StorageKey.FeatureEmailChecker];
            
            const token = obj[StorageKey.Token];
            
            if (token != null && isActive == true && isFeatureActive == true) {
                if (isMatchingURL(url)) {
                    const messageContentBlock = querySelector("div[data-message-id]");
                    const allLinksElements = messageContentBlock.querySelectorAll("a");
                    
                    var allLinksHrefs = [];
                    for (const linkElement of allLinksElements) {
                        const linkUrl = linkElement.href;
                        
                        if (isURL(linkUrl)) {
                            let domain = (new URL(linkUrl)).hostname;
                            if (!allLinksHrefs.includes(domain)) {
                                allLinksHrefs.push(domain);
                            }
                        }
                    }
                    
                    startFetching(allLinksHrefs, token);
                }
            }
        })
    }
    
    function startFetching(domains, token) {
        var divElement = document.createElement('div');
        divElement.innerHTML = "<div id='emailChecker'><div id='emailCheckResult' data-color='green'></div><div class='lds-ripple' id='reportLoader2'><div></div><div></div></div></div>";
        
        querySelector("div[data-message-id]").appendChild(divElement);
        
        queryById("reportLoader2").style.display = "block";
        
        if (domains.length == 0) {
            queryById("reportLoader2").style.display = "none";
            queryById("emailCheckResult").setAttribute("data-color", "green");
            queryById("emailCheckResult").style.display = "block";
        } else {
            
            var result = 0;
            const domainsCount = domains.length;
            var checkedDomains = 0;
            
            const type = API.Domain;

            for (const domain of domains) {
                fetch(type.endpoint, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(getBodyForFetch(domain, type))
                })
                .then((response) => {
                    response.json().then((json) => {

                        if (json.result != null) {
                            const verdict = getVerdictResults(json, type).verdict;

                            checkedDomains += 1;
                            
                            if (verdict == "benign" && result < 1) {
                                result = 1;
                            } else if (verdict == "unknown" && result < 2) {
                                result = 2;
                            } else if (verdict == "malicious" && result < 3) {
                                result = 3;
                            }
                            
                            if (checkedDomains == domainsCount) {
                                queryById("reportLoader2").style.display = "none";

                                if (result == 1) {
                                    queryById("emailCheckResult").setAttribute("data-color", "green");
                                } else if (result == 2) {
                                    queryById("emailCheckResult").setAttribute("data-color", "yellow");
                                } else if (result == 3) {
                                    queryById("emailCheckResult").setAttribute("data-color", "red");
                                }

                                queryById("emailCheckResult").style.display = "block";
                            }
                        }
                    })
                })
            }
        }
    }

    // Check first time
    if (document.readyState !== 'loading') {
        init()
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    function init() {
        onURLChanged();
    }
    
    function isMatchingURL(url) {
        var regexPattern = /https:\/\/mail\.google\.com\/mail\/u\/\d\/#inbox\/[A-Za-z0-9]+/;
        return regexPattern.test(url);
    }

})();
