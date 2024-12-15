import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import globalStyle from "~/styles/index.css";

export const links: LinksFunction = () => [
  { type: "stylesheet", href: globalStyle, rel: "stylesheet" },
];

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
            <li>
              <Link reloadDocument to="/jokes.rss">RSS</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
