const express = require("express");
const cors = require("cors");
var summarizefy = require("summarizefy");
const { PythonShell } = require("python-shell");
const { text } = require("body-parser");

const port = 5000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/summarize", async (req, res) => {
  const { Text } = req.body;
  
  let options = {
    mode: "text",
    scriptPath: "./", 
    args: [Text], 
  };

  let response = await PythonShell.run("index.py", options, function (err, result) {
    if (err) throw err;
    else{
      console.log("result: ", result);

    }
  });

  
  res.send(response[0])
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
