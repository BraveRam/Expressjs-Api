const express = require("express");
const { createHmac } = require("crypto");
const cors = require("cors");

const app = express();
const PORT = 8000;

app.use(cors({
 origin: ['https://www.section.io', 'https://www.google.com/']
 }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "This is Express API - deployed to Vercel." });
});

function HMAC_SHA256(key, secret) {
  return createHmac("sha256", key).update(secret);
}

function getCheckString(data) {
  const items = [];

  for (const [k, v] of data.entries()) if (k !== "hash") items.push([k, v]);

  return items
    .sort(([a], [b]) => a.localeCompare(b)) 
    .map(([k, v]) => `${k}=${v}`) 
    .join("\n");
}

app.post("/validate-init", express.text(), (req, res) => {
  const data = new URLSearchParams(req.body);

  const data_check_string = getCheckString(data);
  const secret_key = HMAC_SHA256("WebAppData", "6464751970:AAFfVZYceyuZV3gExwPELbnCwvKZtx1wdJw").digest();
  const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");
 
  if (hash === data.get("hash")) {
    // validated!
    return res.json(Object.fromEntries(data.entries()));
  } else {
    return res.status(401).json({"message": `Unauthorized ${data}`});
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
