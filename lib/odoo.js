const { create } = require("axios").default;

const { PATHS, METHODS } = require("./constants");
const JsonRpc = require("./rpc");

class Odoo {
  constructor(config = {}) {
    this.host = config.host;
    this.port = parseInt(config.port) || 80;
    this.username = config.username;
    this.database = config.database;
    this.password = config.password;
    this.uri = config.uri;

    this.http = create({
      baseURL: this.uri,
    });
  }

  async authenticate() {
    const response = await this.http.post(PATHS.AUTHENTICATION, {
      params: {
        db: this.database,
        login: this.username,
        password: this.password,
      },
    });

    const { data } = response;

    this.uid = data.result.uid;
    this.sid = response.headers["set-cookie"][0].split(";")[0] + ";";
    this.session_id = data.result.session_id;
    this.context = data.result.user_context;
    this.jsonRpc = new JsonRpc({
      host: this.host,
      port: this.port,
      session_id: this.sid,
    });
  }

  /**
   * @description Search Odoo Records
   */

  async search({
    model,
    domain = [],
    fields = [],
    limit = 80,
    offset = 0,
    order = null,
  }) {
    if (!model) {
      throw new Error("Model property is required");
    }

    const records = await this.jsonRpc.call({
      model,
      method: METHODS.SEARCH_READ,
      args: [],
      kwargs: {
        context: this.context,
        domain,
        offset,
        limit,
        fields,
        order,
      },
    });

    return records;
  }

  /**
   * @description Create Odoo Record
   */
  async create(model, body) {
    if (!model) {
      throw new Error("Model property is required");
    }

    const record = await this.jsonRpc.call({
      model,
      method: METHODS.CREATE,
      args: [body],
      kwargs: {
        context: this.context,
      },
    });

    return record;
  }

  /**
   * @description Update Odoo Record
   */
  async write(model, id, body) {
    if (!model) {
      throw new Error("Model property is required");
    }

    try {
      const record = await this.jsonRpc.call({
        model,
        method: METHODS.WRITE,
        args: [[id], body],
        kwargs: {
          context: this.context,
        },
      });

      return record;
    } catch ({ data }) {
      console.log({ name: data.name, message: data.message });
    }
  }

  /**
   * @description Remove Odoo Record
   */
  async unlink(model, id) {
    if (!model) {
      throw new Error("Model property is required");
    }

    try {
      const record = await this.jsonRpc.call({
        model,
        method: METHODS.UNLINK,
        args: [[id]],
        kwargs: {
          context: this.context,
        },
      });

      return record;
    } catch ({ data }) {
      console.log({ name: data.name, message: data.message });
    }
  }
}

module.exports = Odoo;
