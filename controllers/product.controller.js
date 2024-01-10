const Product = require("../models/Product");

const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await Product.create(req.body);

    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find({});

    res.status(200).json(allProducts);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (product) res.status(200).json(product);
    else res.status(404).send();
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });

    if (updatedProduct) res.status(200).json(updatedProduct);
    else res.status(404).send();
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    let deletedProduct = await Product.findByIdAndDelete(req.params.productId);

    if (deletedProduct) res.status(200).json(deletedProduct);
    else res.status(404).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
