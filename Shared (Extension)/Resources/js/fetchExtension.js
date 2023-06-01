function fetchInfo(requestSrting, type) {
    
    browser.storage.local.get([StorageKey.Token,
                               StorageKey.FeatureCacheFetchedData,
                               StorageKey.CacheStorage,
                               StorageKey.Statistics,
                               StorageKey.Power], function (obj) {
        
        const token = obj[StorageKey.Token];
        const retrieveFromCache = obj[StorageKey.FeatureCacheFetchedData] == null ? true : obj[StorageKey.FeatureCacheFetchedData];
        
        var storageData = obj[StorageKey.CacheStorage] == null ? [] : obj[StorageKey.CacheStorage];
        const foundObject = storageData.find(obj => obj.request === requestSrting);
        
        const statsMock = { benign: 0, unknown: 0, malicious: 0 }
        var statistic = obj[StorageKey.Statistics] == null ? statsMock :  obj[StorageKey.Statistics];
        
        const reported = foundObject == null ? false : foundObject.reported;
        
        const isActive = obj[StorageKey.Power] == null ? true : obj[StorageKey.Power];
        
        if (token != null && isActive == true) {
            if (retrieveFromCache && foundObject != null) {
                startFetching(requestSrting, type);
                displayVerdict(foundObject.verdict, foundObject.riskScore, type, reported);
                
                if (foundObject.reported) {
                    queryById("sendReportButton").setAttribute("data-reported", true);
                    queryById("sendReportButton").innerHTML = "Reported";
                }
            } else {
                startFetching(requestSrting, type);
                
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
                        } else {
                            displaySomethingWentWrong();
                        }
                    })
                })
            }
        }
    })
}

function displaySomethingWentWrong() {
    queryById("reportLoader").style.display = "none";
    queryById("somethingWentWrong").style.display = "block";
    queryById("reportInfoWrapper").style.display = "none";
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

function startFetching(requestSrting, type) {
    queryById("reportTarget").innerHTML = requestSrting;
    queryById("reportType").innerHTML = type.headline;
    queryById("reportInfoWrapper").style.display = "block";
    queryById("reportLoader").style.display = "inline-block";
    queryById("reportResult").style.display = "none";
    queryById("somethingWentWrong").style.display = "none";
    queryById("fastCheckField").value = "";
}

function displayVerdict(verdict, riskScore, type, reported) {
    queryById("sendReportButton").style.display = "none";
    setVerdictFish(verdict);
    queryById("reportLoader").style.display = "none";
    queryById("verdict").innerHTML = capitalizeFirstLetter(verdict);
    queryById("riskScore").innerHTML = riskScore;
    queryById("reportResult").style.display = "flex";
    
    // Show report button only for Domain, URL and IP requests
    
    if (type != API.Hash) {
        queryById("sendReportButton").style.display = "flex";
    }
    
    // Check if reported
    
    if (reported == true) {
        queryById("sendReportButton").setAttribute("data-reported", "true");
        queryById("sendReportButtonTitle").innerHTML = "Reported";
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
