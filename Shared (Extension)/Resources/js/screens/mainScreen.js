function launch() {
    browser.storage.local.get(StorageKey.Token, function (obj) {
        const data = obj[StorageKey.Token];
        if (data != null) {
            showScreen("mainScreen");
            
            // Set token on settings screen
            
            queryById("accountTokenField").value = data;
            
            // Try to fetch info about website
            
            getCurrentTab().then((tabs) => {
                const tabUrl = tabs[0].url;
                
                browser.storage.local.get([StorageKey.FeatureExtensionWebsiteCheck, StorageKey.Power], function (obj) {
                    
                    const isActive = obj[StorageKey.Power] == null ? true : obj[StorageKey.Power];
                    const shouldCheck = obj[StorageKey.FeatureExtensionWebsiteCheck] == null ? true : obj[StorageKey.FeatureExtensionWebsiteCheck];
                    
                    if (shouldCheck && isActive) {
                        if (tabUrl != "") {
                           var url = new URL(tabUrl);
                           var domain = url.hostname;
                           
                           fetchInfo(domain, API.Domain);
                        } else {
                           queryById("unableToCheckMessage").style.display = "block";
                        }
                    }
                })
            })
        }
    })
}

(function() {
     
    // MARK: - Functions
    
    function checkStringType(input) {
        // Regular expressions for each type
        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
        const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        const hashRegex = /^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/i;
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        if (domainRegex.test(input)) {
            return API.Domain;
        } else if (urlRegex.test(input)) {
            return API.URL;
        } else if (hashRegex.test(input)) {
            return API.Hash;
        } else if (ipRegex.test(input)) {
            return API.IP;
        } else {
            return 'Unknown';
        }
    }
     
    // Submit Fast Check
     
     queryById("submitFastCheck").onclick = function() {
         
         queryById("fastCheckUnknownRequestError").style.display = "none";
         queryById("fastCheckTokenError").style.display = "none";
         queryById("unableToCheckMessage").style.display = "none";
         
         const fieldValue = queryById("fastCheckField").value;
         
         if (fieldValue == "") {
             queryById("fastCheckTokenError").style.display = "block";
         } else {
             // Check request type from API
             
             const requestType = checkStringType(fieldValue);
             
             if (requestType == "Unknown") {
                queryById("fastCheckUnknownRequestError").style.display = "block";
             } else if (requestType == API.Hash && checkHashType(fieldValue) == "Unknown") {
                queryById("fastCheckUnknownRequestError").style.display = "block";
             } else {
                fetchInfo(fieldValue, requestType);
             }
         }
     };
     
     // MARK: - Prepare Screen
     
    launch();
    
    // Set ON/OFF State
     
    const powerButton = queryById("powerButton");
    browser.storage.local.get(StorageKey.Power, function (obj) {
        const globalDefault = true;
        const status = obj[StorageKey.Power] == null ? globalDefault : obj[StorageKey.Power];
        if (status == true) {
            powerButton.setAttribute("active","");
            queryById("disableMessage").style.display = "none";
            queryById("mainFunctionalPart").style.display = "block";
        } else {
            powerButton.removeAttribute("active");
            queryById("disableMessage").style.display = "block";
            queryById("mainFunctionalPart").style.display = "none";
        }
    });
     
     // MARK: - Actions
     
     // Power Button Click
     
     queryById("powerButton").onclick = function() {
          browser.storage.local.get(StorageKey.Power, function (obj) {
              const globalDefault = true;
              const status = obj[StorageKey.Power] == null ? globalDefault : obj[StorageKey.Power];
              
              if (status == true) {
                  queryById("powerButton").removeAttribute("active");
                  queryById("disableMessage").style.display = "block";
                  queryById("mainFunctionalPart").style.display = "none";
                  setToStorage(StorageKey.Power, false, function() {});
              } else {
                  queryById("powerButton").setAttribute("active", "");
                  queryById("disableMessage").style.display = "none";
                  queryById("mainFunctionalPart").style.display = "block";
                  launch();
                  setToStorage(StorageKey.Power, true, function() {});
              }
          })
     }
     
     // Report Button Click
     
     queryById("sendReportButton").onclick = function() {
         browser.storage.local.get(StorageKey.CacheStorage, function (obj) {
             
            const requestString = queryById("reportTarget").innerHTML;
            var storageData = obj[StorageKey.CacheStorage];
            
            storageData.map(record => {
                if (record.request == requestString) {
                    record.reported = true;
                }

                return obj;
            });
            
            setToStorage(StorageKey.CacheStorage, storageData, function() {});
             
            sendReport(requestString);
            
            queryById("sendReportButton").setAttribute("data-reported", "true");
            queryById("sendReportButtonTitle").innerHTML = "Reported";
         })
     }
     
     // MARK: - Router
     
     queryById("fromMainToMore").onclick = function() {
         showScreen("moreScreen");
     }
     
     queryById("fromMainToStatistics").onclick = function() {
         showScreen("statisticsScreen");
         
         // Update Statistic
         browser.storage.local.get(StorageKey.Statistics, function (obj) {
             
             const statsMock = { benign: 0, unknown: 0, malicious: 0 }
             const stats = obj[StorageKey.Statistics] == null ? statsMock : obj[StorageKey.Statistics];
             
             queryById("statBenign").innerHTML = stats.benign;
             queryById("statUnknown").innerHTML = stats.unknown;
             queryById("statMalicious").innerHTML = stats.malicious;
         })
     }
     
 })();

