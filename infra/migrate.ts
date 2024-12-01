
// TODO : did not work as expected to use lambda function to run the migration

import {vpc, rds, DATABASE_URL } from "./api";
const migration = new sst.aws.Function("MigrateApi", {
    vpc,
    url: true,
    link: [rds],
    handler: "./packages/migrate/index.handler",
    // copyFiles: [{ from: "node_modules/.prisma/client/" }],
  });