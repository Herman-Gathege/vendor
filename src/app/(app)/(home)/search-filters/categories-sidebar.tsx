import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";


import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
ScrollArea;


import { CustomCategory } from "../types";



interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[];
}

export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  const router = useRouter();

  // if we have parent categories, show those otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  }

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category)
    } else{
      //this is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {        
        //this is a subcategory(navigate to/category/subcategory)
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // thiss is a main category (navigate to/category)
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  }

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  }

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
        {parentCategories && (
          <Button onClick={handleBackClick}
          className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
          >
            <ChevronLeftIcon className="size-4 mr-2" />
            Back
          </Button>
        )}
          {currentCategories.map((categories) => (
            <button
            key={categories.slug}
            onClick={() => handleCategoryClick(categories)}
            className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium"
            >
              {categories.name}
              {categories.subcategories && categories.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4 " />
              )}

            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
