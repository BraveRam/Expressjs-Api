const express = require('express');
const { createHmac } = require("crypto"); 

const app = express()
const PORT = 8000

app.get('/', (req, res) => {
  res.json({"message": "This is Express API - deployed to vercel."})
})
/*
app.get('/about', (req, res) => {
  res.json({"message": "This is about section."})
})

app.get("*", (req, res)=>{
  res.json({"message": "Invalid route."})
})*/

function HMAC_SHA256(key: string | Buffer, secret: string) {
  return createHmac("sha256", key).update(secret);
}

function getCheckString(data: URLSearchParams) {
	const items: [k: string, v: string][] = [];

	// remove hash
	for (const [k, v] of data.entries()) if (k !== "hash") items.push([k, v]);

	return items.sort(([a], [b]) => a.localeCompare(b)) // sort keys
		.map(([k, v]) => `${k}=${v}`) // combine key-value pairs
		.join("\n");
}

app.post("/validate-init", (req, res) => {
	const data = new URLSearchParams(req.body);

	const data_check_string = getCheckString(data);
	const secret_key = HMAC_SHA256("WebAppData", process.env.BOT_TOKEN!).digest();
	const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

	if (hash === data.get("hash"))
		// validated!
		return res.json(Object.fromEntries(data.entries()));

	return res.status(401).json({});
});
        

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
}) 

// on the server

