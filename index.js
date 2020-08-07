const puppeteer = require("puppeteer");

async function start() {
  async function loadList(page, selector) {
    const list = page.$$eval(selector, (product) =>
      product.map((link) => link.innerText)
    );

    return list;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://m.olx.com.br/busca?ca=18_s&q=macbook&w=5&zn=3337");

  const myList = await loadList(page, ".dcdGwU a");

  const products = await myList
    .map((item) => {
      const [name, price, time] = item.split("\n\n");

      return {
        name,
        price,
        time,
      };
    })
    .filter((item) => item.name != " By Clever Advertising");

  console.log("::::::::LISTA DE PRODUTOS:::::::::");
  console.log(products);

  console.log("::::::::Quantidade de produtos ::::::::::");
  console.log(products.length);

  var message = {
    app_id: "11a825bb-b473-4890-a4e4-b321e7eff405",
    contents: { en: `Quantidade de produtos ${products.length}` },
    included_segments: ["All"],
  };

  sendNotification(message);
}

var sendNotification = function (data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic OTNlZmRjZjktYTkxMS00MWExLTk4MTctODUwYTFmZjMyZjZj",
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");
  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on("error", function (e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

start();

setInterval(() => {
  start();
}, 1000 * 60 * 60);
