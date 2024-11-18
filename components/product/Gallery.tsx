import { useDevice } from "@deco/deco/hooks";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import Slider from "../ui/Slider.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 600;
const HEIGHT = 600;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();
  const isMobile = useDevice() === "mobile";

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = props.page;
  const { offers, isVariantOf, name } = product;
  const { price = 0, listPrice = 0 } = useOffer(offers);
  const pImages = product.image;

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList,
    price,
    listPrice,
  });

  // Filter images when image's alt text matches product name
  // More info at: https://community.shopify.com/c/shopify-discussions/i-can-not-add-multiple-pictures-for-my-variants/m-p/2416533
  const groupImages = isVariantOf?.image ?? pImages ?? [];
  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );

  let images = filtered.length > 0 ? filtered : groupImages;
  images = Array(10).fill(images).flat();

  return (
    <>
      <div id={id} class="flex gap-5 relative">
        {/* Dots */}
        {!isMobile && (
          <ul
            class="carousel carousel-vertical gap-2 max-w-full overflow-x-auto sm:overflow-y-auto shrink-0"
            style={{ maxHeight: "532px" }}
          >
            {images.map((img, index) => (
              <li class="carousel-item size-[100px]">
                <Slider.Dot index={index}>
                  <Image
                    class="group-disabled:border-base-400 border rounded object-cover w-full h-full aspect-square"
                    width={100}
                    height={100}
                    src={img.url!}
                    alt={img.alternateName}
                  />
                </Slider.Dot>
              </li>
            ))}
          </ul>
        )}

        {/* Image Slider */}
        <div class="relative h-min flex-grow min-w-0">
          <Slider class="carousel carousel-center gap-6 w-full">
            {images.map((img, index) => (
              <Slider.Item index={index} class="carousel-item w-full">
                <Image
                  class="w-full"
                  sizes="(max-width: 640px) 100vw, 40vw"
                  style={{ aspectRatio: ASPECT_RATIO }}
                  src={img.url!}
                  alt={img.alternateName}
                  width={WIDTH}
                  height={HEIGHT}
                  // Preload LCP image for better web vitals
                  preload={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Slider.Item>
            ))}
          </Slider>

          {
            /* <Slider.PrevButton
                        class='no-animation absolute left-2 top-1/2 btn btn-circle btn-outline disabled:invisible'
                        disabled
                    >
                        <Icon id='chevron-right' class='rotate-180' />
                    </Slider.PrevButton>

                    <Slider.NextButton
                        class='no-animation absolute right-2 top-1/2 btn btn-circle btn-outline disabled:invisible'
                        disabled={images.length < 2}
                    >
                        <Icon id='chevron-right' />
                    </Slider.NextButton> */
          }

          <div class="absolute right-4 top-4">
            <WishlistButton item={item} />
          </div>
        </div>

        <Slider.JS rootId={id} />
      </div>
    </>
  );
}
