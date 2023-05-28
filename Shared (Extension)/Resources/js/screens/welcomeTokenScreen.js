(function() {
    
    // MARK: - Actions
 
    // Submit button click
    
    queryById("submitWelcomeToken").onclick = function () {
        const tokenValue = queryById("welcomeTokenField").value;
        console.log(tokenValue);
        
        if (tokenValue == "") {
            queryById("welcomeTokenError").style.display = "block";
        } else {
            setToStorage(StorageKey.Token, tokenValue, function() {
                showScreen("mainScreen");
                queryById("welcomeTokenField").value = "";
            });
        }
    }
 
})();
