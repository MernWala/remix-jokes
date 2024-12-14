import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData, useRouteError } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const joke = await db.joke.findUnique({
        where: { id: params.jokeId }
    })

    if (!joke) {
        throw new Error("Joke not found");
    }

    return json({
        joke
    });
};

export function ErrorBoundary() {
    const error = useRouteError();
    if(error === "Joke not found") {
        
    }
}

export default function JokeRoute() {

    const data = useLoaderData<typeof loader>();

    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p> {data?.joke?.content} </p>
            <Link to=".">"{data.joke.name}" Permalink</Link>
        </div>
    );
}
