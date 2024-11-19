import { type LoadingFallbackProps, SectionProps } from "@deco/deco";
import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { AppContext } from "../../apps/site.ts";

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  /**
   * @default default
   */
  titleStyle?: "default" | "light";
  variant?: "default" | "productPage";
}

export default function ProductShelf({
  products,
  titleStyle = "default",
  title,
  currencyCode,
  locale,
  variant = "default",
}: SectionProps<typeof loader>) {
  if (!products || products.length === 0) {
    return null;
  }

  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ),
      },
    },
  });

  return (
    <Section.Container
      {...viewItemListEvent}
      class={`!py-2.5 !pt-5 md:mx-5 lg:mx-auto mb-6 ${
        variant === "productPage" ? "max-w-[992px]" : ""
      }`}
    >
      {titleStyle === "default"
        ? (
          <h1 class="text-lg/none font-primary uppercase font-bold text-center">
            {title}
          </h1>
        )
        : (
          <h1 class="border-b border-[#cfcfcf] text-[#202020] text-lg py-1.5 text-center w-[80%] mx-auto">
            {title}
          </h1>
        )}

      <ProductSlider
        products={products}
        itemListName={title}
        currencyCode={currencyCode}
        locale={locale}
      />
    </Section.Container>
  );
}

export const loader = async (props: Props, _req: Request, ctx: AppContext) => {
  return {
    ...props,
    currencyCode: await ctx.invoke.site.loaders.getCurrency(),
    locale: await ctx.invoke.site.loaders.getLocale(),
  };
};

export const LoadingFallback = ({
  title,
  titleStyle,
  variant,
}: LoadingFallbackProps<Props>) => (
  <Section.Container
    class={`!py-2.5 !pt-5 md:mx-5 lg:mx-auto mb-6 ${
      variant === "productPage" ? "max-w-[992px]" : ""
    }`}
  >
    {titleStyle === "default"
      ? (
        <h1 class="text-lg/none font-primary uppercase font-bold text-center">
          {title}
        </h1>
      )
      : (
        <h1 class="border-b border-[#cfcfcf] text-[#202020] text-lg py-1.5 text-center w-[80%] mx-auto">
          {title}
        </h1>
      )}
    <Section.Placeholder height="471px" />
  </Section.Container>
);
