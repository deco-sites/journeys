import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";
import { splitArray } from "../../sdk/splitArray.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSlider({ products, itemListName }: Props) {
  const id = useId();
  const device = useDevice();

  const productsPerPage = splitArray(
    products,
    device === "desktop" ? 5 : device === "tablet" ? 3 : 2,
  );

  return (
    <>
      <div
        id={id}
        class="grid grid-rows-1"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-start-1 col-span-3 row-start-1 row-span-1">
          <Slider class="carousel carousel-center sm:carousel-end gap-5 sm:gap-10 w-full">
            {productsPerPage?.map((page: Product[], index: number) => (
              <Slider.Item
                index={index}
                class={clx("carousel-item justify-center w-full")}
              >
                {page.map((product) => (
                  <ProductCard
                    index={index}
                    product={product}
                    itemListName={itemListName}
                    class="w-full lg:max-w-72"
                  />
                ))}
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="col-start-1 col-span-1 row-start-1 row-span-1 z-10 self-center p-2 relative bottom-[15%]">
          <Slider.PrevButton class="flex btn btn-outline btn-sm btn-circle no-animation">
            <Icon id="chevron-right" class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="col-start-3 col-span-1 row-start-1 row-span-1 z-10 self-center p-2 relative bottom-[15%]">
          <Slider.NextButton class="flex btn btn-outline btn-sm btn-circle no-animation">
            <Icon id="chevron-right" />
          </Slider.NextButton>
        </div>

        <div class="flex flex-grow" />

        <div class="flex gap-2 justify-center items-center">
          {productsPerPage.map((_: Product[], index: number) => (
            <Slider.Dot
              class="group size-2.5 p-[3px] rounded-full border border-gray-400 disabled:bg-gray-400"
              index={index}
              key={index}
            />
          ))}
        </div>
      </div>
      <Slider.JS rootId={id} infinite={true} />
    </>
  );
}

export default ProductSlider;
