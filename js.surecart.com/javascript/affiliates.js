(function() {
    // Ensure the global config object exists and set default values
    window.SureCartAffiliatesConfig = window.SureCartAffiliatesConfig || {};
    window.SureCartAffiliatesConfig.baseURL = window.SureCartAffiliatesConfig.baseURL || "https://api.surecart.com/v1";
    window.SureCartAffiliatesConfig.publicToken = window.SureCartAffiliatesConfig.publicToken || null;

    // Helper function to get a URL parameter by its name
    function getURLParameter(name) {
        const regex = new RegExp("[?&]" + name + "=([^&#]*)");
        const results = regex.exec(location.search);
        return results === null ?
            "" :
            decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Helper function to get a cookie by its name
    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    // Helper function to set a cookie
    function setCookie(name, value, domain, expiryDate) {
        const expires = "expires=" + expiryDate.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;domain=" + domain;
    }

    function logMessage(type, message) {
        return "SureCart Affiliates: " + type + (message === undefined ? "" : " - " + message);
    }

    // Check to make sure config values are set
    if (!window.SureCartAffiliatesConfig.baseURL) {
        console.error(logMessage("Configuration Error", "baseURL is not set"));
        return;
    }
    if (!window.SureCartAffiliatesConfig.publicToken) {
        console.error(logMessage("Configuration Error", "publicToken is not set"));
        return;
    }

    // Check for the ?aff query parameter
    const affiliationCode = getURLParameter("aff");

    if (affiliationCode) {
        // Use the baseURL from the global config object
        const endpointURL = `${window.SureCartAffiliatesConfig.baseURL}/public/clicks`;

        // Sending a request to record a click
        fetch(endpointURL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${window.SureCartAffiliatesConfig.publicToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    click: {
                        affiliation_code: affiliationCode,
                        url: window.location.href,
                        referrer: document.referrer,
                        previous_click: getCookie("sc_click_id")
                    }
                })
            })
            .then((response) => {
                if (!response.ok) {
                    // If response is not in the 200-299 range, we log it
                    console.warn(logMessage("Tracking Failed", response.statusText));
                }
                return response.json();
            })
            .then((data) => {
                // Set the cookie if the server responds with a click ID, domain and an expires_at value
                if (data.id && data.domain && data.expires_at) {
                    const expiryDate = new Date(data.expires_at * 1000); // Convert UNIX epoch time to JavaScript Date
                    setCookie("sc_click_id", data.id, data.domain, expiryDate);
                    console.log(logMessage("Tracking Succeeded"));
                }
            })
            .catch((error) => {
                console.error(logMessage("Server Error", error));
            });
    }
})();