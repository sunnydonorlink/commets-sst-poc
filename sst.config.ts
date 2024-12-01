/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "comments-sst-poc",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    await import("./infra/web");
    const api = await import("./infra/api");
    // const migrate = await import("./infra/migrate");

    return {
      Region: aws.getRegionOutput().name,
      DATABASE_URL: api.DATABASE_URL,
    };
  },
});
