import { StatusCodes }          from "http-status-codes";
import ApiError                 from "../../../errors/ApiErrors";
import unlinkFile from "../../../shared/unLinkFIle";
import { getMultipleFilesPath } from "../../../shared/getFilePath";
import { Product }              from "./product.model";
import type {
  CreateProductPayload,
  UpdateProductPayload,
  UpdateProductStatusPayload,
} from "./product.validation";

// =====================================================
// CREATE
// =====================================================
const createProduct = async (
  payload:   CreateProductPayload,
  files:     any,
  createdBy: string
) => {
  const isExist = await Product.isExistByName(payload.name);
  if (isExist) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Product already exists with this name"
    );
  }

  const imagePaths = getMultipleFilesPath(files, "productImage");
  if (!imagePaths || imagePaths.length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "At least one product image is required"
    );
  }

  const product = await Product.create({
    ...payload,
    images:    imagePaths,
    thumbnail: imagePaths[0],
    createdBy,
  });

  return product;
};

// =====================================================
// GET ALL
// =====================================================
const getAllProducts = async (query: Record<string, unknown>) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.category) {
    filter.category = (query.category as string).toLowerCase();
  }

  if (query.status) {
    filter.status = query.status;
  } else {
    filter.status = "active";
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) (filter.price as any).$gte = Number(query.minPrice);
    if (query.maxPrice) (filter.price as any).$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$or = [
      { name:     { $regex: query.search, $options: "i" } },
      { category: { $regex: query.search, $options: "i" } },
      { tags:     { $in: [new RegExp(query.search as string, "i")] } },
    ];
  }

  const sortField = (query.sortBy  as string) || "createdAt";
  const sortDir   = (query.sortOrder as string) === "asc" ? 1 : -1;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// =====================================================
// GET SINGLE
// =====================================================
const getProductById = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate("createdBy", "name email")
    .lean();

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  return product;
};

// =====================================================
// UPDATE
// =====================================================
const updateProduct = async (
  id:      string,
  payload: UpdateProductPayload,
  files:   any
) => {
  const product = await Product.isExistById(id);
  if (!product || product.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  let currentImages = [...product.images];

  // ① পুরনো specific images disk + array থেকে remove
  if (payload.removeImages && payload.removeImages.length > 0) {
    for (const imgPath of payload.removeImages) {
      unlinkFile(imgPath);
      currentImages = currentImages.filter((img: string) => img !== imgPath);
    }
  }

  // ② নতুন images যোগ
  const newImagePaths = getMultipleFilesPath(files, "productImage");
  if (newImagePaths && newImagePaths.length > 0) {
    currentImages = [...currentImages, ...newImagePaths];
  }

  // ③ কমপক্ষে ১টা image থাকতে হবে
  if (currentImages.length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Product must have at least one image"
    );
  }

  const { removeImages, ...updateData } = payload;

  const updated = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        ...updateData,
        images:    currentImages,
        thumbnail: currentImages[0],
      },
    },
    { new: true, runValidators: true }
  ).lean();

  return updated;
};

// =====================================================
// UPDATE STATUS
// =====================================================
const updateProductStatus = async (
  id:      string,
  payload: UpdateProductStatusPayload
) => {
  const product = await Product.isExistById(id);
  if (!product || product.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  await Product.findByIdAndUpdate(id, {
    $set: { status: payload.status },
  });

  return { message: `Product status updated to ${payload.status}` };
};

// =====================================================
// DELETE
// =====================================================
const deleteProduct = async (id: string) => {
  const product = await Product.isExistById(id);
  if (!product || product.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  // disk থেকে সব image delete
  for (const imgPath of product.images) {
    unlinkFile(imgPath);
  }

  await Product.findByIdAndUpdate(id, {
    $set: { isDeleted: true, images: [], thumbnail: "" },
  });

  return { message: "Product deleted successfully" };
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
