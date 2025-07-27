import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Category } from "@/payload-types"

import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters } from "./search-filters";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
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

  // const formattedData = data.docs.map((doc) => ({
  //   ...doc,
  //   subcategories: (doc.subcategories?.doc ?? []).map((doc) => ({
  //     // Because of depth 1 we are confident doc will be a type of "Category"
  //     ...(doc as Category),
  //     subcategories: undefined, // We don't need to show sub-subcategories in the filter
  //   })),
  // }));

  const formattedData: CustomCategory[] = (data.docs as any[]).map((doc) => ({
  ...doc,
  subcategories: (doc.subcategories?.docs ?? []).map((doc: any) => ({
    ...(doc as Category),
    subcategories: undefined,
  })),
}));


//TRY THIS FORMAT
//  const formattedData = data.docs.map((doc) => ({
//     ...doc,
//     subcategories: (doc.subcategories?.docs ?? []).map((subDoc: Category) => ({
//       ...subDoc,
//       subcategories: undefined,
//     })),
//   }));


  console.log({ data, formattedData });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>

      <Footer />
    </div>
  );
};
export default Layout;
