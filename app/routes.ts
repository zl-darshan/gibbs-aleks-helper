import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/migration", "routes/migration.tsx"),
] satisfies RouteConfig;
