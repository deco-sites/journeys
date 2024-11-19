// import { itemToAnalyticsItem } from "apps/vtex/hooks/useCart.ts";
import type a from "apps/vtex/loaders/cart.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { Minicart } from "../../../components/minicart/Minicart.tsx";
import { mapCategoriesToAnalyticsCategories } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { OrderForm, OrderFormItem } from "apps/vtex/utils/types.ts";

export type Cart = Awaited<ReturnType<typeof a>>;

const mapItemCategoriesToAnalyticsCategories = (
  item: OrderFormItem,
): Record<`item_category${number | ""}`, string> => {
  return mapCategoriesToAnalyticsCategories(
    Object.values(item.productCategories),
  );
};

export const itemToAnalyticsItem = (
  item: OrderForm["items"][number] & { coupon?: string },
  index: number,
) => ({
  affiliation: item.seller,
  item_id: item.id,
  item_group_id: item.productId,
  quantity: item.quantity,
  coupon: item.coupon ?? "",
  price: item.sellingPrice / 100,
  index,
  discount: Number(((item.listPrice - item.sellingPrice) / 100).toFixed(2)),
  item_name: item.name ?? item.skuName ?? "",
  item_variant: item.skuName,
  item_brand: item.additionalInfo.brandName ?? "",
  item_url: new URL(item.detailUrl, globalThis?.location?.href).href,
  ...(mapItemCategoriesToAnalyticsCategories(item)),
});

export const cartFrom = (form: Cart, url: string): Minicart => {
  const { items, totalizers } = form ?? { items: [] };
  const total = totalizers?.find((item) => item.id === "Items")?.value || 0;
  const discounts =
    (totalizers?.find((item) => item.id === "Discounts")?.value || 0) * -1;
  const locale = form?.clientPreferencesData.locale ?? "pt-BR";
  const currency = form?.storePreferencesData.currencyCode ?? "USD";
  const coupon = form?.marketingData?.coupon ?? undefined;

  return {
    platformCart: form as unknown as Record<string, unknown>,
    storefront: {
      items: items.map((item, index) => {
        const detailUrl = new URL(item.detailUrl, url).href;

        return {
          ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
          image: item.imageUrl,
          listPrice: item.listPrice / 100,
        };
      }),
      total: (total - discounts) / 100,
      subtotal: total / 100,
      discounts: discounts / 100,
      coupon: coupon,
      locale,
      currency,
      freeShippingTarget: 1000,
      checkoutHref: "/checkout",
    },
  };
};

async function loader(
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<Minicart> {
  const response = await ctx.invoke("vtex/loaders/cart.ts");

  return cartFrom(response, req.url);
}

export default loader;
