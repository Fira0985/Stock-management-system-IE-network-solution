const express = require('express');
const app = express();
const router = require('./routes/route');

app.use(express.json());
app.use('/api', router); // base path

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
