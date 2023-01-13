const express = require('express');
const router = express.Router();

const Product = require('../models/Product');



router.get('/', async (req, res) => {
  const {filterName, sortBy, sorter} = req.query;
  if (!sorter) {
    let sorter = 1;
  } 
  if (!sortBy) {
    let sortBy = '_id'
  }
  if (filterName) {
    Product.find({name: {$regex: filterName, $options: 'i'}}).sort({[sortBy]: sorter}).select('_id name price quantity description').then((products) => {
      res.send({
        allProducts: products
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  } else {
    Product.find({}).sort({[sortBy]: sorter}).select('_id name price quantity description').then((products) => {
      res.send({
        allProducts: products
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  }
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
    Product.deleteOne({ _id: id })
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
                name: 1,
                quantity: 1,
                sum: { $multiply: [ "$quantity", "$price" ] }
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