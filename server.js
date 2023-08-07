const express = require("express");
const { exec } = require("child_process");
const app = express();
const db = require("./models");

let scarpLogicFiles = [
  "instyle.scrap.js",
  "palmerpb.scarp.js",
  "wmagazine.scrap.js",
];

app.get("/scrap", async function (req, res) {
  for (let index = 0; index < scarpLogicFiles.length; index++) {
    exec(
      `node ./scraper/${scarpLogicFiles[index]}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  }

  res.send("Scarped Successfully");
});

app.get("/:productName", async function (req, res) {
  let product = await db.Products.findOne({
    where: { product_name: req.params.productName },
  });
  console.log("🚀 ~ file: server.js:14 ~ product:", product);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.status(200).json({ data: product });
});

app.listen(3001);
