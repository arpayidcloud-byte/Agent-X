module.exports = {
  apps: [
    {
      name: "agentx-api-server",
      script: "node",
      args: "--experimental-specifier-resolution=node ./packages/api-server/dist/index.js",
      cwd: "/root/Agent-X",
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    },
    {
      name: "agentx-web-dashboard",
      script: "./node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/root/Agent-X/apps/web",
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
