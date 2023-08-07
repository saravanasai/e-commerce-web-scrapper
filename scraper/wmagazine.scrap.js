const puppeteer = require("puppeteer");
const db = require("../models");
module.exports = (async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(
    "https://www.wmagazine.com/beauty/best-fragrances-of-all-time"
  );

  // Set screen size
  //   await page.setViewport({ width: 1080, height: 1024 });
  await page.setViewport({
    width: 1200,
    height: 8000,
  });

  let productDatas = await page.$$(".sWr");
  await page.evaluate(() => {
    window.scrollTo(0, window.document.body.scrollHeight);
  });
  let productScarpped = [];

  for (const product of productDatas) {
    let builder = {};

    try {
      let tittle = await page.evaluate(
        (el) => el.querySelector(".hzY .Mup .yiq").textContent,
        product
      );
      console.log("🚀 ~ file: wmagazine.scrap.js:32 ~ tittle:", tittle);

      builder.tittle = tittle;
    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    try {
      let price = await page.evaluate(
        (el) => el.querySelector(".hzY .Mup .o75 span").textContent,
        product
      );

      price = price.substr(1);
      price = price.replace(",", "");
      console.log("🚀 ~ file: wmagazine.scrap.js:48 ~ price:", price);

      builder.price = price;
    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    try {
      await page.waitForSelector(
        ".hzY > a > div.ooy.Kgr > div > picture > img"
      );
      let productImage = await page.evaluate(
        (el) =>
          el
            .querySelector(".hzY > a > div.ooy.Kgr > div > picture > img")
            .getAttribute("src"),
        product
      );
      console.log(
        "🚀 ~ file: wmagazine.scrap.js:64 ~ productImage:",
        productImage
      );

      builder.image = productImage;
    } catch (error) {
      console.log("🚀 ~ file: wmagazine.scrap.js:70 ~ error:", error);
    }

    if (Object.keys(builder).length > 2) {
      productScarpped.push(builder);
    }
  }

  for (const { tittle, price, image } of productScarpped) {
    await db.Products.upsert(tittle, {
      product_name: tittle,
      site_id: 3,
      price: `${price}`,
      image: image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await browser.close();
})();
