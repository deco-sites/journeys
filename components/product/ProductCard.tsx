import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { formatPrice } from "../../sdk/format.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
  currencyCode: string;
  locale: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard(
  {
    product,
    preload,
    itemListName,
    index,
    class: _class,
    currencyCode,
    locale,
  }: Props,
) {
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, _back] = images ?? [];

  const { listPrice, price, availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  /* Add click event to dataLayer */
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  // const USDollar = new Intl.NumberFormat("en-US", {
  //   style: "currency",
  //   currency: "USD",
  // });

  return (
    <div {...event} class={clx("card card-compact group text-sm p-2", _class)}>
      <figure class="relative bg-base-200 p-1.5 pt-0 rounded-none">
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(!inStock && "opacity-70")}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class="object-cover"
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
          />
        </a>
      </figure>

      <a href={relativeUrl} class="p-1.5 pt-0">
        <span class="font-primary text-sm text-gray-100">{title}</span>

        <div class="flex gap-2">
          <span class="font-primary font-bold text-gray-100 text-sm">
            {formatPrice(price, currencyCode, locale)}
          </span>
        </div>
      </a>
    </div>
  );
}

export default ProductCard;
