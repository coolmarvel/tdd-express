const productController = require("../../controllers/product.controller");

const Product = require("../../models/Product");

const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

const httpMocks = require("node-mocks-http");

Product.create = jest.fn();
Product.find = jest.fn();
Product.findById = jest.fn();
Product.findByIdAndUpdate = jest.fn();
Product.findByIdAndDelete = jest.fn();

const productId = "659e7e82cdaadd213cf7bdcc";
const updatedProduct = { name: "updated name", description: "updated description" };

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Controller (CREATE)", () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function");
  });

  it("should call Product.create", async () => {
    await productController.createProduct(req, res, next);

    expect(Product.create).toBeCalledWith(newProduct);
  });

  it("should return 201 response status code", async () => {
    await productController.createProduct(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    Product.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);

    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    Product.create.mockReturnValue(rejectedPromise);

    await productController.createProduct(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller (GET)", () => {
  it("should have a getProducts function", () => {
    expect(typeof productController.getProducts).toBe("function");
  });

  it("should call Product.find({})", async () => {
    await productController.getProducts(req, res, next);

    expect(Product.find).toHaveBeenCalledWith({});
  });

  it("should return 200 response", async () => {
    await productController.getProducts(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });

  it("should return json body in response", async () => {
    Product.find.mockReturnValue(allProducts);

    await productController.getProducts(req, res, next);

    expect(res._getJSONData()).toStrictEqual(allProducts);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);

    Product.find.mockReturnValue(rejectedPromise);

    await productController.getProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller (GET) [GetById]", () => {
  it("should have a getProductById", () => {
    expect(typeof productController.getProductById).toBe("function");
  });

  it("should call Product.findById", async () => {
    req.params.productId = productId;

    await productController.getProductById(req, res, next);

    expect(Product.findById).toBeCalledWith(productId);
  });

  it("should return json body and response code 200", async () => {
    Product.findById.mockReturnValue(newProduct);

    await productController.getProductById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return 404 when item deosn't exist", async () => {
    Product.findById.mockReturnValue(null);

    await productController.getProductById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);

    Product.findById.mockReturnValue(rejectedPromise);

    await productController.getProductById(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller (UPDATE)", () => {
  it("should have an updateProduct function", () => {
    expect(typeof productController.updateProduct).toBe("function");
  });

  it("should call Product.findByIdAndUpdate", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;

    await productController.updateProduct(req, res, next);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(productId, updatedProduct, { new: true });
  });

  it("should return json body and response code 200", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;

    Product.findByIdAndUpdate.mockReturnValue(updatedProduct);

    await productController.updateProduct(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(updatedProduct);
  });

  it("should handle 404 when item doesn't exist", async () => {
    Product.findByIdAndUpdate.mockReturnValue(null);

    await productController.updateProduct(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);

    Product.findByIdAndUpdate.mockReturnValue(rejectedPromise);

    await productController.updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller (DELETE)", () => {
  it("should have a deleteProduct function", () => {
    expect(typeof productController.deleteProduct).toBe("function");
  });

  it("should call Product.findByIdAndDelete", async () => {
    req.params.productId = productId;

    await productController.deleteProduct(req, res, next);

    expect(Product.findByIdAndDelete).toBeCalledWith(productId);
  });

  it("should return 200 response", async () => {
    const deletedProduct = { name: "deletedProduct", description: "it is deleted" };

    Product.findByIdAndDelete.mockReturnValue(deletedProduct);

    await productController.deleteProduct(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);

    Product.findByIdAndDelete.mockReturnValue(rejectedPromise);

    await productController.deleteProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
