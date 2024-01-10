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
});
