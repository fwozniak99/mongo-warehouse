const express = require('express');
const router = express.Router();

const Product = require('../models/Product');



router.get('/', async (req, res) => {
    try {
        const {filterName, sortBy, sorter} = req.query;
        if (!sorter) {
            let sorter = 1;
        } 
        if (!sortBy) {
            let sortBy = '_id'
        }
        if (filterName) {
            const products = await Product.find({name: {$regex: filterName, $options: 'i'}}).sort({[sortBy]: sorter}).select('_id name price quantity description')
            res.status(200).json({
                allProducts: products
            });
        } else {
            const products = await Product.find({}).sort({[sortBy]: sorter}).select('_id name price quantity description')
            res.status(200).json({
                allProducts: products
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
        error: err,
      });
    }
});

router.post("/", async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
        });

        const addedProduct = await Product.create(product);
            
        console.log(addedProduct);
        res.status(201).json({
            createdProduct: addedProduct,
        });
       

    } catch(err) {
        console.log(err);
        res.status(500).json({
        error: err,
      });
    }
  });

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndUpdate({ _id: id }, req.body)
        const updatedProduct = await Product.findOne({ _id: id })

        res.status(200).json({
            updatedProduct
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
        error: err,
        })
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await Product.deleteOne({ _id: id })

        res.status(200).json({
            deletedProduct
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
        error: err,
        })
    }
      
  });

router.get('/report', async (req, res) => {
    try {
        const report = await Product.aggregate([
            {
                $project: {
                    name: 1,
                    quantity: 1,
                    sum: { $multiply: [ "$quantity", "$price" ] }
                }
            }
        ])

        res.status(200).json({
            report
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
        error: err,
        });
    }
});
  


module.exports = router;