import { clx } from "../../sdk/clx.ts";
import Image from "apps/website/components/Image.tsx";
import { Alerts, PreheaderProps } from "../../sections/Header/Header.tsx";
import { useComponent } from "../../sections/Component.tsx";
import { setCookie } from "std/http/cookie.ts";
import { useDevice } from "@deco/deco/hooks";
import Icon from "../ui/Icon.tsx";
import StoreList from "./StoreSelector/List.tsx";
import Drawer from "../ui/Drawer.tsx";
import { AppContext } from "../../apps/deco/vtex.ts";
import { groupStoresByState } from "../../sdk/stores.ts";

export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const action = async (
  props: PreheaderProps,
  _req: Request,
  ctx: AppContext,
) => {
  if (props.variant === "stores") {
    const stores = await ctx.invoke.vtex.loaders.logistics.listPickupPoints();

    return {
      ...props,
      stores,
    };
  }

  if (props.currentLang) {
    setCookie(ctx.response.headers, {
      name: "language",
      value: props.currentLang.value,
      path: "/",
      expires: new Date(Date.now() + ONE_YEAR_MS),
    });

    props?.langs?.sort((a) => (a.value === props.currentLang?.value ? -1 : 1));

    ctx.response.headers.set("HX-Refresh", "true");
  }
  return { ...props };
};

const STORE_SELECTOR = "store-selector";

