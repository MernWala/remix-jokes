import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Outlet } from "@remix-run/react";

import "./styles/global.css";
import "./styles/global-large.css";
import "./styles/global-medium.css";

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: globalStylesUrl },
  // { rel: "stylesheet", href: globalLargeStylesUrl },
  // { rel: "stylesheet", href: globalMediumStylesUrl },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
