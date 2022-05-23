const fs = require("fs");

const DATA_FILE = "data.json";

const VALID_DATA_KEYS = {
	POST: ["title"],
	PATCH: ["title", "isCompleted"],
	PUT: ["title", "isCompleted"],
};

const VALID_METHODS = {
	withId: ["OPTIONS", "GET", "PUT", "PATCH", "DELETE"],
	withoutId: ["OPTIONS", "GET", "POST"],
};

function validateReq(req) {
	const hasId = /^(\/todos\/[a-zA-Z0-9]+)\/?$/.test(req.url);
	const hasNoId = /^(\/todos)\/?$/.test(req.url);

	if (hasId)
		return {
			urlIsValid: true,
			methodIsValid: VALID_METHODS.withId.includes(req.method),
			reqId: req.url.match(/(?<=(\/todos\/))[a-zA-Z0-9]+(?=\/?)/)[0],
		};
	else if (hasNoId)
		return {
			urlIsValid: true,
			methodIsValid: VALID_METHODS.withoutId.includes(req.method),
			reqId: null,
		};
	return {
		urlIsValid: false,
		methodIsValid: false,
		reqId: null,
	};
}

function isValidData(todo, method) {
	if (typeof todo !== "object" || todo === null || Array.isArray(todo))
		return false;
	if (method === "POST") {
		return typeof todo.title === "string" && todo.title.length > 0;
	} else if (method === "PATCH")
		return (
			(typeof todo.title === "string" && todo.title.length > 0) ||
			typeof todo.isCompleted === "boolean"
		);
	return (
		typeof todo.title === "string" &&
		todo.title.length > 0 &&
		typeof todo.isCompleted === "boolean"
	);
}

function trimData(todo, method) {
	Object.keys(todo).forEach(
		(key) => !VALID_DATA_KEYS[method].includes(key) && delete todo[key]
	);
	return todo;
}

function writeFile(res, content, method) {
	const json = JSON.stringify(content, null, "\t");
	fs.writeFile(DATA_FILE, json, (err) => {
		if (err) {
			createResponse(res, 500, {
				error: "Internal server error",
			});
			console.log(err.message);
		}
		switch (method) {
			case "PUT":
			case "PATCH":
				createResponse(res, 200, {
					success: "Item succesfully edited",
				});
				break;
			case "POST":
				createResponse(res, 201, {
					success: "Item succesfully added",
				});
				break;
			case "DELETE":
				createResponse(res, 200, {
					success: "Item succesfully deleted",
				});
				break;
		}
	});
}

function createResponse(res, statusCode, content = null) {
	res.statusCode = statusCode;
	content && res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.end(content ? JSON.stringify(content, null, "\t") : null);
}

module.exports = {
	DATA_FILE,
	validateReq,
	isValidData,
	trimData,
	writeFile,
	createResponse,
};