export default ({
  langs = [
    {
      alt: "United States",
      flag:
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/f5044d94-348f-4a63-aa15-76949855d78d/us-flag.webp",
      label: "EN                                ",
      value: "en",
    },
    {
      alt: "Canada",
      flag:
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d83429c1-3a7a-4751-8056-e26c7f33bd0a/ca-flag.webp",
      label: "EN",
      value: "en-ca",
    },
    {
      flag:
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d83429c1-3a7a-4751-8056-e26c7f33bd0a/ca-flag.webp",
      alt: "Canada - French",
      label: "FR",
      value: "fr-ca",
    },
  ],
  ...props
}: PreheaderProps) => {
  const [currentLang, ...otherLanguages] = langs;

  if (props?.variant === "stores") {
    const groupedStores = groupStoresByState({
      places: props?.stores ?? [],
      language: currentLang?.value,
    });
    return (
      <>
        <Drawer
          id={STORE_SELECTOR}
          class="drawer-end z-50"
          open
          aside={
            <Drawer.Aside title="Journeys Stores" drawer={STORE_SELECTOR}>
              <div
                class="h-full flex flex-col bg-base-100 items-center justify-start overflow-auto"
                style={{
                  minWidth: "calc(min(100vw, 425px))",
                  maxWidth: "425px",
                }}
              >
                <div class="flex flex-col gap-4 w-full px-4 mt-2">
                  <h3 class="text-lg font-primary font-medium">Find a store</h3>
                  <form class="flex gap-2 items-end">
                    <div class="flex flex-col gap-1 flex-1">
                      <label
                        htmlFor="PostalCode"
                        class="font-primary text-sm font-bold"
                      >
                        Zip/Postal Code
                      </label>
                      <input
                        name="PostalCode"
                        type="tel"
                        id="PostalCode"
                        aria-label="Zip/Postal Code"
                        placeholder="Enter zip/postal code"
                        autocomplete="postal-code"
                        pattern="(?=.*[A-Za-z]).{6,}|[0-9]{5}"
                        class="input input-bordered input-sm w-full rounded-none outline-none focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      class={clx(
                        "min-w-0 flex-shrink-0",
                        "text-white bg-gray-100 border-gray-100",
                        "select-none",
                        "font-primary font-normal uppercase btn-sm",
                      )}
                    >
                      Search
                    </button>
                  </form>
                </div>
                <StoreList stores={groupedStores} />
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

  const isKidzHome = props?.url?.pathname === "/kidz";
  const isDesktop = useDevice() === "desktop";

  if (!isDesktop) {
    return (
      <div class="flex items-center text-white h-full uppercase">
        <a
          href="/"
          class={clx(
            "px-7 h-full flex items-center justify-center whitespace-nowrap",
            isKidzHome ? "text-[#666] bg-[#cfcfcf]" : "text-[#202020] bg-white",
          )}
        >
          Journeys
        </a>
        <a
          href="/kidz"
          class={clx(
            "px-7 h-full flex items-center justify-center whitespace-nowrap",
            isKidzHome ? "text-[#202020] bg-white" : "text-[#666] bg-[#cfcfcf]",
          )}
        >
          Journeys Kidz
        </a>
      </div>
    );
  }

  return (
    <div
      id="preheader-content"
      class="flex justify-between container h-full w-full"
    >
      <div class="flex items-center text-xs text-white uppercase">
        <a
          href="/"
          class={clx(
            "px-7 h-full flex items-center justify-center whitespace-nowrap",
            !isKidzHome && "bg-[#666]",
          )}
        >
          Journeys
        </a>
        <a
          href="/kidz"
          class={clx(
            "px-7 h-full flex items-center justify-center whitespace-nowrap",
            isKidzHome && "bg-[#666]",
          )}
        >
          Journeys Kidz
        </a>
      </div>

      <Alerts alerts={props.alerts} />

      <div class="justify-end items-center hidden gap-2 lg:flex flex-shrink-0 relative">
        <label
          class="flex items-center gap-1 group cursor-pointer"
          hx-target={`#${STORE_SELECTOR}-container`}
          hx-swap="outerHTML"
          hx-trigger="click once"
          hx-get={useComponent(import.meta.url, {
            langs,
            variant: "stores",
          })}
          htmlFor={STORE_SELECTOR}
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
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            aria-haspopup="menu"
            aria-label="Select Language"
            style={{
              fontSize: "10.71px",
              padding: "4.59px 6px",
            }}
            className={clx(
              "flex items-center text-white uppercase group cursor-pointer select-none",
              "border border-transparent",
            )}
          >
            <Image
              src={currentLang?.flag}
              alt={currentLang?.alt}
              width={22}
              height={22}
              loading={"eager"}
            />
            <span class="ml-1 font-primary">{currentLang?.label}</span>
            <div class="caret" />
          </div>
          <ul
            role="menu"
            tabIndex={0}
            className="dropdown-content bg-gray-100 z-[1] w-full"
            style={{
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.175)",
            }}
          >
            {otherLanguages?.map((language) => (
              <li
                tabIndex={0}
                role="menuitem"
                style={{
                  fontSize: "10.71px",
                  padding: "2px 6px",
                }}
                className={clx(
                  "flex items-center justify-center text-white uppercase group cursor-pointer select-none",
                  "border border-transparent",
                )}
                hx-target="#preheader-content"
                hx-post={useComponent(import.meta.url, {
                  ...props,
                  langs,
                  currentLang: language,
                })}
                hx-trigger="click"
                hx-swap="outerHTML transition:true"
                hx-ext="json-enc"
              >
                <Image
                  src={language?.flag}
                  alt={language?.alt}
                  width={22}
                  height={22}
                  loading={"eager"}
                />
                <span class="group-hover:underline ml-1 transition-all duration-300 font-primary">
                  {language?.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id={STORE_SELECTOR + "-container"} class="">
        <Drawer
          id={STORE_SELECTOR}
          class="drawer-end z-50"
          aside={
            <Drawer.Aside title="Journeys Stores" drawer={STORE_SELECTOR}>
              <div
                class="h-full flex flex-col bg-base-100 items-center justify-center overflow-auto"
                style={{
                  minWidth: "calc(min(100vw, 425px))",
                  maxWidth: "425px",
                }}
              >
                Em loading meu parceiro....
              </div>
            </Drawer.Aside>
          }
        />
      </div>
    </div>
  );
};
