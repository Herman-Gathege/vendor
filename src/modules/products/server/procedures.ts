// import { Category } from "@/payload-types";
import z from "zod";

import type { Sort, Where } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category, Media } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure  
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      }),
    )  
  
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "name";
      }

      if (input.sort === "hot_and_new") {
        sort = "+createdAt";
      }

      if (input.sort === "trending") {
        sort = "-createdAt";
      }

      if ( input.minPrice && input.maxPrice ) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        }
      }else if ( input.minPrice ) {
        where.price = {
          greater_than_equal: input.minPrice,
        }
      }else if ( input.maxPrice ) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        }
      }
      
      

      if(input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category
            }
          }
        }); 

        const formattedData = (categoriesData.docs as any[]).map((doc) => ({
              ...doc,
              subcategories: (doc.subcategories?.docs ?? []).map((doc: any) => ({
                ...(doc as Category),
                // subcategories: undefined,
              })),
            }));


        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0]; 

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map((subcategories) => subcategories.slug)
          )
          
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          }

        }         
        
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // Populate  "Category", "image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
        })),
      };
    }),
});
