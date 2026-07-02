import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { GroupWrapper } from "./CartSettings/GroupWrapper.tsx";

export const PRODUCTS = [
  {
    id: "c663228f-b7e9-4000-813d-af8513fde4c4",
    description: "Standard",
  },
  { id: "2117bafa-7b7b-4200-bc0f-cf8b4fea88d4", description: "Get 1 free" },
  {
    id: "827bdeed-fbb2-4000-b688-50fb3aabda12",
    description: "-0.10 (this item)",
  },
  {
    id: "9b29008d-504b-4700-b620-31101064c89c",
    description: "-3% (cart)",
  },
];

interface ProductsGroupProps {
  isExpress?: boolean;
  applicationKey: string;
}

export const ProductsGroup = ({ isExpress, applicationKey }: ProductsGroupProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isExpress) {
    const activeId = PRODUCTS[activeIndex].id;
    return (
      <GroupWrapper title="Choose product to buy now">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-4">
          <div className="flex justify-center">
            <ProductCard productId={activeId} isExpress isSelected applicationKey={applicationKey} />
          </div>
          <div className="flex flex-col justify-between h-full">
            {PRODUCTS.filter((_, i) => i !== activeIndex).map(({ id }) => (
              <ProductCard
                key={id}
                productId={id}
                isExpress
                isSelected={false}
                onSelect={() =>
                  setActiveIndex(PRODUCTS.findIndex((p) => p.id === id))
                }
                applicationKey={applicationKey}
              />
            ))}
          </div>
        </div>
      </GroupWrapper>
    );
  }

  return (
    <GroupWrapper title="Choose cart product(s)">
      <div className="flex p-4 mx-auto justify-between flex-wrap">
        {PRODUCTS.map(({ id }) => (
          <ProductCard key={id} productId={id} applicationKey={applicationKey} />
        ))}
      </div>
    </GroupWrapper>
  );
};
