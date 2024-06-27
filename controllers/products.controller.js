const db = require("../db/db");

// Listar todos los productos
const getAllProducts = (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (error, rows) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "No se pudo completar la solicitud" });
    }
    res.json(rows);
  });
};

// Mostrar un producto
const showProduct = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE product_id = ?";

  db.query(sql, [id], (error, rows) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "No se pudo completar la solicitud del producto" });
    }
    if (rows.length == 0) {
      return res.status(404).json({ error: "No existe el producto" });
    }
    res.json(rows[0]);
  });
};

// Agregar un producto
const storeProduct = (req, res) => {
  const { name, description, price, category_id, image_url } = req.body;
  const sql =
    "INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?,?)";

  db.query(
    sql,
    [name, description, price, category_id, image_url],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          error:
            "No se pudo completar la solicitud, el producto no pudo ser almacenado",
        });
      }
      const product = { ...req.body, product_id: result.insertId };

      res.status(201).json(product);
    }
  );
};

// Modificar un registro (producto)

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id, image_url } = req.body;
  // console.log(id);

  const sql =
    "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE product_id = ?";

  db.query(
    sql,
    [name, description, price, category_id, image_url, id],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          error:
            "No se pudo completar la solicitud, el producto no pudo ser modificado",
        });
      }

      if (result.affectedRows == 0) {
        return res.status(404).json({ error: "No existe el producto" });
      }

      const product = { ...req.body, ...req.params };

      console.log(result);

      res.status(201).json(product);
    }
  );
};

// Borrar registro
const deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE product_id = ?";
  db.query(sql, [id], (error, result) => {
    console.log(id, result);
    if (error) {
      return res.status(500).json({
        error:
          "No se pudo completar la solicitud, el producto no pudo ser eliminado",
      });
    }

    if (result.affectedRows == 0) {
      return res.status(404).json({ error: "No existe el producto" });
    }

    res.json({ mensaje: "Producto eliminado" });
  });
};

module.exports = {
  getAllProducts,
  showProduct,
  storeProduct,
  updateProduct,
  deleteProduct,
};
