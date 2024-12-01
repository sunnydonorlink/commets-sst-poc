export const vpc = new sst.aws.Vpc("CommentsVpc", { bastion: true, nat: "managed" });

export const rds = new sst.aws.Postgres("CommentsPostgres", { vpc });

export const cluster = new sst.aws.Cluster("commentsCluster", { vpc });

export const DATABASE_URL = $interpolate`postgresql://${rds.username}:${rds.password}@${rds.host}:${rds.port}/${rds.database}`;

new sst.x.DevCommand("Prisma", {
    environment: { DATABASE_URL },
    dev: {
      autostart: false,
      command: "npx prisma studio",
      directory: "./packages/backend",
    },
  });

export const service = cluster.addService("ApiService", {
  link: [rds],
  environment: { DATABASE_URL },
  loadBalancer: {
    ports: [{ listen: "80/http" }],
  },
  dev: {
    command: "tsx watch --clear-screen=false ./backend/src/index.ts | pino-pretty",
  },
  image: {
    context: "./packages/backend",
    dockerfile: "./packages/backend/Dockerfile",
    tags: ["v1.0.0"],
  },
});

