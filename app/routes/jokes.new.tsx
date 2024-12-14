import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";

function validateJokeContent(content: string) {
    if (content.length < 10) {
        return "That joke is too short";
    }
}

function validateJokeName(name: string) {
    if (name.length < 3) {
        return "That joke's name is too short";
    }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const content = form.get("content");
    const name = form.get("name");

    if (typeof content !== "string" || typeof name !== "string") {
        return json({
            fieldErrors: null,
            fields: null,
            formError: "Form not submitted correctly.",
        }, { status: 400 });
    }

    const fields = { content, name };
    const fieldErrors = {
        content: validateJokeContent(content),
        name: validateJokeName(name),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return json({
            fieldErrors,
            fields,
            formError: null,
        }, { status: 400 });
    }

    const joke = await db.joke.create({ data: fields });
    return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {

    const actionData = useActionData<typeof action>();

    return (
        <div>
            <p>Add your own hilarious joke</p>
            <form method="post">
                <div>
                    <label>
                        Name:{" "}
                        <input
                            defaultValue={actionData?.fields?.name}
                            name="name"
                            type="text"
                            aria-invalid={Boolean(actionData?.fieldErrors?.name)}
                            aria-errormessage={actionData?.fieldErrors?.name ? "name-error" : undefined}
                        />
                    </label>
                    {actionData?.fieldErrors?.name && (
                        <p className="form-validation-error" id="name-error" role="alert"> {actionData.fieldErrors.name} </p>
                    )}
                </div>
                <div>
                    <label>
                        Content:{" "}
                        <textarea
                            defaultValue={actionData?.fields?.content}
                            name="content"
                            aria-invalid={Boolean(actionData?.fieldErrors?.content)}
                            aria-errormessage={actionData?.fieldErrors?.content ? "content-error" : undefined}
                        />
                    </label>
                    {actionData?.fieldErrors?.content && (
                        <p className="form-validation-error" id="content-error" role="alert"> {actionData.fieldErrors.content} </p>
                    )}
                </div>
                <div>
                    {actionData?.formError && (
                        <p className="form-validation-error" role="alert"> {actionData.formError} </p>
                    )}
                    <button type="submit" className="button"> Add </button>
                </div>
            </form>
        </div>
    );
}
