function sendReport(site) {
    const url = 'https://report.netcraft.com/api/v3/report/urls';
    const email = 'redphish.report@gmail.com';
    const requestData = {
      email: email,
      urls: [ { url: site } ]
    };
    
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then((response) => {
        console.log(response)
        response.json().then((json) => {
            console.log(json)
        })
    })
}
