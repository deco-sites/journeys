import { useDevice } from "@deco/deco/hooks";
import { Place, ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Gallery from "../../components/product/Gallery.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useMultipleOffers, useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Icon from "../ui/Icon.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ShippingSimulationForm from "../shipping/Form.tsx";
import { SellersByLocation } from "../../loaders/listSellersByLocation.ts";
import StoreAvailability from "./StoreAvailability.tsx";

interface Props {
  page: ProductDetailsPage | null;
  currencyCode: string;
  locale: string;
  sellers?: SellersByLocation["sellers"];
  selectedStore?: Place;
}

function ProductInfo({
  page,
  currencyCode,
  locale,
  selectedStore,
}: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const isDesktop = useDevice() === "desktop";
  const isMobile = useDevice() === "mobile";

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  // console.log({product})
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

  const {
    price = 0,
    listPrice = 0,
    seller = "1",
    availability,
  } = useOffer(offers);

  const offerss = useMultipleOffers(offers);

  const allSellers = offerss?.map(({ seller, sellerName }) => ({
    id: seller,
    name: sellerName,
  }));

  const itemsSimulation = offerss?.map(({ seller }) => ({
    id: Number(product.sku),
    quantity: 1,
    seller: seller ?? "",
  })) ?? [{ id: Number(product.sku), quantity: 1, seller: seller }];
  // const allSellers = [
  //   { id: seller, name: sellerName },
  //   ...(mockSellers || []),
  // ];

  console.log({ allSellers });

  const hasDiscount = listPrice > price;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  const descriptionSection = {
    DESCRIPTION: description,
    FEATURES:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "ABOUT THE BRAND":
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  };

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  return (
    <div
      {...viewItemEvent}
      class="flex flex-col lg:max-w-lg max-lg:p-7"
      id={id}
    >
      {
        /* <div id="product-info" class="hidden">
        {JSON.stringify(product)}
      </div> */
      }
      {/* Product Name */}
      <h1 class="text-2xl font-bold text-[#383838] mb-1">{title}</h1>

      {/* Prices */}
      <div class="flex items-center gap-1 mb-4">
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

        {/* Rating */}
        <div class="flex items-center ml-auto">
          <Icon id="star" class="text-black" size={22} />
          <Icon id="star" class="text-black" size={22} />
          <Icon id="star" class="text-black" size={22} />
          <Icon id="star" class="text-black" size={22} />
          <Icon id="star" class="text-black" size={22} />
          <span class="ml-1 text-sm text-[#202020]"></span>
        </div>
      </div>

      {/* Interest-free payments */}
      <div class="flex flex-col gap-6 mb-8">
        <div class="text-[#202020] text-sm flex items-center gap-1 flex-wrap">
          4 interest-free payments of $5.00 with
          <Icon id="afterpay" width={104} height={36} />
          <a href="#/" class="underline">
            Learn more
          </a>
        </div>
      </div>

      {/* Gallery */}
      {isMobile && <Gallery page={page} />}

      {/* Size chart */}
      <div class="flex items-center gap-1 mb-6">
        <img
          src="https://images.journeys.com/images/assets/1_27_size-chart.png"
          alt="Size chart"
        />
        <a href="#/" class="text-black text-sm hover:underline">
          Size Chart
        </a>
      </div>

      {/* Sku Selector */}
      {hasValidVariants && (
        <div class="relative mb-4">
          <Icon
            id="chevron-right"
            class="rotate-90 absolute right-4 top-1/2 -translate-y-1/2 text-[#A7A8AA] pointer-events-none"
          />

          <select
            title="selected-sku"
            id="selected-sku"
            class="appearance-none border border-[#A7A8AA] text-[#202020] h-10 py-2 px-5 w-full text-sm rounded outline-0"
            required
          >
            <option value="" selected disabled>
              Select size
            </option>
            {isVariantOf?.hasVariant?.map(
              ({ additionalProperty, productID }) => {
                const size = additionalProperty?.find(
                  ({ name }) => name === "Size",
                )?.value;

                if (!size) return null;

                return <option value={productID}>{size}</option>;
              },
            )}
          </select>
        </div>
      )}

      <div class="flex flex-col gap-2 border border-[#A7A8AA] rounded-sm mb-7">
        <ul>
          {allSellers?.map(({ id, name }, index) => (
            <li class="p-2">
              <label class="label cursor-pointer justify-start gap-2">
                <input
                  type="radio"
                  name="radio-10"
                  class="radio checked:bg-black"
                  checked={index === 0}
                  value={id ?? ""}
                />
                <span class="label-text uppercase">{name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Add to Cart and Favorites button */}
      <div class="flex flex-col gap-2 mb-8">
        {availability === "https://schema.org/InStock"
          ? (
            <AddToCartButton
              item={item}
              seller={seller}
              product={product}
              class="bg-black text-white font-bold h-14 text-lg uppercase"
              disabled={false}
            />
          )
          : <OutOfStock productID={productID} />}
      </div>

      {/* Description card */}
      {description &&
        (isDesktop
          ? (
            <div class="tabs tabs-lifted">
              {Object.entries(descriptionSection).map(
                ([name, description], index) => (
                  <>
                    <input
                      type="radio"
                      name="description_tabs"
                      class="tab after:whitespace-nowrap rounded-none checked:text-[#202020] text-[#666] hover:bg-[#ebebeb] uppercase"
                      aria-label={name}
                      style={{
                        "--tab-border-color": "#a8a8a8",
                        "--tab-radius": "0",
                      }}
                      checked={index === 0}
                    />
                    <div
                      role="tabpanel"
                      class="tab-content px-2.5 py-7"
                      dangerouslySetInnerHTML={{
                        __html: description as string,
                      }}
                    />
                  </>
                ),
              )}
            </div>
          )
          : (
            <div class="flex flex-col divide-y divide-[#a8a8a8]">
              {Object.entries(descriptionSection).map(([name, description]) => {
                const id = useId();

                return (
                  <div>
                    <input type="checkbox" id={id} class="hidden peer" />

                    <label
                      for={id}
                      class="text-[#202020] p-4 flex items-center justify-between uppercase group"
                    >
                      {name}
                      <Icon
                        id="plus"
                        class="text-black peer-checked:group-[]:hidden"
                        size={16}
                      />
                      <Icon
                        id="minus"
                        class="text-black hidden peer-checked:group-[]:block"
                        size={16}
                      />
                    </label>

                    <div class="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-all">
                      <div class="overflow-hidden">
                        <div
                          class="p-4"
                          dangerouslySetInnerHTML={{
                            __html: description as string,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

      <div class="w-full fles justify-center">
        <ShippingSimulationForm items={itemsSimulation} />
      </div>

      <StoreAvailability selectedStore={selectedStore} />
    </div>
  );
}

export default ProductInfo;
