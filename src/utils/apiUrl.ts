import { ClientPath } from "./ClientPath";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const getClientUrl = (path: ClientPath) => `${CLIENT_URL}${path}`;
