import { Place } from "apps/commerce/types.ts";
import { StoresByState } from "../../../sdk/stores.ts";
import Icon from "../../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
import { clx } from "../../../sdk/clx.ts";

interface StoreListProps {
  groupedStores?: StoresByState;
  stores?: Place[];
  error?: string;
  /**
   * @ignore
   */
  parentComponentUrl?: string;
  /**
   * @ignore
   */
  selectedStore?: Place;
}

export function StoreItem({ store }: { store: Place }) {
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
                style={{
                  transition: "all cubic-bezier(0.62, 0.28, 0.23, 0.99) 0.4s",
                }}
                class="border border-gray-300 uppercase text-neutral btn-sm hover:bg-[#e6e6e6] hover:border-[#b0b0b0]"
                hx-on:click={useScript((store: Place) => {
                  const url = new URL(globalThis.window.location.href);
                  if (url.searchParams.has("filter.pickupPoint")) {
                    url.searchParams.set("filter.shipping", "pickup-in-point");
                    url.searchParams.set(
                      "filter.pickupPoint",
                      `demoaccount20_${store["@id"]}`,
                    );
                    url.searchParams.set(
                      "filter.zip-code",
                      `${store?.address?.postalCode}`,
                    );
                    url.searchParams.set(
                      "filter.coordinates",
                      `${store?.longitude},${store?.latitude}`,
                    );
                    globalThis.window.history.replaceState({}, "", url.href);
                  }
                  console.log("store", store);
                  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
                  document.cookie = `selected-store=${
                    JSON.stringify(
                      store,
                    )
                  }; path=/; max-age=${ONE_YEAR_MS}`;
                  document.body.dispatchEvent(
                    new CustomEvent("store-did-update"),
                  );
                  document
                    .querySelector("#PostalCodeContainer")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, store)}
              >
                Make my store
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ClearSearchStores({
  parentComponentUrl,
  autoClear = false,
}: {
  parentComponentUrl?: string;
  autoClear?: boolean;
}) {
  if (!parentComponentUrl) {
    return null;
  }

  if (autoClear) {
    return (
      <div
        hx-trigger="load delay:2s"
        hx-get={parentComponentUrl}
        hx-target="#stores-data"
        hx-swap="innerHTML transition:true"
      />
    );
  }

  return (
    <button
      type="button"
      class={clx(
        "flex items-center justify-center gap-2 font-primary text-sm",
        "uppercase text-neutral btn-sm hover:bg-[#e6e6e6] hover:border-[#b0b0b0]",
        "border border-gray-300",
      )}
      hx-get={parentComponentUrl}
      hx-target="#stores-data"
      hx-trigger="click once"
      hx-swap="innerHTML transition:true"
      hx-indicator="this"
      hx-on-htmx-after-request={useScript(() => {
        const $postalCode = document.querySelector<HTMLInputElement>(
          "#PostalCode",
        );
        if ($postalCode) {
          $postalCode.value = "";
        }
      })}
    >
      Clear
      <Icon
        id="close"
        width={16}
        height={16}
        class="[.htmx-request>&]:hidden"
      />
      <span class="[.htmx-request>&]:loading [.htmx-request>&]:w-4 [.htmx-request>&]:block hidden" />
    </button>
  );
}

export default function StoreList({
  groupedStores = {},
  stores = [],
  error,
  parentComponentUrl,
}: //selectedStore, //TODO melhore o compenente indicando alguma mudanca a partir de existir uma loja selecionada
  StoreListProps) {
  if (Object.keys(groupedStores).length > 0) {
    return (
      <div class="flex flex-col gap-4 w-full px-4 mt-4">
        <h3 class="text-lg font-primary font-medium pb-3 border-b border-gray-200">
          Stores by state
        </h3>
        {Object.entries(groupedStores).map(([state, stores]) => (
          <div key={state}>
            <h3 class="text-lg font-primary font-medium sticky top-0 bg-white z-10">
              {state}
            </h3>
            <ul class="mt-1 flex flex-col gap-4">
              {stores.map((store) => <StoreItem store={store} />)}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (error || stores.length === 0) {
    return (
      <div class="flex flex-col gap-4 w-full px-4 mt-4">
        <div class="text-[#c30b21] mt-1 flex gap-1 items-center">
          <Icon id="Info" width={40} height={40} />
          {error ??
            "No stores in your area. Please modify your location and search again."}
        </div>
        <ClearSearchStores
          parentComponentUrl={parentComponentUrl ?? ""}
          autoClear
        />
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-4 w-full px-4 mt-4">
      <div class="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 class="text-lg font-primary font-medium">
          Stores matching your search
        </h3>
        <ClearSearchStores parentComponentUrl={parentComponentUrl ?? ""} />
      </div>
      <ul class="mt-1 flex flex-col gap-4">
        {stores.map((store) => <StoreItem store={store} />)}
      </ul>
    </div>
  );
}
