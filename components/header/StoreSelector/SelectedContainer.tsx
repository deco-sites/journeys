import { Place } from "apps/commerce/types.ts";
import { clx } from "../../../sdk/clx.ts";
import { useScript, useSection } from "@deco/deco/hooks";
import { getCookies } from "std/http/cookie.ts";
import { useComponent } from "../../../sections/Component.tsx";

export interface Props {
  selectedStore?: Place;
  variant?: "product";
}

function Item({ store }: { store: Place }) {
  return (
    <div key={store["@id"]}>
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
                hx-on:click={useScript(() => {
                  const url = new URL(globalThis.window.location.href);
                  if (url.searchParams.has("filter.pickupPoint")) {
                    url.searchParams.delete("filter.shipping");
                    url.searchParams.delete("filter.pickupPoint");
                    url.searchParams.delete("filter.zip-code");
                    url.searchParams.delete("filter.coordinates");
                    globalThis.window.history.replaceState({}, "", url.href);
                  }
                  document.cookie = "selected-store=; path=/; max-age=0";
                  document.body.dispatchEvent(
                    new CustomEvent("store-did-update"),
                  );
                })}
              >
                Remove my store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const action = (props: Props, req: Request) => {
  const cookies = getCookies(req.headers);
  const selectedStore: Place = JSON.parse(cookies?.["selected-store"] ?? "{}");

  return {
    ...props,
    selectedStore,
  };
};

const hookHtmxProps = () => ({
  "hx-trigger": "store-did-update from:body",
  "hx-target": "this",
  "hx-swap": "outerHTML transition:true",
  "hx-get": useComponent(import.meta.url, {
    href: `${useSection().split("?")[0]}?k=${Math.random()}`, // TODO: improve this hack, this disables caching
  }),
});

export default function SelectedContainer({ selectedStore, variant }: Props) {
  if (
    variant === "product" && Object.keys(selectedStore ?? {}).length &&
    selectedStore
  ) {
    return (
      <div key={selectedStore["@id"]}>
        <div
          class="store"
          data-id={selectedStore["@id"]}
          id={`store-${selectedStore["@id"]}`}
        >
          <div
            class="store-inner border border-[#a8a8a8] "
            itemScope
            itemType="http://schema.org/LocalBusiness"
          >
            <div class="store-heading bg-gray-200 text-[#707070] px-2 py-3">
              <h4 class="font-primary flex items-center gap-2">
                <span itemProp="name">
                  {selectedStore?.name?.split("-")?.[0]?.trim()}
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
                  {selectedStore?.address?.streetAddress}
                </div>
                <div class="panel-row">
                  <span itemProp="addressLocality">
                    {selectedStore.address?.addressLocality}
                  </span>
                  ,{" "}
                  <span itemProp="addressRegion">
                    {selectedStore.address?.addressRegion}
                  </span>{" "}
                  <span itemProp="postalCode">
                    {selectedStore.address?.postalCode}
                  </span>
                </div>
                <div class="panel-row" itemProp="addressCountry">
                  {selectedStore.address?.addressCountry}
                </div>

                <div class="panel-row">
                  <a
                    class="link-map text-[#666666] text-sm font-primary"
                    href={`https://maps.google.com/maps?q=${
                      encodeURIComponent(
                        `${selectedStore.address?.streetAddress} ${selectedStore.address?.addressLocality}, ${selectedStore.address?.addressRegion} ${selectedStore.address?.postalCode}`,
                      )
                    }`}
                    target="_blank"
                    title="map opens in a new window"
                  >
                    <span></span>Map or Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!Object.keys(selectedStore ?? {}).length) {
    return (
      <div id="store-selected-container" {...hookHtmxProps()} /> // hx-trigger="store-did-update from:body"
    ); // hx-get={useComponent(import.meta.url, {
    //   href: `${useSection().split("?")[0]}?k=${Math.random()}`, // hack to force a reload
    // })}
    // hx-target="this"
    // hx-swap="outerHTML transition:true"
  }

  return (
    <div
      id="store-selected-container"
      class={clx(
        "transition-all duration-300 w-full htmx-request:opacity-50 px-4 mt-4",
        "flex flex-col gap-1 pb-3 border-b border-gray-200",
      )}
      {...hookHtmxProps()}
    >
      <span class="text-lg font-primary font-medium">Your current store:</span>
      <Item store={selectedStore!} />
    </div>
  );
}
