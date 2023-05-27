 (function() {
     
     // MARK: - Power ON/OFF
     
     // MARK: - Fast Check
     
     const submitFastCheckButton = document.querySelector(".fastCheck #submitFastCheck");
     
     submitFastCheckButton.onclick = function() {
         // Get information from API
         document.querySelector(".fastCheck #fastCheckField").style.display = "none";

         fetchData(API.Domain);
     };
     
     function fetchData(api) {
         fetch(api, {
             method: "POST",
             headers: {
                 "Authorization": "Bearer " + token,
                 "Content-Type": "application/json"
             },
             body: JSON.stringify({"provider": "domaintools", "domain": "737updatesboeing.com"})
         })
         .then((response) => {
             response.json().then((json) => {
                 console.log(json);
             })
         })
     }
     
     // MARK: - Router
     
     queryById("fromMainToMore").onclick = function() {
         showScreen("moreScreen");
     }
     
     // MARK: - Settings
     
 })();

