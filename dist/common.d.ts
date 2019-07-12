import { RequestInit, Response } from 'node-fetch';
import { AuthenticationClient } from './authentication';
export declare const DefaultHost = "https://developer.api.autodesk.com";
export declare enum Region {
    US = "US",
    EMEA = "EMEA"
}
export declare type IAuthOptions = {
    client_id: string;
    client_secret: string;
} | {
    token: string;
};
export declare type IRequestData = {
    urlencoded: any;
} | {
    json: any;
} | {
    buffer: any;
};
export declare abstract class ForgeClient {
    protected auth?: AuthenticationClient;
    protected token?: string;
    protected root: string;
    protected host: string;
    protected region: Region;
    /**
     * Initializes new client with specific authentication method.
     * @param {string} root Root path for all endpoints.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    constructor(root: string, auth: IAuthOptions, host?: string, region?: Region);
    /**
     * Resets client to specific authentication method, Forge host, and availability region.
     * @param {IAuthOptions} [auth] Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    reset(auth?: IAuthOptions, host?: string, region?: Region): void;
    protected setAuthorization(options: any, scopes: string[]): Promise<void>;
    protected setPayload(options: any, payload: any): void;
    protected parseResponse(response: Response): Promise<any>;
    protected fetch(endpoint: string, options: RequestInit): Promise<Response>;
    protected get(endpoint: string, headers: {
        [name: string]: string;
    } | undefined, scopes: string[], repeatOn202?: boolean): Promise<any>;
    protected post(endpoint: string, data: IRequestData, headers: {
        [name: string]: string;
    } | undefined, scopes: string[]): Promise<any>;
    protected put(endpoint: string, data: IRequestData, headers: {
        [name: string]: string;
    } | undefined, scopes: string[]): Promise<any>;
    protected patch(endpoint: string, data: IRequestData, headers: {
        [name: string]: string;
    } | undefined, scopes: string[]): Promise<any>;
    protected delete(endpoint: string, headers: {
        [name: string]: string;
    } | undefined, scopes: string[]): Promise<any>;
}
//# sourceMappingURL=common.d.ts.map