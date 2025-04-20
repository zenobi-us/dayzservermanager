/*
 A DayZ Linux server provisioning system.

 This is the web UI for provisioning a DayZ server running under Linux.
 It manages the main container that installs and maintains the base DayZ server files
 along with all mod base files. The goal being to keep all of these centralized and consistent,
 but to also make them available for the creation of server containers.
 */
import express from "express";
import viteDevServer from "vavite/vite-dev-server";
import { config } from "./constants";
import { lazy } from "./core/lazy";

const app = express();

app.use((_, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

if (import.meta.env.PROD) {
  // Serve client assets in production
  app.use(express.static("dist/ui"));
}

app.use(
  "meta",
  lazy(() => import("./routes/meta"))
);
app.use(
  "steam",
  lazy(() => import("./routes/steam"))
);
app.use(
  "server",
  lazy(() => import("./routes/server"))
);
app.use(
  "mods",
  lazy(() => import("./routes/mods"))
);


// app.listen(config.port, () => {
//   console.log(`Listening on port ${config.port}`);
// });

export default app