const package = require(__dirname + '/../package.json')
const host = `http://${process.env.IP}:${process.env.PORT}`;

module.exports = {
  info: {
    // API informations (required)
    title: package['swagger-info'].title, // Title (required)
    version: package.version, // Version (required)
    description: package.description, // Description (optional)
    contact: {
        name: package['swagger-info'].contact.name,
        email: package['swagger-info'].contact.email
    }
  },
  host: host,       // Host (optional)
  basePath: '/',    // Base path (optional)
  schemes: [
      "https"       // Only https is supported.
  ],
  consumes: [
      "application/json"    // Only JSON is supported.
  ],
  produces: [
      "application/json"    // Only JSON is supported.
  ],
  apis: ['./src/route*.js', './swagger/definitions.yaml'] 
};