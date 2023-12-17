const express = require('express');

const app = express()
const PORT = 8000

app.get('/', (req, res) => {
  res.json({"message": "This is Express API which is deployed to vercel."})
})

app.get('/about', (req, res) => {
  res.json({"message": "This is about section."})
})

app.get("*", (req, res)=>{
  res.json({"message": "Invalid route."})
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
}) 
