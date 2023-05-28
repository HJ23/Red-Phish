 (function() {
     
     // MARK: - Functions
     
    function checkStringType(input) {
        // Regular expressions for each type
        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
        const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        const hashRegex = /^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/i;
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (domainRegex.test(input)) {
            return "Domain";
        } else if (urlRegex.test(input)) {
            return "URL";
        } else if (hashRegex.test(input)) {
            return "Hash";
        } else if (ipRegex.test(input)) {
            return "IP";
        } else {
            return 'Unknown';
        }
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
     
     // Submit Fast Check
     
     queryById("submitFastCheck").onclick = function() {
         
         queryById("fastCheckUnknownRequestError").style.display = "none";
         queryById("fastCheckTokenError").style.display = "none";
         
         const fieldValue = queryById("fastCheckField").value;
         
         if (fieldValue == "") {
             queryById("fastCheckTokenError").style.display = "block";
         } else {
             
             // Check request type from API
             
             const requestType = checkStringType(fieldValue);
             console.log(requestType);
             
             if (requestType == "Unknown") {
                queryById("fastCheckUnknownRequestError").style.display = "block";
             } else if (requestType == "Domain") {
                fetchDomain(fieldValue);
             } else if (requestType == "URL") {
                fetchUrl(fieldValue);
             } else if (requestType == "IP") {
                 fetchIp(fieldValue);
             } else if (requestType == "Hash") {
                 const hashType = checkHashType(fieldValue);
                 if (hashType != "Unknown") {
                     fetchHash(fieldValue, hashType);
                 } else {
                     queryById("fastCheckUnknownRequestError").style.display = "block";
                 }
             }
         }
     };
     
     // MARK: - Prepare Screen
     
     // Check if token is setted
     
     browser.storage.local.get(StorageKey.Token, function (obj) {
         const data = obj[StorageKey.Token];
         if (data != null) {
             showScreen("mainScreen");
             
             // Set token on settings screen
             
             queryById("accountTokenField").value = data;
             
             // Try to fetch info about website
             
             getCurrentTab().then((tabs) => {
                 const tabUrl = tabs[0].url;
                 
                 browser.storage.local.get(StorageKey.FeatureExtensionWebsiteCheck, function (obj) {
                     
                     const shouldCheck = obj[StorageKey.FeatureExtensionWebsiteCheck] == null ? true : obj[StorageKey.FeatureExtensionWebsiteCheck];
                     
                     if (shouldCheck) {
                         if (tabUrl != "") {
                            var url = new URL(tabUrl);
                            var domain = url.hostname;
                            
                            fetchDomain(domain, token);
                         } else {
                             queryById("unableToCheckMessage").style.display = "block";
                         }
                     }
                 })
             })
         }
     })
     
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
                  setToStorage(StorageKey.Power, true, function() {});
              }
          })
     }
     
     // MARK: - Router
     
     queryById("fromMainToMore").onclick = function() {
         showScreen("moreScreen");
     }
     
     
     
 })();

