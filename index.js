import { createServer } from "http";
import { parse } from "url";
import { Registry, collectDefaultMetrics } from "prom-client";

// Create a Registry which registers the metrics
const register = new Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "example-nodejs-app",
});

// Enable the collection of default metrics
collectDefaultMetrics({ register });

// Define the HTTP server
const server = createServer(async (req, res) => {
  const route = parse(req.url).pathname;
  if (route === "/metrics") {
    res.setHeader("Content-Type", register.contentType);
    register.metrics().then((metrics) => res.end(metrics));
  }
});

// Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
server.listen(8080);
