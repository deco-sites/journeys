import { clx } from "../../sdk/clx.ts";
import Image from "apps/website/components/Image.tsx";
import { Alerts, PreheaderProps } from "../../sections/Header/Header.tsx";
import { useComponent } from "../../sections/Component.tsx";
import { setCookie } from "std/http/cookie.ts";
import { useDevice } from "@deco/deco/hooks";
import Drawer from "../ui/Drawer.tsx";
import { AppContext } from "../../apps/deco/vtex.ts";
import StoreSelector from "./StoreSelector/StoreSelector.tsx";
import {
  STORE_SELECTOR_CONTAINER_ID,
  STORE_SELECTOR_DRAWER_ID,
} from "../../constants.ts";

export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const action = (
  props: PreheaderProps,
  _req: Request,
  ctx: AppContext,
) => {
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

export default ({
  langs = [
    {
      alt: "United States",
      flag:
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/f5044d94-348f-4a63-aa15-76949855d78d/us-flag.webp",
      label: "EN",
      value: "en",
      salesChannel: "1",
    },
    {
      alt: "Canada",
      flag:
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d83429c1-3a7a-4751-8056-e26c7f33bd0a/ca-flag.webp",
      label: "EN",
      value: "en-ca",
      salesChannel: "2",
    },
    {
      flag:
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d83429c1-3a7a-4751-8056-e26c7f33bd0a/ca-flag.webp",
      alt: "Canada - French",
      label: "FR",
      value: "fr-ca",
      salesChannel: "3",
    },
  ],
  ...props
}: PreheaderProps) => {
  const [currentLang, ...otherLanguages] = langs;

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

      <Alerts alerts={props?.alerts ?? []} />

      <div class="justify-end items-center hidden gap-2 lg:flex flex-shrink-0 relative">
        <StoreSelector currentLang={currentLang} />
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
      {/* Store selector - Initial Loading state */}
      <div id={STORE_SELECTOR_CONTAINER_ID} class="">
        <Drawer
          id={STORE_SELECTOR_DRAWER_ID}
          class="drawer-end z-50"
          aside={
            <Drawer.Aside
              title="Journeys Stores"
              drawer={STORE_SELECTOR_DRAWER_ID}
            >
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
