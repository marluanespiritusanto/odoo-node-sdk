const jayson = require("jayson");
const { PATHS } = require("./constants");

class JsonRpc {
  constructor({ host, port, session_id }) {
    this.host = host;
    this.port = port;
    this.session_id = session_id;
  }

  call(params) {
    return new Promise((resolve, reject) => {
      const client = jayson.client.http({
        host: this.host,
        port: this.port,
        path: PATHS.CALL_KW,
        headers: {
          Cookie: this.session_id,
        },
      });

      client.request("call", params, (e, err, res) => {
        if (e || err) {
          reject(e || err);
        }

        return resolve(res);
      });
    });
  }
}

module.exports = JsonRpc;
