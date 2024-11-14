import { Place } from "apps/commerce/types.ts";
import { AppContext } from "../../../apps/deco/vtex.ts";
import { Lang } from "../../../loaders/languages.ts";
import { clx } from "../../../sdk/clx.ts";
import {
  getCountryFromLanguage,
  groupStoresByState,
} from "../../../sdk/stores.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Drawer from "../../ui/Drawer.tsx";
import Icon from "../../ui/Icon.tsx";
import StoreList from "./List.tsx";
import {
  STORE_SELECTOR_CONTAINER_ID,
  STORE_SELECTOR_DRAWER_ID,
} from "../../../constants.ts";
import { getCookies } from "std/http/cookie.ts";

export interface StoreSelectorProps {
  /**
   * @ignore
   */
  currentLang?: Lang;
  /**
   * @ignore
   */
  variant?: "stores" | "get-stores";
  /**
   * @ignore
   */
  stores?: Place[];
  /**
   * @ignore
   */
  error?: string;
}

export const action = async (
  props: StoreSelectorProps,
  req: Request,
  ctx: AppContext,
) => {
  if (props.variant === "stores") {
    const stores = await ctx.invoke.vtex.loaders.logistics.listPickupPoints();

    return {
      ...props,
      stores,
    };
  }

  if (props.variant === "get-stores") {
    const form = await req.formData();
    const postalCode = form.get("PostalCode")?.toString()?.replace(/\s+/g, "");
    const cookies = getCookies(req.headers);
    const vtexSegment = cookies?.["vtex_segment"]
      ? JSON.parse(atob(cookies["vtex_segment"]))
      : {};

    if (!postalCode) {
      return {
        ...props,
        stores: [],
        error:
          "No stores in your area. Please modify your location and search again.",
      };
    }

    const countryCode = vtexSegment.countryCode ??
      getCountryFromLanguage(props?.currentLang?.value ?? "en");

    console.log({ postalCode, countryCode });

    const stores = await ctx.invoke.vtex.loaders.logistics
      .listPickupPointsByLocation({
        postalCode,
        countryCode,
      });
    return {
      ...props,
      stores,
    };
  }

  return { ...props };
};

export default function StoreSelector({
  currentLang,
  ...props
}: StoreSelectorProps) {
  if (props?.variant === "get-stores") {
    return <StoreList stores={props.stores} error={props.error} />;
  }

  if (props?.variant === "stores") {
    const groupedStores = groupStoresByState({
      places: props?.stores ?? [],
      language: currentLang?.value,
    });
    return (
      <>
        <Drawer
          id={STORE_SELECTOR_DRAWER_ID}
          class="drawer-end z-50"
          open
          aside={
            <Drawer.Aside
              title="Journeys Stores"
              drawer={STORE_SELECTOR_DRAWER_ID}
            >
              <div
                class="h-full flex flex-col bg-base-100 items-center justify-start overflow-auto"
                style={{
                  minWidth: "calc(min(100vw, 425px))",
                  maxWidth: "425px",
                }}
              >
                <div class="flex flex-col gap-4 w-full px-4 mt-2">
                  <h3 class="text-lg font-primary font-medium">Find a store</h3>
                  <form
                    class="flex gap-2 items-end"
                    hx-encoding="application/x-www-form-urlencoded"
                    hx-post={useComponent(import.meta.url, {
                      variant: "get-stores",
                    })}
                    hx-target="#stores-data"
                    hx-trigger="submit"
                    hx-swap="innerHTML transition:true"
                    hx-indicator=".btn-submit"
                    hx-ext="json-enc"
                  >
                    <div class="flex flex-col gap-1 flex-1">
                      <label
                        htmlFor="PostalCode"
                        class="font-primary text-sm font-bold"
                      >
                        Zip/Postal Code
                      </label>
                      <input
                        required
                        name="PostalCode"
                        type="tel"
                        id="PostalCode"
                        aria-label="Zip/Postal Code"
                        placeholder="Enter zip/postal code"
                        autocomplete="postal-code"
                        // pattern="(?=.*[A-Za-z]).{6,}|[0-9]{5}"
                        pattern="^(\d{5}(-\d{4})?)|([A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$"
                        class="input input-bordered input-sm w-full rounded-none outline-none focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      class={clx(
                        "min-w-0 flex-shrink-0 basis-[70px]",
                        "text-white bg-gray-100 border-gray-100",
                        "select-none",
                        "font-primary font-normal uppercase btn-sm",
                        "btn-submit flex items-center justify-center",
                      )}
                    >
                      <span class="[.htmx-request>&]:hidden">Search</span>
                      <span class="[.htmx-request>&]:loading [.htmx-request>&]:w-6 [.htmx-request>&]:block hidden" />
                    </button>
                  </form>
                </div>
                <div
                  id="stores-data"
                  class={clx(
                    "transition-all duration-300 w-full",
                    "htmx-request:opacity-50",
                  )}
                >
                  <StoreList groupedStores={groupedStores} />
                </div>
              </div>
            </Drawer.Aside>
          }
        />
        <div id="stores-data" class="hidden">
          {JSON.stringify(groupedStores)}
        </div>
      </>
    );
  }

  return (
    <label
      class="flex items-center gap-1 group cursor-pointer"
      hx-target={`#${STORE_SELECTOR_CONTAINER_ID}`}
      hx-swap="outerHTML"
      hx-trigger="click once"
      hx-get={useComponent(import.meta.url, {
        currentLang,
        variant: "stores",
      })}
      htmlFor={STORE_SELECTOR_DRAWER_ID}
    >
      <Icon id="Location" width={12} height={12} class="text-white" />
      <span
        class="text-white group-hover:underline transition-all duration-300 font-primary"
        style={{
          fontSize: "10.71px",
        }}
      >
        Find Your Store
      </span>
    </label>
  );
}
