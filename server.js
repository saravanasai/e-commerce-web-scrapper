const express = require("express");
const app = express();
const db = require("./models");

app.get("/", async function (req, res) {
  let products = await db.Products.findAll();
  console.log("🚀 ~ file: server.js:9 ~ products:", products);
  res.send("Hello World");
});

app.get("/:productName", async function (req, res) {

  let product = await db.Products.findOne({ where: { product_name: req.params.productName } });
  console.log("🚀 ~ file: server.js:14 ~ product:", product)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.status(200).json({data:product})
  // res.send();
});

app.listen(3001);
