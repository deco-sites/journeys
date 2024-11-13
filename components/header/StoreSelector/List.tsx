import { Place } from "apps/commerce/types.ts";
import { StoresByState } from "../../../sdk/stores.ts";

interface StoreListProps {
  groupedStores?: StoresByState;
  stores?: Place[];
}

function StoreItem({ store }: { store: Place }) {
  return (
    <li key={store["@id"]}>
      <div class="store" data-id={store["@id"]} id={`store-${store["@id"]}`}>
        <div
          class="store-inner border border-[#a8a8a8] "
          itemScope
          itemType="http://schema.org/LocalBusiness"
        >
          <div class="store-heading bg-gray-200 text-[#707070] px-2 py-3">
            <h4 class="font-primary flex items-center gap-2">
              <span itemProp="name">
                {store?.name?.split("-")?.[0]?.trim()}
              </span>
            </h4>
          </div>
          <div class="flex flex-col gap-2 px-2 pt-2 pb-3">
            <div
              class="store-address font-primary text-sm"
              itemProp="address"
              itemScope
              itemType="http://schema.org/PostalAddress"
            >
              <div class="panel-row" itemProp="streetAddress">
                {store.address?.streetAddress}
              </div>
              <div class="panel-row">
                <span itemProp="addressLocality">
                  {store.address?.addressLocality}
                </span>
                ,{" "}
                <span itemProp="addressRegion">
                  {store.address?.addressRegion}
                </span>{" "}
                <span itemProp="postalCode">{store.address?.postalCode}</span>
              </div>
              <div class="panel-row" itemProp="addressCountry">
                {store.address?.addressCountry}
              </div>

              <div class="panel-row">
                <a
                  class="link-map text-[#666666] text-sm font-primary"
                  href={`https://maps.google.com/maps?q=${
                    encodeURIComponent(
                      `${store.address?.streetAddress} ${store.address?.addressLocality}, ${store.address?.addressRegion} ${store.address?.postalCode}`,
                    )
                  }`}
                  target="_blank"
                  title="map opens in a new window"
                >
                  <span></span>Map or Directions
                </a>
              </div>
            </div>
            <div class="item-actions">
              <button
                type="button"
                // href={`/store/${store?.name
                //   ?.toLowerCase()
                //   .replace(/\s+/g, "-")}`}
                style={{
                  transition: "all cubic-bezier(0.62, 0.28, 0.23, 0.99) 0.4s",
                }}
                class="border border-gray-300 uppercase text-neutral btn-sm hover:bg-[#e6e6e6] hover:border-[#b0b0b0]"
              >
                Make my store <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function StoreList({
  groupedStores = {},
  stores = [],
}: StoreListProps) {
  if (stores.length > 0) {
    return (
      <div class="flex flex-col gap-4 w-full px-4 mt-4">
        <h3 class="text-lg font-primary font-medium pb-3 border-b border-gray-200">
          Stores matching your search
        </h3>
        <ul class="mt-1 flex flex-col gap-4">
          {stores.map((store) => <StoreItem store={store} />)}
        </ul>
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-4 w-full px-4 mt-4">
      <h3 class="text-lg font-primary font-medium pb-3 border-b border-gray-200">
        Stores by state
      </h3>
      {Object.entries(groupedStores).map(([state, stores]) => (
        <div key={state}>
          <h3 class="text-lg font-primary font-medium">{state}</h3>
          <ul class="mt-1">
            {stores.map((store) => <StoreItem store={store} />)}
          </ul>
        </div>
      ))}
    </div>
  );
}
