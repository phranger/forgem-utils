"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const RootPath = '/modelderivative/v2';
const ReadTokenScopes = ['data:read'];
const WriteTokenScopes = ['data:read', 'data:write', 'data:create'];
/**
 * Client providing access to Autodesk Forge
 * {@link https://forge.autodesk.com/en/docs/model-derivative/v2|model derivative APIs}.
 * @tutorial model-derivative
 */
class ModelDerivativeClient extends common_1.ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region.
     */
    constructor(auth, host, region) {
        super(RootPath, auth, host, region);
    }
    /**
     * Gets a list of supported translation formats.
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/formats-GET|docs}).
     * @async
     * @yields {Promise<IDerivativeFormats>} Dictionary of all supported output formats
     * mapped to arrays of formats these outputs can be obtained from.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async formats() {
        const response = await this.get('/designdata/formats', {}, ReadTokenScopes);
        return response.formats;
    }
    /**
     * Submits a translation job
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/job-POST|docs}).
     * @async
     * @param {string} urn Document to be translated.
     * @param {IDerivativeOutputType[]} outputs List of requested output formats. Currently the one
     * supported format is `{ type: 'svf', views: ['2d', '3d'] }`.
     * @returns {Promise<IJob>} Translation job details, with properties 'result',
     * 'urn', and 'acceptedJobs'.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async submitJob(urn, outputs) {
        const params = {
            input: {
                urn: urn
            },
            output: {
                formats: outputs
            }
        };
        return this.post('/designdata/job', { json: params }, {}, WriteTokenScopes);
    }
    /**
     * Retrieves manifest of a derivative.
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @returns {Promise<IDerivativeManifest>} Document derivative manifest.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getManifest(urn) {
        return this.get(this.region === common_1.Region.EMEA ? `/regions/eu/designdata/${urn}/manifest` : `/designdata/${urn}/manifest`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves metadata of a derivative.
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @returns {Promise<IDerivativeMetadata>} Document derivative metadata.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getMetadata(urn) {
        return this.get(this.region === common_1.Region.EMEA ? `/regions/eu/designdata/${urn}/metadata` : `/designdata/${urn}/metadata`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves object tree of a specific viewable.
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-guid-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {string} guid Viewable GUID.
     * @returns {Promise<IDerivativeTree>} Viewable object tree.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getViewableTree(urn, guid) {
        return this.get(this.region === common_1.Region.EMEA ? `/regions/eu/designdata/${urn}/metadata/${guid}` : `/designdata/${urn}/metadata/${guid}`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves properties of a specific viewable.
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-guid-properties-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {string} guid Viewable GUID.
     * @returns {Promise<IDerivativeProps>} Viewable properties.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getViewableProperties(urn, guid) {
        return this.get(this.region === common_1.Region.EMEA ? `/regions/eu/designdata/${urn}/metadata/${guid}/properties?forceget=true` : `/designdata/${urn}/metadata/${guid}/properties?forceget=true`, {}, ReadTokenScopes, true);
    }
}
exports.ModelDerivativeClient = ModelDerivativeClient;
