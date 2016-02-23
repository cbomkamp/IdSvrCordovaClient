var config = {
    baseIdentityServerUrl: "https://idsvr.mydomain.com/identity",
    baseApiUrl: "https://apiclient.mydomain.com/api/",
    oAuth: {
        client_id: "implicitclient",
        redirect_uri: "https://mvcclient.mydomain.com",
        scope: "openid profile read write email sampleApi",
        response_type: "id_token token"
    }
}