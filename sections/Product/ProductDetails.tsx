import type { SectionProps } from "@deco/deco";
import { useDevice } from "@deco/deco/hooks";
import type { Place, ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import type { AppContext } from "../../apps/site.ts";
import { getCookies } from "std/http/cookie.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails(
  { page, currencyCode, locale, selectedStore }: SectionProps<
    typeof loader
  >,
) {
  const isMobile = useDevice() === "mobile";

  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div class="md:max-w-[992px] flex flex-col mb-6 mx-auto">
        <div class="max-lg:mx-5">
          <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
        </div>

        <div class="lg:bg-white flex flex-col lg:flex-row lg:py-7 lg:px-5 md:mx-5 lg:mx-0">
          {!isMobile && (
            <div class="bg-white w-full lg:w-3/5 md:mb-6 lg:mb-0 max-lg:py-7 max-lg:px-2.5">
              <ImageGallerySlider page={page} />
            </div>
          )}
          <div class="bg-white w-full lg:w-[30%] xl:w-auto mx-auto">
            <ProductInfo
              page={page}
              currencyCode={currencyCode}
              locale={locale}
              selectedStore={selectedStore}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  // const mockSellers = await ctx.invoke.site.loaders.listSellersByLocation({
  //   postalCode: "11530",
  //   countryCode: "USA",
  // });

  const cookies = getCookies(req.headers);
  const selectedStore: Place = JSON.parse(cookies?.["selected-store"] ?? "{}");
  // const { pickupPoints } = await simulationInvoke(
  //   selectedStoreZIP || postalCode,
  // )

  // const allStores = await ctx.invoke("site/loaders/listStockByStore.ts", {
  //   skuId: parseInt(props.page.product.sku),
  // });

  // console.log({ allStores });

  return {
    ...props,
    currencyCode: await ctx.invoke.site.loaders.getCurrency(),
    locale: await ctx.invoke.site.loaders.getLocale(),
    selectedStore,
  };
};

export const LoadingFallback = () => (
  <Section.Placeholder
    height="635px"
    class="md:max-w-[992px] flex flex-col mb-6 mx-auto"
  />
);
