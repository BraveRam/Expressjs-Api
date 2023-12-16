const express = require('express');

const app = express()
const PORT = 8000

app.get('/', (req, res) => {
  res.json({"message": "This is Express API."})
})

app.get('/about', (req, res) => {
  res.send('About route 🎉 ')
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
}) 
