import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps, SectionProps } from "@deco/deco";
import { AppContext } from "../../apps/site.ts";

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
}

export default function ProductShelf(
  { products, title, currencyCode, locale }: SectionProps<typeof loader>,
) {
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
            ...(useOffer(product.offers)),
          })
        ),
      },
    },
  });

  return (
    <Section.Container {...viewItemListEvent}>
      <h1 class="text-lg/none py-3 font-primary uppercase font-bold text-center">
        {title}
      </h1>

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
    locale: await ctx.invoke.site.loaders.getLocale()
  };
};

export const LoadingFallback = (
  { title, cta }: LoadingFallbackProps<Props>,
) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="471px" />;
  </Section.Container>
);
