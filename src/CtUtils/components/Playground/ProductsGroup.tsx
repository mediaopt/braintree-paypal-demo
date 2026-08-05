import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { GroupWrapper } from "./CartSettings/GroupWrapper.tsx";
import { PRODUCTS } from "../../../constants.ts";

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
