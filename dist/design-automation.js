"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const RootPath = '/da/us-east/v3';
const CodeScopes = ['code:all'];
const ActivityParameterProps = ['description', 'localName', 'required', 'zip', 'ondemand'];
const WorkitemParameterProps = ['localName', 'optional', 'pathInZip', 'headers'];
/**
 * Helper class for working with Design Automation
 * {@link https://forge.autodesk.com/en/docs/design-automation/v3/developers_guide/aliases-and-ids|aliases and IDs}.
 */
class DesignAutomationID {
    /**
     * Creates new fully qualified ID.
     * @param {string} owner Owner part of the fully qualified ID. Must consist of a-z, A-Z, 0-9 and _ characters only.
     * @param {string} id ID part of the fully qualified ID. Must consist of a-z, A-Z, 0-9 and _ characters only.
     * @param {string} alias Alias part of the fully qualified ID. Must consist of a-z, A-Z, 0-9 and _ characters only.
     */
    constructor(owner, id, alias) {
        this.owner = owner;
        this.id = id;
        this.alias = alias;
    }
    /**
     * Parses fully qualified ID.
     * @param {string} str Fully qualified ID.
     * @returns {DesignAutomationID|null} Parsed ID or null if the format was not correct.
     */
    static parse(str) {
        const match = str.match(/^([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\+([\$a-zA-Z0-9_]+)$/);
        if (match) {
            return new DesignAutomationID(match[1], match[2], match[3]);
        }
        else {
            return null;
        }
    }
    /**
     * Outputs the fully qualified ID in a form expected by Design Automation endpoints.
     */
    toString() {
        return `${this.owner}.${this.id}+${this.alias}`;
    }
}
exports.DesignAutomationID = DesignAutomationID;
/**
 * Client providing access to Autodesk Forge
 * {@link https://forge.autodesk.com/en/docs/design-automation/v3|design automation APIs}.
 * @tutorial design-automation
 */
class DesignAutomationClient extends common_1.ForgeClient {
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
    // Iterates (asynchronously) over pages of paginated results
    async *_pager(endpoint, scopes) {
        let response = await this.get(endpoint, {}, scopes);
        yield response.data;
        while (response.paginationToken) {
            response = await this.get(`${endpoint}?page=${response.paginationToken}`, {}, scopes);
            yield response.data;
        }
    }
    // Collects all pages of paginated results
    async _collect(endpoint, scopes) {
        let response = await this.get(endpoint, {}, scopes);
        let results = response.data;
        while (response.paginationToken) {
            response = await this.get(`${endpoint}?page=${response.paginationToken}`, {}, scopes);
            results = results.concat(response.data);
        }
        return results;
    }
    /**
     * Iterates over all engines in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/engines-GET|docs}).
     * @async
     * @generator
     * @yields {AsyncIterable<string[]>} List of engine (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateEngines() {
        for await (const engines of this._pager('/engines', CodeScopes)) {
            yield engines;
        }
    }
    /**
     * Gets a list of all engines
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/engines-GET|docs}).
     * @async
     * @returns {Promise<string[]>} List of engine (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listEngines() {
        return this._collect('/engines', CodeScopes);
    }
    /**
     * Gets single engine details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/engines-id-GET|docs}).
     * @async
     * @param {string} engineId Fully qualified engine ID.
     * @returns {Promise<IEngineDetail>} Engine details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getEngine(engineId) {
        return this.get(`/engines/${engineId}`, {}, CodeScopes);
    }
    /**
     * Iterates over all app bundles in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-GET|docs}).
     * @async
     * @generator
     * @yields {AsyncIterable<string[]>} List of appbundle (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateAppBundles() {
        for await (const bundles of this._pager('/appbundles', CodeScopes)) {
            yield bundles;
        }
    }
    /**
     * Gets a list of all appbundles
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-GET|docs}).
     * @async
     * @returns {Promise<string[]>} List of appbundle (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listAppBundles() {
        return this._collect('/appbundles', CodeScopes);
    }
    /**
     * Gets single appbundle details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-GET|docs}).
     * @async
     * @param {string} bundleId Fully qualified appbundle ID.
     * @returns {Promise<IAppBundleDetail>} Appbundle details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getAppBundle(bundleId) {
        return this.get(`/appbundles/${bundleId}`, {}, CodeScopes);
    }
    /**
     * Gets single appbundle version details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-version-GET|docs}).
     * @async
     * @param {string} id Short (unqualified) app bundle ID.
     * @param {number} version App bundle version.
     * @returns {Promise<IAppBundleDetail>} Appbundle details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getAppBundleVersion(id, version) {
        return this.get(`/appbundles/${id}/versions/${version}`, {}, CodeScopes);
    }
    /**
     * Creates a new app bundle
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-POST|docs}).
     * @async
     * @param {string} name Unique name of the bundle.
     * @param {string} engine ID of one of the supported {@link engines}.
     * @param {string} description Bundle description.
     * @returns {Promise<IAppBundleDetail>} Details of created app bundle.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async createAppBundle(name, engine, description) {
        const config = { id: name, description: description, engine: engine };
        return this.post('/appbundles', { json: config }, {}, CodeScopes);
    }
    /**
     * Updates an existing app bundle, creating its new version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-POST|docs}).
     * @async
     * @param {string} name Unique name of the bundle.
     * @param {string} [engine] ID of one of the supported {@link engines}.
     * @param {string} [description] Bundle description.
     * @returns {Promise<IAppBundleDetail>} Details of updated app bundle.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async updateAppBundle(name, engine, description) {
        // TODO: tests
        const config = {};
        if (description)
            config.description = description;
        if (engine)
            config.engine = engine;
        return this.post(`/appbundles/${name}/versions`, { json: config }, {}, CodeScopes);
    }
    /**
     * Iterates over all app bundle aliases in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of the bundle.
     * @yields {AsyncIterable<IAlias[]>} List of appbundle alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateAppBundleAliases(name) {
        for await (const aliases of this._pager(`/appbundles/${name}/aliases`, CodeScopes)) {
            yield aliases;
        }
    }
    /**
     * Gets a list of all appbundle aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-GET|docs}).
     * @async
     * @param {string} name Unique name of the bundle.
     * @returns {Promise<IAlias[]>} List of appbundle alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listAppBundleAliases(name) {
        return this._collect(`/appbundles/${name}/aliases`, CodeScopes);
    }
    /**
     * Iterates over all app bundle versions in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of the bundle.
     * @yields {AsyncIterable<number[]>} List of appbundle version numbers.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateAppBundleVersions(name) {
        for await (const versions of this._pager(`/appbundles/${name}/versions`, CodeScopes)) {
            yield versions;
        }
    }
    /**
     * Gets a list of all appbundle versions
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-GET|docs}).
     * @async
     * @param {string} name Unique name of the bundle.
     * @returns {Promise<number[]>} List of appbundle version numbers.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listAppBundleVersions(name) {
        return this._collect(`/appbundles/${name}/versions`, CodeScopes);
    }
    /**
     * Creates new alias for an app bundle
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-POST/|docs}).
     * @async
     * @param {string} name Name of the app bundle.
     * @param {string} alias Alias name.
     * @param {number} version Version of app bundle to link to this alias.
     * @returns {Promise<IAlias>} Details of the created alias.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async createAppBundleAlias(name, alias, version) {
        // TODO: tests
        const config = { id: alias, version: version };
        return this.post(`/appbundles/${name}/aliases`, { json: config }, {}, CodeScopes);
    }
    /**
     * Updates existing alias for an app bundle
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-aliasId-PATCH/|docs}).
     * @async
     * @param {string} name Name of the app bundle.
     * @param {string} alias Alias name.
     * @param {number} version Version of app bundle to link to this alias.
     * @returns {Promise<IAlias>} Details of the updated alias.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async updateAppBundleAlias(name, alias, version) {
        // TODO: tests
        const config = { version: version };
        return this.patch(`/appbundles/${name}/aliases/${alias}`, { json: config }, {}, CodeScopes);
    }
    /**
     * Deletes app bundle and all its versions and aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) app bundle ID.
     */
    async deleteAppBundle(shortId) {
        return this.delete(`/appbundles/${shortId}`, {}, CodeScopes);
    }
    /**
     * Deletes app bundle alias
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-aliasId-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) app bundle ID.
     * @param {string} alias App bundle alias.
     */
    async deleteAppBundleAlias(shortId, alias) {
        return this.delete(`/appbundles/${shortId}/aliases/${alias}`, {}, CodeScopes);
    }
    /**
     * Deletes app bundle version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-version-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) app bundle ID.
     * @param {number} version App bundle version.
     */
    async deleteAppBundleVersion(shortId, version) {
        return this.delete(`/appbundles/${shortId}/versions/${version}`, {}, CodeScopes);
    }
    /**
     * Iterates over all activities in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-GET|docs}).
     * @async
     * @generator
     * @yields {AsyncIterable<string[]>} List of activity (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateActivities() {
        for await (const activities of this._pager('/activities', CodeScopes)) {
            yield activities;
        }
    }
    /**
     * Gets a list of all activities
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-GET|docs}).
     * @async
     * @returns {Promise<string[]>} List of activity (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listActivities() {
        return this._collect('/activities', CodeScopes);
    }
    /**
     * Gets single activity details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-GET|docs}).
     * @async
     * @param {string} activityId Fully qualified activity ID.
     * @returns {Promise<object>} Activity details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getActivity(activityId) {
        return this.get(`/activities/${activityId}`, {}, CodeScopes);
    }
    /**
     * Gets single activity version details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-version-GET|docs}).
     * @async
     * @param {string} id Short (unqualified) activity ID.
     * @param {number} version Activity version.
     * @returns {Promise<IActivityDetail>} Activity details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getActivityVersion(id, version) {
        return this.get(`/activities/${id}/versions/${version}`, {}, CodeScopes);
    }
    _inventorActivityConfig(activityId, description, ownerId, bundleName, bundleAlias, engine, inputs, outputs) {
        const config = {
            commandLine: [`$(engine.path)\\InventorCoreConsole.exe /al $(appbundles[${bundleName}].path)`],
            parameters: {},
            description: description,
            engine: engine,
            appbundles: [`${ownerId}.${bundleName}+${bundleAlias}`]
        };
        if (activityId) {
            config.id = activityId;
        }
        if (inputs.length > 0 && Array.isArray(config.commandLine)) {
            config.commandLine[0] += ' /i';
            for (const input of inputs) {
                config.commandLine[0] += ` $(args[${input.name}].path)`;
                const param = config.parameters[input.name] = { verb: input.verb || 'get' };
                for (const prop of ActivityParameterProps) {
                    if (input.hasOwnProperty(prop)) {
                        param[prop] = input[prop];
                    }
                }
            }
        }
        for (const output of outputs) {
            const param = config.parameters[output.name] = { verb: output.verb || 'put' };
            for (const prop of ActivityParameterProps) {
                if (output.hasOwnProperty(prop)) {
                    param[prop] = output[prop];
                }
            }
        }
        return config;
    }
    _revitActivityConfig(activityId, description, ownerId, bundleName, bundleAlias, engine, inputs, outputs) {
        const config = {
            commandLine: [`$(engine.path)\\revitcoreconsole.exe /al $(appbundles[${bundleName}].path)`],
            parameters: {},
            description: description,
            engine: engine,
            appbundles: [`${ownerId}.${bundleName}+${bundleAlias}`]
        };
        if (activityId) {
            config.id = activityId;
        }
        if (inputs.length > 0 && Array.isArray(config.commandLine)) {
            config.commandLine[0] += ' /i';
            for (const input of inputs) {
                config.commandLine[0] += ` $(args[${input.name}].path)`;
                const param = config.parameters[input.name] = { verb: input.verb || 'get' };
                for (const prop of ActivityParameterProps) {
                    if (input.hasOwnProperty(prop)) {
                        param[prop] = input[prop];
                    }
                }
            }
        }
        for (const output of outputs) {
            const param = config.parameters[output.name] = { verb: output.verb || 'put' };
            for (const prop of ActivityParameterProps) {
                if (output.hasOwnProperty(prop)) {
                    param[prop] = output[prop];
                }
            }
        }
        return config;
    }
    _autocadActivityConfig(activityId, description, ownerId, bundleName, bundleAlias, engine, inputs, outputs, script) {
        const config = {
            commandLine: [`$(engine.path)\\accoreconsole.exe /al $(appbundles[${bundleName}].path)`],
            parameters: {},
            description: description,
            engine: engine,
            appbundles: [`${ownerId}.${bundleName}+${bundleAlias}`]
        };
        if (activityId) {
            config.id = activityId;
        }
        if (inputs.length > 0 && Array.isArray(config.commandLine)) {
            config.commandLine[0] += ' /i';
            for (const input of inputs) {
                config.commandLine[0] += ` $(args[${input.name}].path)`;
                const param = config.parameters[input.name] = { verb: input.verb || 'get' };
                for (const prop of ActivityParameterProps) {
                    if (input.hasOwnProperty(prop)) {
                        param[prop] = input[prop];
                    }
                }
            }
        }
        for (const output of outputs) {
            const param = config.parameters[output.name] = { verb: output.verb || 'put' };
            for (const prop of ActivityParameterProps) {
                if (output.hasOwnProperty(prop)) {
                    param[prop] = output[prop];
                }
            }
        }
        if (script && Array.isArray(config.commandLine)) {
            config.settings = {
                script: script
            };
            config.commandLine[0] += ' /s $(settings[script].path)';
        }
        return config;
    }
    _3dsmaxActivityConfig(activityId, description, ownerId, bundleName, bundleAlias, engine, inputs, outputs, script) {
        const config = {
            commandLine: `$(engine.path)\\3dsmaxbatch.exe`,
            parameters: {},
            description: description,
            engine: engine,
            appbundles: [`${ownerId}.${bundleName}+${bundleAlias}`]
        };
        if (activityId) {
            config.id = activityId;
        }
        if (inputs.length > 1) {
            throw new Error('3dsMax engine only supports single input file.');
        }
        else if (inputs.length > 0) {
            const input = inputs[0];
            config.commandLine += ` -sceneFile \"$(args[${input.name}].path)\"`;
            const param = config.parameters[input.name] = { verb: input.verb || 'get' };
            for (const prop of ActivityParameterProps) {
                if (input.hasOwnProperty(prop)) {
                    param[prop] = input[prop];
                }
            }
        }
        for (const output of outputs) {
            const param = config.parameters[output.name] = { verb: output.verb || 'put' };
            for (const prop of ActivityParameterProps) {
                if (output.hasOwnProperty(prop)) {
                    param[prop] = output[prop];
                }
            }
        }
        if (script) {
            config.settings = {
                script: script
            };
            config.commandLine += ' \"$(settings[script].path)\"';
        }
        return config;
    }
    /**
     * Creates new activity
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-POST|docs}).
     * @async
     * @param {string} id New activity ID.
     * @param {string} description Activity description.
     * @param {string} bundleName App bundle name.
     * @param {string} bundleAlias App bundle alias.
     * @param {string} engine ID of one of the supported {@link engines}.
     * @param {IActivityParam[]} inputs List of input descriptor objects, each containing required property `name`
     * and optional properties `description`, `localName`, `required`, `zip`, `ondemand`, and `verb` ("get" by default).
     * @param {IActivityParam[]} outputs List of output descriptor objects, each containing required property `name`
     * and optional properties `description`, `localName`, `required`, `zip`, `ondemand`, and `verb` ("put" by default).
     * @param {string} [script] Optional engine-specific script to pass to the activity.
     * @returns {Promise<IActivityDetail>} Details of created activity.
     */
    async createActivity(id, description, bundleName, bundleAlias, engine, inputs, outputs, script) {
        // TODO: tests
        const engineId = DesignAutomationID.parse(engine);
        if (!engineId) {
            throw new Error('Could not parse engine ID.');
        }
        if (!this.auth) {
            throw new Error('Cannot create activity without client ID.');
        }
        let config;
        switch (engineId.id) {
            case 'AutoCAD':
                config = this._autocadActivityConfig(id, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs, script);
                break;
            case '3dsMax':
                config = this._3dsmaxActivityConfig(id, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs, script);
                break;
            case 'Revit':
                config = this._revitActivityConfig(id, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs);
                break;
            case 'Inventor':
                config = this._inventorActivityConfig(id, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs);
                break;
        }
        return this.post('/activities', { json: config }, {}, CodeScopes);
    }
    /**
     * Updates existing activity, creating its new version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-POST|docs}).
     * @async
     * @param {string} id ID of updated activity.
     * @param {string} description Activity description.
     * @param {string} bundleName App bundle name.
     * @param {string} bundleAlias App bundle alias.
     * @param {string} engine ID of one of the supported {@link engines}.
     * @param {object[]} inputs List of input descriptor objects, each containing required property `name`
     * and optional properties `description`, `localName`, `required`, `zip`, `ondemand`, and `verb` ("get" by default).
     * @param {object[]} outputs List of output descriptor objects, each containing required property `name`
     * and optional properties `description`, `localName`, `required`, `zip`, `ondemand`, and `verb` ("put" by default).
     * @param {string} [script] Optional engine-specific script to pass to the activity.
     * @returns {Promise<object>} Details of created activity.
     */
    async updateActivity(id, description, bundleName, bundleAlias, engine, inputs, outputs, script) {
        // TODO: tests
        const engineId = DesignAutomationID.parse(engine);
        if (!engineId) {
            throw new Error('Could not parse engine ID.');
        }
        if (!this.auth) {
            throw new Error('Cannot create activity without client ID.');
        }
        let config;
        switch (engineId.id) {
            case 'AutoCAD':
                config = this._autocadActivityConfig(null, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs, script);
                break;
            case '3dsMax':
                config = this._3dsmaxActivityConfig(null, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs, script);
                break;
            case 'Revit':
                config = this._revitActivityConfig(null, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs);
                break;
            case 'Inventor':
                config = this._inventorActivityConfig(null, description, this.auth.clientId, bundleName, bundleAlias, engine, inputs, outputs);
                break;
        }
        return this.post(`/activities/${id}/versions`, { json: config }, {}, CodeScopes);
    }
    /**
     * Iterates over all activity aliases in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of activity.
     * @yields {AsyncIterable<IAlias[]>} List of activity alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateActivityAliases(name) {
        for await (const aliases of this._pager(`/activities/${name}/aliases`, CodeScopes)) {
            yield aliases;
        }
    }
    /**
     * Gets a list of all activity aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-GET|docs}).
     * @async
     * @param {string} name Unique name of activity.
     * @returns {Promise<IAlias[]>} List of activity alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listActivityAliases(name) {
        return this._collect(`/activities/${name}/aliases`, CodeScopes);
    }
    /**
     * Iterates over all activity versions in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of activity.
     * @yields {AsyncIterable<number[]>} List of activity versions.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateActivityVersions(name) {
        for await (const versions of this._pager(`/activities/${name}/versions`, CodeScopes)) {
            yield versions;
        }
    }
    /**
     * Gets a list of all activity versions
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-GET|docs}).
     * @async
     * @param {string} name Unique name of activity.
     * @returns {Promise<number[]>} List of activity versions.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listActivityVersions(name) {
        return this._collect(`/activities/${name}/versions`, CodeScopes);
    }
    /**
     * Creates new alias for an activity
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-POST|docs}).
     * @async
     * @param {string} id Activity ID.
     * @param {string} alias New alias name.
     * @param {number} version Activity version to link to this alias.
     * @returns {Promise<IAlias>} Details of created alias.
     */
    async createActivityAlias(id, alias, version) {
        // TODO: tests
        const config = { id: alias, version: version };
        return this.post(`/activities/${id}/aliases`, { json: config }, {}, CodeScopes);
    }
    /**
     * Updates existing alias for an activity
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-aliasId-PATCH|docs}).
     * @async
     * @param {string} id Activity ID.
     * @param {string} alias Activity alias.
     * @param {number} version Activity version to link to this alias.
     * @returns {Promise<IAlias>} Details of updated alias.
     */
    async updateActivityAlias(id, alias, version) {
        // TODO: tests
        const config = { version: version };
        return this.patch(`/activities/${id}/aliases/${alias}`, { json: config }, {}, CodeScopes);
    }
    /**
     * Deletes activity and all its versions and aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) activity ID.
     */
    async deleteActivity(shortId) {
        return this.delete(`/activities/${shortId}`, {}, CodeScopes);
    }
    /**
     * Deletes activity alias
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-aliasId-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) activity ID.
     * @param {string} alias Activity alias.
     */
    async deleteActivityAlias(shortId, alias) {
        return this.delete(`/activities/${shortId}/aliases/${alias}`, {}, CodeScopes);
    }
    /**
     * Deletes activity version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-version-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) activity ID.
     * @param {number} version Activity version.
     */
    async deleteActivityVersion(shortId, version) {
        return this.delete(`/activities/${shortId}/versions/${version}`, {}, CodeScopes);
    }
    /**
     * Gets details of a specific work item
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/workitems-id-GET|docs}).
     * @async
     * @param {string} id Work item ID.
     * @returns {Promise<object>} Work item details.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async workItemDetails(id) {
        return this.get(`/workitems/${id}`, {}, CodeScopes);
    }
    /**
     * Creates new work item
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/workitems-POST|docs}).
     * @async
     * @param {string} activityId Activity ID.
     * @param {IWorkItemParam[]} inputs List of input descriptor objects, each containing required properties `name`, `url`,
     * and optional properties `localName`, `optional`, `pathInZip`, `headers`, and `verb` ("get" by default).
     * @param {IWorkItemParam[]} outputs List of output descriptor objects, each containing required properties `name`, `url`,
     * and optional properties `localName`, `optional`, `pathInZip`, `headers`, and `verb` ("put" by default).
     */
    async createWorkItem(activityId, inputs, outputs) {
        // TODO: tests
        const config = {
            activityId: activityId,
            arguments: {}
        };
        for (const input of inputs) {
            const param = config.arguments[input.name] = { verb: input.verb || 'get', url: input.url };
            for (const prop of WorkitemParameterProps) {
                if (input.hasOwnProperty(prop)) {
                    param[prop] = input[prop];
                }
            }
        }
        for (const output of outputs) {
            const param = config.arguments[output.name] = { verb: output.verb || 'put', url: output.url };
            for (const prop of WorkitemParameterProps) {
                if (output.hasOwnProperty(prop)) {
                    param[prop] = output[prop];
                }
            }
        }
        return this.post('/workitems', { json: config }, {}, CodeScopes);
    }
    /**
     * Cancels work item, removing it from waiting queue or cancelling a running job
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/workitems-id-DELETE|docs}).
     * @async
     * @param {string} id Work item ID.
     */
    async deleteWorkItem(id) {
        return this.delete(`/workitems/${id}`, {}, CodeScopes);
    }
}
exports.DesignAutomationClient = DesignAutomationClient;
