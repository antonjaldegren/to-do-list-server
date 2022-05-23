const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
const {
	DATA_FILE,
	validateReq,
	isValidData,
	trimData,
	writeFile,
	createResponse,
} = require("./utils");

const PORT = process.env.PORT || 4000;

let todos = [];

if (!fs.existsSync(DATA_FILE)) {
	fs.writeFile(
		DATA_FILE,
		JSON.stringify([]),
		(err) => err && console.log(err.message)
	);
} else {
	fs.readFile(DATA_FILE, "utf8", (err, data) => {
		if (err) console.log(err.message);
		todos = JSON.parse(data);
	});
}

const app = http.createServer((req, res) => {
	console.log(`${req.method} request to url ${req.url}`);

	const { urlIsValid, methodIsValid, reqId } = validateReq(req);
	if (!urlIsValid) {
		createResponse(res, 404, { error: "Path not found" });
		return;
	} else if (!methodIsValid) {
		createResponse(res, 405, { error: "Method not allowed" });
		return;
	}

	const i = todos.findIndex((todo) => todo.id === reqId);
	if (reqId && i === -1) {
		createResponse(res, 404, {
			error: `No match was found for ID: ${reqId}`,
		});
		return;
	}

	switch (req.method) {
		case "OPTIONS":
			res.setHeader(
				"Access-Control-Allow-Methods",
				"GET, PATCH, DELETE, OPTIONS, POST, PUT"
			);
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
			createResponse(res, 204);
			break;
		case "GET":
			createResponse(
				res,
				200,
				reqId ? todos.find((todo) => todo.id === reqId) : todos
			);
			break;
		case "POST":
			req.on("data", (chunk) => {
				const data = JSON.parse(chunk);
				console.log(data);
				if (!isValidData(data, req.method)) {
					createResponse(res, 400, {
						error: "The data provided is invalid",
					});
					return;
				}
				todos.push({
					id: crypto.randomBytes(12).toString("hex"),
					isCompleted: false,
					...trimData(data, req.method),
				});
				writeFile(res, todos, req.method);
			});
			break;
		case "PUT":
		case "PATCH":
			req.on("data", (chunk) => {
				const data = JSON.parse(chunk);
				if (!isValidData(data, req.method)) {
					createResponse(res, 400, {
						error: "The data provided is invalid",
					});
					return;
				}
				todos[i] = { ...todos[i], ...trimData(data, req.method) };
				writeFile(res, todos, req.method);
			});
			break;
		case "DELETE":
			todos.splice(i, 1);
			writeFile(res, todos, req.method);
			break;
	}
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
