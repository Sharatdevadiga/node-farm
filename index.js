// FILE SYSTEM MODULE
// const fs = require("fs");

/*
// READING DATA
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

// CREATING NEW FILE AND WRITING DATA TO IT
const textOut = `Avacado info: ${textIn}`;
fs.writeFileSync("./txt/output.txt", textOut);
*/

// ASYNCHRONOUS FILE READING AND WRITING
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written");
//       });
//     });
//   });
// });
// console.log("will read file");
// //////////////////////////////////////////////////////////
// SERVER
const http = require("http");
const url = require("url");
const fs = require("fs");

const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate.js");

// HELPER FUNCTION

// INITIAL READING OF DATA
const tempOverView = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// dataObj.forEach((element, i) => {
//   element.id = slugs[i];
// });

// CREATING SERVER AND ROUTER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverView.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API page
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // page not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<p>Page not found</p>");
  }
});

// LISTENING TO THE SERVER REQUEST
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to the port 8000");
});
