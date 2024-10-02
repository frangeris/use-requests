<div align="center">
	<br>
	<br>
	<img width="712" src="assets/logo.png" alt="use requests">
	<br>
	<br>
	<br>
	<br>
</div>

**Support questions should be asked [here](https://github.com/frangeris/use-requests/discussions).**

## Install

> [!CAUTION]
> This package is still in development and not ready for production use.

```sh
npm install use-requests
```

## Get started

This module provides a lightweight abstraction for making API requests in TypeScript, with a focus on defining and using REST API endpoints efficiently. The module offers a clean, type-safe way to handle HTTP requests using predefined endpoints.

Some key features:

- ✨ Type-safe API endpoint handling.
- ⚡️ Easy initialization with API base URL and endpoints.
- 🦾 Simplified request logic with _GET_, _POST_, and other HTTP methods via [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) API.

## Usage

To begin using the API request module, you need to initialize it by specifying the base URL of your API and defining the endpoints you'll be working with. This setup ensures that all subsequent API requests are made to the correct URLs with consistent endpoint handling.

First, you’ll need to import the necessary functions.

- The `useRequests` function is the core hook for making requests.
- While `init` sets up the configuration for your API requests and can be called from anywhere in your app.

Here's how you import them from the module:

```ts
import { useRequests, init } from "use-requests";
```

Then, you'll define your API endpoints using an [enum](https://www.typescriptlang.org/docs/handbook/enums.html). This `enum` acts as a centralized way to declare all the routes your API supports. It also helps ensure that requests are type-safe, meaning you'll get compile-time checks for correct usage:

```ts
export enum Endpoints {
	config = "/config",
	test = "/test/:id",
}
```

Each key in the enum represents a different API route. These routes can contain dynamic parameters (e.g., `:id`), which are replaced by actual values when making requests.

Now, we need to initialize the by using the `init` function. This function requires two arguments:

- **Base URL**: The root URL where your API is hosted (e.g., https://api.example.io/dev).
- **Endpoints**: The enum you defined earlier, which specifies your available API routes.

```ts
init("https://api.example.io/dev", { ...Endpoints });
```

- `https://api.example.io/dev` is the base URL of the API.
- The spread operator `{ ...Endpoints }` ensures that all the endpoints defined in the `Endpoints` enum are passed to the initialization function.

By setting up this initialization, you ensure that every request you make using the `useRequests` hook will automatically target the correct API with the predefined endpoints.

### Now, let's make request

Once the module is initialized, you can easily make requests to the defined endpoints. Here's an example of making a GET request to the test endpoint:

```ts
import { useRequests, init } from "use-requests";
// ...

const main = async () => {
	const { test, config } = useRequests<typeof Endpoints>();
	await test.get({
		params: { id: 1 }, // URL parameter (:id)
		query: { id: 1 }, // Query string (?id=1)
	});

	// Optionally, set headers for the request
	// test.headers.set("Authorization", "Bearer token");
};

main();
```

The test endpoint is accessed with an id parameter. You can also set headers (like authorization tokens) as needed.

## Why `use-requests`?

In modern web development, working with APIs is a common requirement, but it often comes with challenges such as:

- Boilerplate code: Repeating the same request logic for every API call.
- Hard-coded endpoints: Scattering API URLs and endpoints throughout your code, making it difficult to maintain and prone to errors.
- Lack of type safety: Incorrect or inconsistent endpoint usage often isn't caught until runtime, leading to more bugs and harder debugging.
- Manual query and param handling: When working with REST APIs, you often need to manage dynamic path parameters (`:id`, `:userId`, etc.) and query strings (`?id=1`) manually.

This module addresses these challenges by offering a _Type safety for API requests_, the module provides strict typing for your endpoints, ensuring that the routes, parameters, and query strings are used correctly at compile-time.

By using an enum to define all endpoints in one place, it becomes easier to update, maintain, and reuse API routes without worrying about inconsistent URL usage across your codebase.

Making request handling via the `useRequests` hook abstracts away much of the boilerplate required for making HTTP requests, allowing you to focus on the logic of your application instead of the details of constructing API calls.

As your API grows, you can simply add more routes to the Endpoints enum and have them immediately available across your project without rewriting any request logic.
