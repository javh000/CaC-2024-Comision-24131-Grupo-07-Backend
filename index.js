const express = require("express");
const app = express();

app.use(express.json());

app.use("/productos", require("./routes/products.router"));
app.use("/users",require("./routes/users.router"))

app.get("/", (req, res) => {
  res.send("Bienvenido a la API");
});

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
