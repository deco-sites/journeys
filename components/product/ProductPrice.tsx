import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { Offer } from "../../sdk/useOffer.ts";

export default function ProductPrice({
  offer,
  currencyCode,
  locale,
}: {
  offer?: Offer;
  currencyCode: string;
  locale: string;
}) {
  const { price = 0, listPrice = 0, seller = "1" } = offer ?? {};
  const hasDiscount = listPrice > price;
  return (
    <div id="product-price" data-seller={seller}>
      {hasDiscount && (
        <span class="line-through text-xl text-[#707070]">
          {formatPrice(listPrice, currencyCode, locale)}
        </span>
      )}
      <span
        class={clx(
          "text-xl",
          hasDiscount ? "text-[#d41d18]" : "text-[#202020]",
        )}
      >
        {formatPrice(price, currencyCode, locale)}
      </span>
    </div>
  );
}
