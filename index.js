const express = require("express");
const app = express();
const { checkToken } = require("./token-helpers");

let products = [
  { id: 1, name: "Surface Duo" },
  { id: 2, name: "Surface Studio" },
];

// json middleware
app.use(express.json());

//------------------REQUESTS---------------------------//

//get the user token
app.post("/token", (req, res) => {
  res.send({ token: `your token ${req.body.username}` });
});

// get the products
app.get("/products", checkToken, (req, res) => {
  res.send(products);
});

//add new product
app.post("/products", checkToken, (req, res) => {
  if (req.body.name) {
    const product = { id: products.length + 1, name: req.body.name };
    products.push(product);

    res.status(201).send({
      code: 201,
      status: "success",
      data: product,
    });
  } else {
    res
      .status(422)
      .send({ code: 422, status: "error", message: "name is required" });
  }
});

// delete product
app.delete("/products", checkToken, (req, res) => {
  if (req.body.id) {
    const product =
      products.find((p) => p.id === parseInt(req.body.id)) ?? null;

    let message = !product ? "product does not exist" : "";

    if (product) {
      products = products.filter((p) => p.id !== product.id);
      message = "Product " + product.name + " deleted";
    }
    res.send({ code: 200, status: "success", message });
  } else {
    res.send({
      code: 422,
      status: "error",
      message: "this product does not exist",
    });
  }
});

// purchase products
app.post("/purchase", checkToken, (req, res) => {
  const id = req.body.productId ?? 0;
  const product = products.find((product) => product.id === id) ?? null;
  if (product)
    res.send({
      status: "success",
      message: `product ${product.name} purchased successfully`,
      data: [product],
    });
  else
    res.send({
      status: "error",
      message: "The product does not exist anymore",
      data: [],
    });
});

app.listen(3030, () => {
  console.log("Listening on 3030");
});
