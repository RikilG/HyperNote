import { Dropbox } from "dropbox";

const clientId = "isolkaqnjg07lcv";
const redirectURL = window.isElectron
    ? "http://localhost:3000"
    : "http://localhost:5000/auth/dropbox";

export default class DropboxHelper {
    dbx = null;
    static instance;

    static getInstance() {
        if (DropboxHelper.instance) {
            return DropboxHelper.instance;
        }
        DropboxHelper.instance = new DropboxHelper();
        return DropboxHelper.instance;
    }

    init(config) {
        // TODO: get a refresh token for longer retention of cloud access
        const urlParams = window.location.href.split("#");
        if (!config && urlParams.length === 1) {
            // no params after '#', no config. Needs to perform auth
            this.auth();
        } else if (urlParams.length !== 1) {
            // we have parameters in URL
            return this.parseParams();
        } else {
            // we only have a config
            const expiry = new Date(config.accessTokenExpiresAt || 0);
            if (new Date() > expiry) {
                // TODO: refresh token here
                // accessToken is expired. need perform auth
                this.auth();
            }
        }
        return config;
    }

    auth() {
        const dbx = new Dropbox({ clientId: clientId });
        dbx.auth.getAuthenticationUrl(redirectURL).then((authUrl) => {
            window.location.href = authUrl;
        });
    }

    parseParams() {
        // dropbox adds the tokens after '#' in the redirected URL
        let urlParams = window.location.href;
        if (urlParams.includes("#")) {
            urlParams = urlParams.split("#");
        } else if (urlParams.includes("?")) {
            urlParams = urlParams.split("?");
        }
        const queryParams = {};
        const s = urlParams[1].split("&");
        for (let i in s) {
            let param = s[i].split("=");
            queryParams[param[0]] = param[1];
        }
        const params = {
            accessToken: queryParams.access_token,
            clientId: clientId,
            accessTokenExpiresAt: new Date(
                new Date().getTime() + queryParams.expires_in * 1000
            ),
            refreshToken: queryParams.refresh_token,
        };
        this.dbx = new Dropbox(params);
        return params;
    }
}
