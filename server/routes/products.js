const express = require('express');
const router = express.Router();

const Product = require('../models/Product');



router.get('/', async (req, res) => {
  const id = req.params.idUser;
  Product.find({}).then((products) => {
    res.send({
      allProducts: products
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  });
});

router.post("/", async (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
    });
    product
        .save()
        .then((result) => {
        console.log(result);
        res.status(201).json({
          createdProduct: result,
        });
      })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    Product.findByIdAndUpdate({ _id: id }, req.body).then(() => {
        Product.findOne({ _id: id }).then((user) => {
            res.send(user);
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
    });;
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    Product.remove({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });

router.get('/report', async (req, res) => {
    Product.aggregate([
        {
            $project: {
                _id: 0,
                name: 1,
                quantity: 1,
                description: 0,
                sum: { $multiply: [ $quantity, $price ] }
            }
        }
    ]).then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
});
  


module.exports = router;