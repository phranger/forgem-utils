"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = __importStar(require("querystring"));
const node_fetch_1 = __importStar(require("node-fetch"));
const authentication_1 = require("./authentication");
const RetryDelay = 5000; // Delay (in milliseconds) before retrying after a "202 Accepted" response
function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
exports.DefaultHost = 'https://developer.api.autodesk.com';
var Region;
(function (Region) {
    Region["US"] = "US";
    Region["EMEA"] = "EMEA";
})(Region = exports.Region || (exports.Region = {}));
class ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {string} root Root path for all endpoints.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    constructor(root, auth, host, region) {
        if ('client_id' in auth && 'client_secret' in auth) {
            this.auth = new authentication_1.AuthenticationClient(auth.client_id, auth.client_secret, host);
        }
        else if ('token' in auth) {
            this.token = auth.token;
        }
        else {
            throw new Error('Authentication parameters missing or incorrect.');
        }
        this.root = root;
        this.host = host || exports.DefaultHost;
        this.region = region || Region.US;
    }
    /**
     * Resets client to specific authentication method, Forge host, and availability region.
     * @param {IAuthOptions} [auth] Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    reset(auth, host, region) {
        if (typeof auth !== 'undefined') {
            if ('client_id' in auth && 'client_secret' in auth) {
                this.auth = new authentication_1.AuthenticationClient(auth.client_id, auth.client_secret, host);
            }
            else if ('token' in auth) {
                this.token = auth.token;
            }
            else {
                throw new Error('Authentication parameters missing or incorrect.');
            }
        }
        if (typeof host !== 'undefined') {
            this.host = host || exports.DefaultHost;
        }
        if (typeof region !== 'undefined') {
            this.region = region || Region.US;
        }
    }
    async setAuthorization(options, scopes) {
        options.headers = options.headers || {};
        if (this.auth) {
            const authentication = await this.auth.authenticate(scopes);
            options.headers['Authorization'] = 'Bearer ' + authentication.access_token;
        }
        else {
            options.headers['Authorization'] = 'Bearer ' + this.token;
        }
    }
    setPayload(options, payload) {
        if (payload.urlencoded) {
            options.body = querystring.stringify(payload.urlencoded);
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        else if (payload.json) {
            options.body = JSON.stringify(payload.json);
            options.headers['Content-Type'] = 'application/json';
        }
        else if (payload.buffer) {
            options.body = payload.buffer;
            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/octet-stream';
        }
        else {
            throw new Error(`Content type not supported`);
        }
        options.headers['Content-Length'] = Buffer.byteLength(options.body).toString();
    }
    async parseResponse(response) {
        const contentTypeHeader = response.headers.get('Content-Type') || '';
        const contentType = contentTypeHeader.split(';')[0];
        if (response.ok) {
            switch (contentType) {
                case 'application/json':
                case 'application/vnd.api+json':
                    const json = await response.json();
                    return json;
                case 'application/xml':
                case 'text/plain':
                    const text = await response.text();
                    return text;
                default:
                    const buff = await response.arrayBuffer();
                    return buff;
            }
        }
        else {
            switch (contentType) {
                case 'application/json':
                    const data = await response.json();
                    throw new ForgeError(response.url, response.status, response.statusText, data);
                default:
                    const text = await response.text();
                    throw new ForgeError(response.url, response.status, response.statusText, text);
            }
        }
    }
    async fetch(endpoint, options) {
        return node_fetch_1.default(this.host + this.root + endpoint, options);
    }
    // Helper method for GET requests
    async get(endpoint, headers = {}, scopes, repeatOn202 = false) {
        const options = { method: 'GET', headers };
        await this.setAuthorization(options, scopes);
        var resp = await this.fetch(endpoint, options);
        while (resp.status === 202 && repeatOn202) {
            resp = new node_fetch_1.Response();
            sleep(RetryDelay);
            resp = await this.fetch(endpoint, options);
        }
        return this.parseResponse(resp);
    }
    // Helper method for POST requests
    async post(endpoint, data, headers = {}, scopes) {
        const options = { method: 'POST', headers };
        this.setPayload(options, data);
        await this.setAuthorization(options, scopes);
        const resp = await this.fetch(endpoint, options);
        return this.parseResponse(resp);
    }
    // Helper method for PUT requests
    async put(endpoint, data, headers = {}, scopes) {
        const options = { method: 'PUT', headers };
        this.setPayload(options, data);
        await this.setAuthorization(options, scopes);
        const resp = await this.fetch(endpoint, options);
        return this.parseResponse(resp);
    }
    // Helper method for PATCH requests
    async patch(endpoint, data, headers = {}, scopes) {
        const options = { method: 'PATCH', headers };
        this.setPayload(options, data);
        await this.setAuthorization(options, scopes);
        const resp = await this.fetch(endpoint, options);
        return this.parseResponse(resp);
    }
    // Helper method for DELETE requests
    async delete(endpoint, headers = {}, scopes) {
        const options = { method: 'DELETE', headers };
        await this.setAuthorization(options, scopes);
        const resp = await this.fetch(endpoint, options);
        return this.parseResponse(resp);
    }
}
exports.ForgeClient = ForgeClient;
class ForgeError extends Error {
    constructor(url, status, statusText, data) {
        super();
        this.url = url;
        this.status = status;
        this.statusText = statusText;
        this.data = data;
        if (data) {
            this.message = url + ': ' + (typeof data === 'string') ? data : JSON.stringify(data);
        }
        else {
            this.message = url + ': ' + statusText;
        }
    }
}
