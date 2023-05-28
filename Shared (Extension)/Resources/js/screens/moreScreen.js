(function() {
    
    // MARK: - Router
    
    queryById("fromMoreToMain").onclick = function() {
        showScreen("mainScreen");
        queryById("accountTokenError").style.display = "none";
        queryById("accountTokenSuccess").style.display = "none";
    }
    
    
    // MARK: - Actions
    
    // Click on row with select
    
    const itemsWithSelect = querySelectorAll("#moreScreen .popUpMenuList:has(select)");
    
    for (const index in itemsWithSelect) {
        const item = itemsWithSelect[index];
        item.onclick = function() {
            showDropdown(item.querySelector("select"));
        }
    }
    
    // Submit button click
    
    queryById("submitAccountTokenUpdate").onclick = function () {
        
        const tokenValue = queryById("accountTokenField").value;
        
        queryById("accountTokenSuccess").style.display = "none";
        queryById("accountTokenError").style.display = "none";
        
        if (tokenValue == "") {
            queryById("accountTokenError").style.display = "block";
        } else {
            setToStorage(StorageKey.Token, tokenValue, function() {
                queryById("accountTokenSuccess").style.display = "block";
            });
        }
    }
    
    // MARK: - Features Configuration
    
    // Feature Email Checker Checkox Click
     
    const featureEmailCheckerCheckbox = queryById("redFish_FeatureEmailChecker");
    
    featureEmailCheckerCheckbox.onclick = function () {
        event.preventDefault();
        
        browser.storage.local.get(StorageKey.FeatureEmailChecker, function (obj) {
            
            const defaultValue = false;
            const status = obj[StorageKey.FeatureEmailChecker] == null ? defaultValue : obj[StorageKey.FeatureEmailChecker];
            
            featureEmailCheckerCheckbox.checked = status ? false : true;
            
            setToStorage(StorageKey.FeatureEmailChecker,
                         featureEmailCheckerCheckbox.checked);
        })
    }
    
    // Feature Link Hover Checkox Click
     
    const featureLinkHoverCheckbox = queryById("redFish_FeatureLinkHover");
    
    featureLinkHoverCheckbox.onclick = function () {
        event.preventDefault();
        
        browser.storage.local.get(StorageKey.FeatureLinkHover, function (obj) {
            
            const defaultValue = false;
            const status = obj[StorageKey.FeatureLinkHover] == null ? defaultValue : obj[StorageKey.FeatureLinkHover];
            
            featureLinkHoverCheckbox.checked = status ? false : true;
            
            setToStorage(StorageKey.FeatureLinkHover,
                         featureLinkHoverCheckbox.checked);
        })
    }
    
    // Feature Website Visit Check Checkox Click
     
    const featureWebsiteVisitCheckCheckbox = queryById("redFish_FeatureWebsiteVisitCheck");
    
    featureWebsiteVisitCheckCheckbox.onclick = function () {
        event.preventDefault();
        
        browser.storage.local.get(StorageKey.FeatureWebsiteVisitCheck, function (obj) {
            
            const defaultValue = false;
            const status = obj[StorageKey.FeatureWebsiteVisitCheck] == null ? defaultValue : obj[StorageKey.FeatureWebsiteVisitCheck];
            
            featureWebsiteVisitCheckCheckbox.checked = status ? false : true;
            
            setToStorage(StorageKey.FeatureWebsiteVisitCheck,
                         featureWebsiteVisitCheckCheckbox.checked);
        })
    }
    
    // Feature Extension Website Check Checkox Click
     
    const featureExtensionWebsiteCheckCheckbox = queryById("redFish_FeatureExtensionWebsiteCheck");
    
    featureExtensionWebsiteCheckCheckbox.onclick = function () {
        event.preventDefault();
        
        browser.storage.local.get(StorageKey.FeatureExtensionWebsiteCheck, function (obj) {
            
            const defaultValue = false;
            const status = obj[StorageKey.FeatureExtensionWebsiteCheck] == null ? defaultValue : obj[StorageKey.FeatureExtensionWebsiteCheck];
            
            featureExtensionWebsiteCheckCheckbox.checked = status ? false : true;
            
            setToStorage(StorageKey.FeatureExtensionWebsiteCheck,
                         featureExtensionWebsiteCheckCheckbox.checked);
        })
    }
    
    // Feature Cache Fetched Data Checkox Click
     
    const featureCacheFetchedDataCheckbox = queryById("redFish_FeatureCacheFetchedData");
    
    featureCacheFetchedDataCheckbox.onclick = function () {
        event.preventDefault();
        
        browser.storage.local.get(StorageKey.FeatureCacheFetchedData, function (obj) {
            
            const defaultValue = false;
            const status = obj[StorageKey.FeatureCacheFetchedData] == null ? defaultValue : obj[StorageKey.FeatureCacheFetchedData];
            
            featureCacheFetchedDataCheckbox.checked = status ? false : true;
            
            setToStorage(StorageKey.FeatureCacheFetchedData, featureCacheFetchedDataCheckbox.checked);
        })
    }
    
    // MARK: - Prepare
    
    // Set features checkboxes states
    
    browser.storage.local.get([StorageKey.FeatureEmailChecker,
                               StorageKey.FeatureLinkHover,
                               StorageKey.FeatureWebsiteVisitCheck,
                               StorageKey.FeatureExtensionWebsiteCheck,
                               StorageKey.FeatureCacheFetchedData], function (obj) {
        
        // Feature Email Checker
        
        const FeatureEmailCheckerDefault = false;
        const statusFeatureEmailChecker = obj[StorageKey.FeatureEmailChecker] == null ? FeatureEmailCheckerDefault : obj[StorageKey.FeatureEmailChecker];
        
        if (statusFeatureEmailChecker == true) {
            queryById("redFish_FeatureEmailChecker").checked = true;
        }
        
        // Feature Link Hover
        
        const FeatureLinkHoverDefault = false;
        const statusFeatureLinkHover = obj[StorageKey.FeatureLinkHover] == null ? FeatureLinkHoverDefault : obj[StorageKey.FeatureLinkHover];
        
        if (statusFeatureLinkHover == true) {
            queryById("redFish_FeatureLinkHover").checked = true;
        }
        
        // Feature Website Visit Check
        
        const FeatureWebsiteVisitCheckDefault = false;
        const statusFeatureWebsiteVisitCheck = obj[StorageKey.FeatureWebsiteVisitCheck] == null ? FeatureWebsiteVisitCheckDefault : obj[StorageKey.FeatureWebsiteVisitCheck];
        
        if (statusFeatureWebsiteVisitCheck == true) {
            queryById("redFish_FeatureWebsiteVisitCheck").checked = true;
        }
        
        // Feature Extension Website Check
        
        const FeatureExtensionWebsiteCheckDefault = false;
        const statusFeatureExtensionWebsiteCheck = obj[StorageKey.FeatureExtensionWebsiteCheck] == null ? FeatureExtensionWebsiteCheckDefault : obj[StorageKey.FeatureExtensionWebsiteCheck];
        
        if (statusFeatureExtensionWebsiteCheck == true) {
            queryById("redFish_FeatureExtensionWebsiteCheck").checked = true;
        }
        
        // Feature Cache Fetched Data
        
        const FeatureCacheFetchedDataDefault = false;
        const statusFeatureCacheFetchedData = obj[StorageKey.FeatureCacheFetchedData] == null ? FeatureCacheFetchedDataDefault : obj[StorageKey.FeatureCacheFetchedData];
        
        if (statusFeatureCacheFetchedData == true) {
            queryById("redFish_FeatureCacheFetchedData").checked = true;
        }
        
    })
    
    
})();


