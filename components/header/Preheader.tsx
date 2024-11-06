import { clx } from "../../sdk/clx.ts";
import Image from "apps/website/components/Image.tsx";
import { PreheaderProps } from "../../sections/Header/Header.tsx";
import { useComponent } from "../../sections/Component.tsx";
import { AppContext } from "../../apps/site.ts";
import { setCookie } from "std/http/cookie.ts";

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

    props?.langs?.sort((a) => a.value === props.currentLang?.value ? -1 : 1);

    ctx.response.headers.set("HX-Refresh", "true");
  }
  return { ...props };
};

const Preheader = ({
  langs = [
    {
      "alt": "United States",
      "flag":
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/f5044d94-348f-4a63-aa15-76949855d78d/us-flag.webp",
      "label": "EN                                ",
      "value": "en",
    },
    {
      "alt": "Canada",
      "flag":
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d83429c1-3a7a-4751-8056-e26c7f33bd0a/ca-flag.webp",
      "label": "EN",
      "value": "en-ca",
    },
    {
      "flag":
        "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d83429c1-3a7a-4751-8056-e26c7f33bd0a/ca-flag.webp",
      "alt": "Canada - French",
      "label": "FR",
      "value": "fr-ca",
    },
  ],
  ...props
}: PreheaderProps) => {
  const [currentLang, ...otherLanguages] = langs;
  return (
    <div
      id="preheader-content"
      class={clx(
        "bg-gray-100 w-full h-9 border-b-[3px] border-b-green-100",
      )}
    >
      <div class="flex justify-between container ">
        <div class="flex flex-1"></div>
        <div class="flex-1 justify-end hidden lg:flex">
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
              aria-selected={true}
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
              <span class="ml-1 font-primary">
                {currentLang?.label}
              </span>
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
      </div>
    </div>
  );
};

export default Preheader;
