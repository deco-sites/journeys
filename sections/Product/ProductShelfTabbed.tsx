import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps, SectionProps } from "@deco/deco";
import { getCookies } from "std/http/cookie.ts";
/** @titleBy title */
interface Tab {
  title: string;
  products: Product[] | null;
}
export interface Props extends SectionHeaderProps {
  tabs: Tab[];
  /** @hide true */
  tabIndex?: number;
}

export const loader = (props: Props, req: Request) => {
  const cookies = getCookies(req.headers);
  const vtexSegment = cookies?.["vtex_segment"]
    ? JSON.parse(atob(cookies["vtex_segment"]))
    : {};

  return {
    ...props,
    currencyCode: vtexSegment.currencyCode,
    locale: vtexSegment.cultureInfo,
  };
};

export default function TabbedProductShelf({
  tabs,
  title,
  cta,
  tabIndex,
  currencyCode,
  locale,
}: SectionProps<typeof loader>) {
  const ti = typeof tabIndex === "number"
    ? Math.min(Math.max(tabIndex, 0), tabs.length)
    : 0;
  const { products } = tabs[ti];
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products?.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ) ?? [],
      },
    },
  });
  return (
    <Section.Container {...viewItemListEvent}>
      <Section.Header title={title} cta={cta} />

      <Section.Tabbed>
        {!products?.length
          ? (
            <div class="flex justify-center items-center">
              No Products found
            </div>
          )
          : (
            <ProductSlider
              products={products}
              itemListName={title}
              currencyCode={currencyCode}
              locale={locale}
            />
          )}
      </Section.Tabbed>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />

    <Section.Tabbed>
      <>
        <Section.Placeholder height="471px" />;
      </>
    </Section.Tabbed>
  </Section.Container>
);
