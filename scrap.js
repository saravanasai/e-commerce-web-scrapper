const puppeteer = require("puppeteer");
const db = require("./models");
(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.instyle.com/beauty/skin/best-sunscreens");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  let productDatas = await page.$$(".list-sc__commerce-wrapper .mntl-block");

  let productScarpped = [];

  for (const product of productDatas) {
    let builder = {};

    try {
      let tittle = await page.evaluate(
        (el) =>
          el.querySelector(".mntl-block div .loc.heading > div > h3 > span")
            .textContent,
        product
      );

      builder.tittle = tittle;
     
    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    try {
      let price = await page.evaluate(
        (el) => el.querySelector(".mntl-sc-block-html > strong").textContent,
        product
      );
      builder.price = price.substr(26);
    } catch (error) {
      // console.log("🚀 ~ file: index.mjs:26 ~ error:", error)
    }

    try {
      let productImage = await page.evaluate(
        (el) =>
          el
            .querySelector(
              ".mntl-block div .loc.figure .mntl-block > div > img"
            )
            .getAttribute("data-src"),
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
      price: `${price}`,
      image: image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await browser.close();
})();
