import { Link } from "@remix-run/react";
import "~/styles/index.css";

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
