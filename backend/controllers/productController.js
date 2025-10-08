const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({});
    res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, stock } = req.body;

    if (!name || price === undefined || !description || !image || !category || stock === undefined) {
        res.status(400);
        throw new Error('Missing required fields: name, price, description, image, category, stock');
    }

    const product = new Product({
        name,
        price,
        description,
        image,
        brand: brand || '',
        category,
        stock,
        user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const searchProducts = asyncHandler(async (req, res) => {
    const { query } = req.query; 

    if (!query) {
        res.status(400);
        throw new Error('Search query is required');
    }

    const pipeline = [
        {
            $search: {
                index: 'productSearch', 
                text: {
                    query: query,
                    path: ['name', 'description', 'category'],
                    fuzzy: {} 
                }
            }
        },
        {
            $limit: 10 
        },
        {
            $project: {
               
                _id: 1,
                name: 1,
                price: 1,
                image: 1,
                category: 1,
                score: { $meta: "searchScore" } 
            }
        }
    ];

    const results = await Product.aggregate(pipeline);
    res.json(results);
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    searchProducts 
};