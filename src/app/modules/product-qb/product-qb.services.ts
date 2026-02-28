// src/app/modules/product/product.service.ts
import { QueryBuilder } from "../../buillder/queryBuilder";
import { Product } from "../product/product.model";

export const ProductService = {
  async getAllProductsWithQB(query: Record<string, unknown>) {
    console.log("\n🎯 Request Query:", query);
    
    // Base query + BASE CONDITIONS
    const productQuery = Product.find();
    const queryBuilder = new QueryBuilder(productQuery, query as Record<string, string>)
      .setBaseConditions({ isDeleted: false });  // 🔥 Base condition set করো

    const products = await queryBuilder
      .search(["name", "category"])
      .filter()
      .dateRange()
      .applyAllFilters()  // 🔥 Single find() call
      .sort()
      .paginate()
      .fields()
      .build();

    const meta = await queryBuilder.getMeta();

    console.log("\n✅ QueryBuilder Success!");
    return { data: products, meta };
  }
};
