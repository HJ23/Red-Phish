function fetchDomain(domain) {
    browser.storage.local.get(StorageKey.Token, function (obj) {
        
        const token = obj[StorageKey.Token];
        
        startFetching(FetchType.Domain, domain);
        
        fetch(API.Domain, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"provider": "domaintools", "domain": domain, "raw": true})
        })
        .then((response) => {
            response.json().then((json) => {
                const verdict = json.result.data.verdict;
                const riskScore = json.result.raw_data.response.risk_score;

                displayVerdict(verdict, riskScore);
            })
        })
    })
}

function fetchUrl(url) {
    browser.storage.local.get(StorageKey.Token, function (obj) {
        const token = obj[StorageKey.Token];
        
        startFetching(FetchType.Url, url);
        
        fetch(API.Url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"provider": "crowdstrike", "url": url})
        })
        .then((response) => {
            response.json().then((json) => {
                const verdict = json.result.data.verdict;
                const riskScore = json.result.data.score;
                
                displayVerdict(verdict, riskScore);
            })
        })
        
    })
}

function fetchIp(ip) {
    browser.storage.local.get(StorageKey.Token, function (obj) {
        const token = obj[StorageKey.Token];
        
        startFetching(FetchType.Ip, ip);
        
        fetch(API.Ip, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"provider": "crowdstrike", "ip": ip})
        })
        .then((response) => {
            response.json().then((json) => {
                const verdict = json.result.data.verdict;
                const riskScore = json.result.data.score;

                displayVerdict(verdict, riskScore);
            })
        })
        
    })
}

function fetchHash(hash, hashType) {
    browser.storage.local.get(StorageKey.Token, function (obj) {
        const token = obj[StorageKey.Token];
        
        startFetching(FetchType.File, hash);
        
        fetch(API.File, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"provider": "crowdstrike", "hash": hash, "hash_type": hashType })
        })
        .then((response) => {
            response.json().then((json) => {
                const verdict = json.result.data.verdict;
                const riskScore = json.result.data.score;

                displayVerdict(verdict, riskScore);
            })
        })
        
    })
}

function startFetching(type, target) {
    queryById("reportInfoWrapper").style.display = "block";
    queryById("reportType").innerHTML = type;
    queryById("reportTarget").innerHTML = target;
         
    queryById("reportLoader").style.display = "inline-block";
    queryById("reportResult").style.display = "none";
    queryById("fastCheckField").value = "";
}

function displayVerdict(verdict, riskScore) {
    setVerdictFish(verdict);
    
    queryById("reportLoader").style.display = "none";
    
    queryById("verdict").innerHTML = capitalizeFirstLetter(verdict);
    queryById("riskScore").innerHTML = riskScore;
    queryById("reportResult").style.display = "flex";
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
