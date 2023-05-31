 (function() {
     
     function checkPage(requestSrting, type) {
         
         // here will check if need to retrieve from cache
         
         browser.storage.local.get([StorageKey.Token,
                                    StorageKey.FeatureCacheFetchedData,
                                    StorageKey.CacheStorage,
                                    StorageKey.Statistics], function (obj) {
             
             const token = obj[StorageKey.Token];
             const retrieveFromCache = obj[StorageKey.FeatureCacheFetchedData] == null ? true : obj[StorageKey.FeatureCacheFetchedData];
             
             var storageData = obj[StorageKey.CacheStorage] == null ? [] : obj[StorageKey.CacheStorage];
             const foundObject = storageData.find(obj => obj.request === requestSrting);
             
             const statsMock = { benign: 0, unknown: 0, malicious: 0 }
             var statistic = obj[StorageKey.Statistics] == null ? statsMock :  obj[StorageKey.Statistics];
             
             const reported = foundObject == null ? false : foundObject.reported;
             
             if (token != null) {
                 
                 if (foundObject == null || foundObject.closed != true) {
                     if (retrieveFromCache && foundObject != null) {
                         startFetching();
                         displayVerdict(foundObject.verdict, foundObject.riskScore, type, reported);
                         
                         if (foundObject.reported) {
                             queryById("sendReportButton").setAttribute("data-reported", true);
                             queryById("sendReportButton").innerHTML = "Reported";
                         }
                     } else {
                         fetch(type.endpoint, {
                             method: "POST",
                             headers: {
                                 "Authorization": "Bearer " + token,
                                 "Content-Type": "application/json"
                             },
                             body: JSON.stringify(getBodyForFetch(requestSrting, type))
                         })
                         .then((response) => {
                             response.json().then((json) => {
                                 if (json.result != null) {
                                     const verdict = getVerdictResults(json, type).verdict;
                                     const riskScore = getVerdictResults(json, type).riskScore;
                                     
                                     displayVerdict(verdict, riskScore, type, reported);
                                     
                                     // Set reported button state
                                     
                                     if (foundObject != null && foundObject.reported == true) {
                                         queryById("sendReportButton").setAttribute("data-reported", true);
                                         queryById("sendReportButton").innerHTML = "Reported";
                                     }
                                     
                                     // Check if storage already containts same request
                                     
                                     const containsObjectWithParameter = storageData.some(obj => obj.request === requestSrting);
                                     
                                     if (containsObjectWithParameter == false) {
                                         const newDataToStore = {
                                             "request": requestSrting,
                                             "type": type,
                                             "verdict": verdict,
                                             "riskScore": riskScore,
                                             "reported": false,
                                             "closed": false
                                         }
                                         
                                         storageData.push(newDataToStore);
                                         
                                         setToStorage(StorageKey.CacheStorage, storageData, function() {});
                                         
                                         // Update stats
                                         
                                         if (verdict == "benign") {
                                             statistic.benign += 1;
                                         } else if (verdict == "malicious") {
                                             statistic.malicious += 1;
                                         } else {
                                             statistic.unknown += 1;
                                         }
                                         
                                         setToStorage(StorageKey.Statistics, statistic, function() {});
                                     }
                                 }
                             })
                         })
                        }
                 }
             }
         })
     }
     
     function startFetching() {
         // Will show water wave loader
         queryById("reportLoader").style.display = "inline-block";
         queryById("reportResult").style.display = "none";
     }
     
     function displayVerdict(verdict, riskScore, type, reported) {
         // Delete old popup
         queryById("reportLoader").style.display = "none";
         queryById("reportResult").style.display = "block";
         queryById("verdict").innerHTML = capitalizeFirstLetter(verdict);
         queryById("riskScore").innerHTML = riskScore;
         setVerdictFish(verdict);
         
         // Show report button only for Domain, URL and IP requests
         if (type != API.Hash) {
             queryById("sendReportButton").style.display = "flex";
         }
         
         // Check if reported
         if (reported == true) {
             queryById("sendReportButton").setAttribute("data-reported", "true");
             queryById("sendReportButton").innerHTML = "Reported";
         }
     }
     
     function setVerdictFish(verdict) {
         if (verdict == "malicious") {
             queryById("fishIcon").setAttribute("data-color", "red");
         } else if (verdict == "benign") {
             queryById("fishIcon").setAttribute("data-color", "green");
         } else {
             queryById("fishIcon").setAttribute("data-color", "yellow");
         }
     }
     
     function getVerdictResults(json, type) {
         if (type == API.Domain) {
             return { "verdict": json.result.data.verdict, "riskScore": json.result.raw_data.response.risk_score }
         } else if (type == API.URL) {
             return { "verdict": json.result.data.verdict, "riskScore": json.result.data.score }
         } else if (type == API.IP) {
             return { "verdict": json.result.data.verdict, "riskScore": json.result.data.score }
         } else if (type == API.Hash) {
             return { "verdict": json.result.data.verdict, "riskScore": json.result.data.score }
         }
     }
     
     function getBodyForFetch(requestSrting, type) {
         if (type == API.Domain) {
             return { "provider": "domaintools", "domain": requestSrting, "raw": true }
         } else if (type == API.URL) {
             return { "provider": "crowdstrike", "url": requestSrting }
         } else if (type == API.IP) {
             return {"provider": "crowdstrike", "ip": requestSrting}
         } else if (type == API.Hash) {
             var hashType = checkHashType(requestSrting);
             return {"provider": "crowdstrike", "hash": requestSrting, "hash_type": hashType }
         }
     }
     
     // Fetch Info About Page
     
     if (document.readyState !== 'loading') {
         init()
     } else {
         document.addEventListener('DOMContentLoaded', init);
     }
     
     function init() {
         browser.storage.local.get([StorageKey.FeatureWebsiteVisitCheck], function (obj) {
             
             const defaultValue = true;
             const shouldCheck = obj[StorageKey.FeatureWebsiteVisitCheck] == null ? defaultValue : obj[StorageKey.FeatureWebsiteVisitCheck];
             
             if (shouldCheck) {
                 // Create a new div element
                 
                 var divElement = document.createElement('div');

                 // Set the innerHTML of the new div element
                 
                 divElement.innerHTML = "<div class='result' id='reportResult'><div class='lds-ripple' id='reportLoader'><div></div><div></div></div> <div id='closePopup'></div><div class='icon'><div id='fishIcon' data-color='green'></div></div><div class='info'><p class='riskScoreWrapper'><span class='infoTitle'>Risk Score:</span> <span id='riskScore' class='infoValue'>0</span></p><p class='verdictWrapper'><span class='infoTitle'>Verdict:</span> <span id='verdict' class='infoValue'>Benign</span></p></div><div id='sendReportButton' data-reported='false' style='display: flex;'>Report</div></div>";
                 
                 // Append the new div element to the body
                 
                 document.body.appendChild(divElement);
                 
                 checkPage(window.location.host, API.Domain);
                 
                 // Report Button Click
                 
                 queryById("sendReportButton").addEventListener('click', function() {
                     browser.storage.local.get(StorageKey.CacheStorage, function (obj) {

                        const requestString = window.location.host;
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
                        queryById("sendReportButton").innerHTML = "Reported";
                     })
                 })
                 
                 // Close Button Click
                 
                 queryById("closePopup").addEventListener('click', function() {
                     browser.storage.local.get(StorageKey.CacheStorage, function (obj) {

                        const requestString = window.location.host;
                        var storageData = obj[StorageKey.CacheStorage];

                        storageData.map(record => {
                            if (record.request == requestString) {
                                record.closed = true;
                            }

                            return obj;
                        });
                        
                        setToStorage(StorageKey.CacheStorage, storageData, function() {});

                        queryById("reportResult").style.display = "none";
                     })
                    
                 })
             }
         });
     }
     
 })();
