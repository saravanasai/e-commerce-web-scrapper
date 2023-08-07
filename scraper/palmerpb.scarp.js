const puppeteer = require("puppeteer");
const db = require("../models");
module.exports = (async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://palmerpb.com/the-shop/");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  let productDatas = await page.$$(
    ".et_pb_row .pt-cv-content-item .pt-cv-ifield"
  );

  let productScarpped = [];

  for (const product of productDatas) {
    let builder = {};

    try {
      let tittle = await page.evaluate(
        (el) =>
          el.querySelector(
            ".pt-cv-ctf-list .pt-cv-ctf-shop_name .pt-cv-ctf-value"
          ).textContent,
        product
      );
     

      builder.tittle = tittle;
    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    try {
      let price = await page.evaluate(
        (el) =>
          el.querySelector(
            ".pt-cv-ctf-column .pt-cv-ctf-shop_price .pt-cv-ctf-value"
          ).textContent,
        product
      );

      price = price.substr(1);
      price = price.replace(",","");

      builder.price = price;

    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    try {
      let productImage = await page.evaluate(
        (el) => el.querySelector("img").getAttribute("src"),
        product
      );
     
      builder.image = productImage;
    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    if (Object.keys(builder).length > 2) {
      productScarpped.push(builder);
    }
  }

  for (const { tittle, price, image } of productScarpped) {
    await db.Products.upsert(tittle, {
      product_name: tittle,
      site_id: 2,
      price: `${price}`,
      image: image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await browser.close();
})();
