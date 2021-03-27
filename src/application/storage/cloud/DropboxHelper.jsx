import { Dropbox } from "dropbox";

const clientId = "isolkaqnjg07lcv";

export default class DropboxHelper {
    dbx = null;

    init = () => {
        // dropbox adds the tokens after '#' in the redirected URL
        const urlParams = window.location.href.split("#");

        if (urlParams.length === 1) {
            // no params after '#' exist. Needs to perform auth
            const dbx = new Dropbox({ clientId: clientId });
            dbx.auth
                .getAuthenticationUrl("http://localhost:5000/auth/dropbox")
                .then((authUrl) => {
                    console.log(authUrl);
                    window.location.href = authUrl;
                });
        } else {
            const queryParams = {};
            const s = urlParams[1].split("&");
            for (let i in s) {
                let param = s[i].split("=");
                queryParams[param[0]] = param[1];
            }
            console.log(queryParams);
            this.dbx = new Dropbox({
                accessToken: queryParams.access_token,
            });
        }
    };
}
