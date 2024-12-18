import type { ActionFunctionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import { Form, json, Link, useActionData, useSearchParams } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { createUserSession, login, register } from "~/utils/session.server";
import "~/styles/login.css";

function validateUsername(username: string) {
    if (username.length < 3) {
        return "Usernames must be at least 3 characters long";
    }
}

function validatePassword(password: string) {
    if (password.length < 6) {
        return "Passwords must be at least 6 characters long";
    }
}

function validateUrl(url: string) {
    const urls = ["/jokes", "/", "https://remix.run"];
    if (urls.includes(url)) {
        return url;
    }
    return "/jokes";
}

export const meta: MetaFunction = () => {
    const description = "Login to submit your own jokes to Remix Jokes!";
    return [
        { name: "description", content: description },
        { name: "twitter:description", content: description },
        { title: "Remix Jokes | Login" },
    ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const loginType = form.get("loginType");
    const password = form.get("password");
    const username = form.get("username");
    const redirectTo = validateUrl((form.get("redirectTo") as string) || "/jokes");

    if (typeof loginType !== "string" || typeof password !== "string" || typeof username !== "string") {
        return json({
            fieldErrors: null,
            fields: null,
            formError: "Form not submitted correctly.",
        }, { status: 400 });
    }

    const fields = { loginType, password, username };
    const fieldErrors = {
        password: validatePassword(password),
        username: validateUsername(username),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return json({
            fieldErrors,
            fields,
            formError: null,
        }, { status: 400 });
    }

    switch (loginType) {
        case "login": {
            const user = await login({ username, password });
            console.log(user);
            if (!user) {
                return json({
                    fieldErrors: null,
                    fields,
                    formError:
                        "Username/Password combination is incorrect",
                }, { status: 400 });
            }

            return createUserSession(user.id, redirectTo);
        }

        case "register": {
            const userExists = await db.user.findFirst({
                where: { username },
            });

            if (userExists) {
                return json({
                    fieldErrors: null,
                    fields,
                    formError: `User with username ${username} already exists`,
                }, { status: 400 });
            }

            const user = await register({ username, password });
            if (!user) {
                return json({
                    fieldErrors: null,
                    fields,
                    formError:
                        "Something went wrong trying to create a new user.",
                }, { status: 400 });
            }

            return createUserSession(user.id, redirectTo);
        }

        default: {
            return json({
                fieldErrors: null,
                fields,
                formError: "Login type invalid",
            }, { status: 400 });
        }
    }
};

export default function Login() {

    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();

    return (
        <div className="container">
            <div className="content" data-light="">
                <h1>Login</h1>
                <Form method="post">
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={searchParams.get("redirectTo") ?? undefined}
                    />
                    <fieldset>
                        <legend className="sr-only">
                            Login or Register?
                        </legend>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    !actionData?.fields?.loginType ||
                                    actionData?.fields?.loginType === "login"
                                }
                            />{" "}
                            Login
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={actionData?.fields?.loginType === "register"}
                            />{" "}
                            Register
                        </label>
                    </fieldset>
                    <div>
                        <label htmlFor="username-input">Username</label>
                        <input
                            type="text"
                            id="username-input"
                            name="username"
                            defaultValue={actionData?.fields?.username}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.username
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.username
                                    ? "username-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.username ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="username-error"
                            >
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            type="password"
                            defaultValue={actionData?.fields?.password}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.password
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.password
                                    ? "password-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.password ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="password-error"
                            >
                                {actionData.fieldErrors.password}
                            </p>
                        ) : null}
                    </div>
                    <div id="form-error-message">
                        {actionData?.formError ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                            >
                                {actionData.formError}
                            </p>
                        ) : null}
                    </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                </Form>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
