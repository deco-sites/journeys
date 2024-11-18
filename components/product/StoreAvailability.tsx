import { Place } from "apps/commerce/types.ts";
import SelectedContainer from "../header/StoreSelector/SelectedContainer.tsx";
import { useComponent } from "../../sections/Component.tsx";
import { useSection } from "@deco/deco/hooks";
import { getCookies } from "std/http/cookie.ts";
import { STORE_SELECTOR_DRAWER_ID } from "../../constants.ts";
import { STORE_SELECTOR_CONTAINER_ID } from "../../constants.ts";
// import StoreSelector from "../header/StoreSelector/StoreSelector.tsx";

export interface StoreAvailabilityProps {
  selectedStore?: Place;
}

const StoreSelector = import.meta.resolve(
  "../header/StoreSelector/StoreSelector.tsx",
);

export const action = (props: StoreAvailabilityProps, req: Request) => {
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

export default function StoreAvailability({
  selectedStore,
}: StoreAvailabilityProps) {
  if (!Object.keys(selectedStore ?? {}).length) {
    return (
      <div id="store-availability" {...hookHtmxProps()} class="mt-8">
        <label
          class="flex items-center gap-2 font-primary font-bold text-black border border-black min-h-14 max-w-fit px-5 cursor-pointer"
          hx-target={`#${STORE_SELECTOR_CONTAINER_ID}`}
          hx-swap="outerHTML"
          hx-trigger="click once"
          hx-get={useComponent(StoreSelector, {
            variant: "stores",
          })}
          htmlFor={STORE_SELECTOR_DRAWER_ID}
        >
          Check Store Availability
        </label>
        {" "}
      </div>
    );
  }

  return (
    <div
      class="w-full fles justify-center mt-8"
      id="store-availability"
      {...hookHtmxProps()}
    >
      <SelectedContainer selectedStore={selectedStore} variant="product" />
    </div>
  );
}
