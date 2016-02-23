var config = {
    baseIdentityServerUrl: "http://localhost:44320/identity",
    baseApiUrl: "http://localhost:44322/",
    oAuth: {
        client_id: "implicitclient",
        redirect_uri: "http://localhost:44320/",
        scope: "openid profile read write email sampleApi",
        response_type: "id_token token"
    }
}