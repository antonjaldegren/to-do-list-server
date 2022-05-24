# TODO LIST API

## General instructions

### Server

Prerequisites:

-   [Node.js](https://nodejs.org/en/)

Run the following command in the root folder to start the server:

```
$ node server.js
```

The server is preconfigured to run on http://localhost:4000. To use another port, run the following command (replacing `[YOUR_PORT]` with your desired port number):

```
$ PORT=[YOUR_PORT] node server.js
```

### Client

-   In examples where ID is required - replace `[ID]` in the URL with the ID string of an existing todo.
-   All data must be sent in JSON format as specified in each section below.
-   Incomplete or invalid data (caused by key names, value types, and lengths that does not meet the requirements defined below) will result in a `400: Bad request` response from the server.
-   Superfluous data sent in addition to valid data will not trigger an error, but will be ignored by the server.

## GET - Get all todos

### Request

```js
fetch("http://localhost:4000/todos");
```

### Response

**HTTP status code:**  
`200`

**JSON data:**

```json
[
	{
		"id": "41e091e58b95ae961aeb69bb",
		"title": "Do the dishes",
		"isCompleted": false
	},
	/*...*/
	{
		"id": "32c7e5cba83703eed1b8e84e",
		"title": "Clean the gutters",
		"isCompleted": true
	}
]
```

## GET - Get single todo

### Request

```js
fetch("http://localhost:4000/todos/[ID]");
```

### Response

**HTTP status code:**  
`200`

**JSON data:**

```json
{
	"id": "91fe9693983d8a4a778e8d3b",
	"title": "Walk the dog",
	"isCompleted": false
}
```

## POST - Add new todo

The following key must be provided in the JSON object when the request is sent:

-   `"title"` (value must be of type `string` and have a length > 0)

### Request

```js
fetch("http://localhost:4000/todos", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		title: "Do the laundry",
	}),
});
```

### Response

**HTTP status code:**  
`201`

**JSON data:**

```json
{
	"success": "Item successfully added"
}
```

## PUT - Edit todo (full)

**ALL** of the following keys must be provided in the JSON object when the request is sent:

-   `"title"` (value must be of type `string` and have a length > 0)
-   `"isCompleted"` (value must be of type `boolean`)

### Request

```js
fetch("http://localhost:4000/todos/[ID]", {
	method: "PUT",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		title: "Mow the lawn",
		isCompleted: false,
	}),
});
```

### Response

**HTTP status code:**  
`200`

**JSON data:**

```json
{
	"success": "Item successfully edited"
}
```

## PATCH - Edit todo (partial)

**ONE OR MORE** of the following keys must be provided in the JSON object when the request is sent:

-   `"title"` (value must be of type `string` and have a length > 0)
-   `"isCompleted"` (value must be of type `boolean`)

### Request

```js
fetch("http://localhost:4000/todos/[ID]", {
	method: "PATCH",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		isCompleted: true,
	}),
});
```

### Response

**HTTP status code:**  
`200`

**JSON data:**

```json
{
	"success": "Item successfully edited"
}
```

## DELETE - Delete todo

### Request

```js
fetch("http://localhost:4000/todos/[ID]", {
	method: "DELETE",
});
```

### Response

**HTTP status code:**  
`200`

**JSON data:**

```json
{
	"success": "Item successfully deleted"
}
```
