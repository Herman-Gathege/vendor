
import { Category } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx}) => {
    

    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, // Populate subcategories  subcategories.[0] will be a type of "Category"
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = (data.docs as any[]).map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc: any) => ({
        ...(doc as Category),
        subcategories: undefined,
      })),
    }));
    return formattedData;
  }),
});
