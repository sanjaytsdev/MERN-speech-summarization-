const express = require('express');
const cors = require('cors');
var summarizefy = require("summarizefy")


const port = 5000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.post('/summarize', async (req, res) => {
  const { Text } = req.body;
  console.log(Text)
 var summary =  summarizefy(Text)

  res.json({ summary });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
