import type { LoadingFallbackProps, SectionProps } from "@deco/deco";
import { useDevice, useScript } from "@deco/deco/hooks";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Bag from "../../components/header/Bag.tsx";
import type { MenuItemProps } from "../../components/header/Menu.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Preheader, { ONE_YEAR_MS } from "../../components/header/Preheader.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SEARCHBAR_POPUP_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import type { AppContext } from "apps/vtex/mod.ts";
import { getCookies, setCookie } from "std/http/cookie.ts";
import type { Lang, Langs } from "../../loaders/languages.ts";
import { removeNonLatin1Chars } from "apps/utils/normalize.ts";
import { Segment } from "apps/vtex/utils/types.ts";
import { Place } from "apps/commerce/types.ts";

export interface Logo {
  /** @title Image */
  src: ImageWidget;
  /** @title Describe the image */
  alt: string;
  width?: number;
  height?: number;
}

export interface PreheaderProps {
  /**
   * @title Language Options
   */
  langs?: Langs;
  /**
   * @ignore
   */
  currentLang?: Lang;
  alerts?: Alert[];
  /**
   * @ignore
   */
  url?: URL;
  /**
   * @ignore
   */
  variant?: "stores" | "get-stores";
  /**
   * @ignore
   */
  stores?: Place[];
}

/**
 * @titleBy text
 */
interface Alert {
  text: string;
  /** @title Link  */
  href: string;
}

export interface Props {
  /**
   * @title Preheader
   */
  preheader?: PreheaderProps;
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: MenuItemProps[];
  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;
  /** @title Logo */
  logo: Logo;
  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
  /**
   * @ignore
   */
  url?: string;
}

export function Alerts({ alerts }: { alerts: Alert[] }) {
  return (
    <>
      <div class="w-full mx-auto bg-[#202020] relative h-10">
        {alerts.map(({ text, href }, index) => (
          <a
            href={href}
            class="text-center text-white h-10 hover:underline text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity opacity-0 pointer-events-none flex justify-center items-center uppercase truncate"
            data-index={index}
            data-alert
          >
            {text}
          </a>
        ))}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: useScript(() => {
            const alerts = document.querySelectorAll<HTMLAnchorElement>(
              "[data-alert]",
            );

            // @ts-ignore -
            for (const alert of alerts) {
              alert.ontransitionend = () => {
                // Appear
                if (alert.classList.contains("opacity-100")) {
                  alert.classList.remove("pointer-events-none");

                  // Disappear
                  setTimeout(() => {
                    alert.classList.add("pointer-events-none");
                    alert.classList.replace("opacity-100", "opacity-0");
                  }, 5000);
                }

                if (alert.classList.contains("opacity-0")) {
                  const index = Number(alert.dataset.index);

                  // 1, 2, 3, 1, 2 ....
                  transition(
                    (index + 1) %
                      document.querySelectorAll("[data-alert]").length,
                  );
                }
              };
            }

            function transition(index: number) {
              alerts[index].classList.replace("opacity-0", "opacity-100");
            }

            setTimeout(() => transition(0), 0);
          }),
        }}
      />
    </>
  );
}

const Desktop = ({ navItems, logo, searchbar, loading }: Props) => (
  <>
    <Modal id={SEARCHBAR_POPUP_ID}>
      <div
        class="absolute top-0 bg-base-100 container"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {loading === "lazy"
          ? (
            <div class="flex justify-center items-center">
              <span class="loading loading-spinner" />
            </div>
          )
          : <Searchbar {...searchbar} />}
      </div>
    </Modal>

    <div class="flex flex-col items-center pt-1">
      <div class="flex justify-center items-center w-full px-2.5 container">
        <div class="pr-9">
          <a href="/" aria-label="Store logo">
            <Image src={logo.src} alt={logo.alt} width={91} height={38} />
          </a>
        </div>
        <ul class="flex gap-8">
          {navItems?.slice(0, 10).map(({ item, subItems, itemUrl }) => (
            <NavItem item={item} itemUrl={itemUrl} subItems={subItems} />
          ))}
        </ul>

        <div class="flex gap-8 items-center ml-auto">
          <label
            for={SEARCHBAR_POPUP_ID}
            class="size-6 flex items-center justify-center cursor-pointer"
            aria-label="search icon button"
          >
            <Icon id="search" size={17} />
          </label>
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/4a55a936-708c-46ad-983f-00bfc9ed0701/location-pointer-2961.png"
            width={17}
            height={17}
          />
          <Image
            src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/journeys/d42ce836-76b5-41fd-a500-314061658361/user-6769-(1).png"
            width={17}
            height={17}
          />
          <Bag />
        </div>
      </div>
    </div>
  </>
);

const Mobile = ({
  logo,
  searchbar,
  navItems,
  loading,
  url,
  preheader,
}: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      class=""
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div
            class="h-full flex flex-col bg-base-100 items-center justify-center overflow-auto"
            style={{
              minWidth: "calc(min(80vw, 425px))",
              maxWidth: "425px",
            }}
          >
            <Searchbar {...searchbar} />
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.AsideHeaderMenu
          header={url && (
            <Preheader
              url={new URL(url)}
              alerts={preheader?.alerts ?? []}
              langs={preheader?.langs}
            />
          )}
          drawer={SIDEMENU_DRAWER_ID}
        >
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItems ?? []} />}
        </Drawer.AsideHeaderMenu>
      }
    />

    <div
      class="flex justify-between items-center w-full px-2.5 shadow-mobile"
      style={{
        height: NAVBAR_HEIGHT_MOBILE,
      }}
    >
      <label
        for={SIDEMENU_DRAWER_ID}
        class={clx("w-[68px] flex items-center justify-start")}
        aria-label="open menu"
      >
        <Icon id="menu" width={22} height={27} />
      </label>

      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center"
          style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
            class="w-auto max-w-full h-auto max-h-10 inline-block"
          />
        </a>
      )}

      <div class="flex gap-5 justify-center items-center">
        <label
          for={SEARCHBAR_DRAWER_ID}
          class="size-6 flex items-center justify-center"
          aria-label="search icon button"
        >
          <Icon id="search" width={17} height={17} />
        </label>
        <Bag />
      </div>
    </div>
  </>
);

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const cookies = getCookies(req.headers);
  const langParamValue = new URL(req.url)?.searchParams?.get("language");

  if (langParamValue) {
    setCookie(ctx.response.headers, {
      name: "language",
      value: langParamValue,
      path: "/",
      expires: new Date(Date.now() + ONE_YEAR_MS),
    });
  }

  const currentCookieLang = langParamValue ?? cookies?.language ?? "";
  const langsOrderedWithSelectedFirst = props?.preheader?.langs?.sort((a) =>
    a?.value === currentCookieLang ? -1 : 1
  );

  const vtexCookie = cookies["vtex_segment"];
  if (!vtexCookie) {
    return {
      ...props,
      preheader: { ...props.preheader, langs: langsOrderedWithSelectedFirst },
      url: req.url,
    };
  }
  const vtexSegment = JSON.parse(atob(vtexCookie));

  const lang = langsOrderedWithSelectedFirst?.[0];
  const salesChannelInfo = await ctx.invoke.vtex.loaders.logistics
    .getSalesChannelById({
      id: lang?.salesChannel,
    });

  const newVtexSegment = {
    ...vtexSegment,
    currencyCode: salesChannelInfo.CurrencyCode,
    currencySymbol: salesChannelInfo.CurrencySymbol,
    countryCode: salesChannelInfo.CountryCode,
    cultureInfo: salesChannelInfo.CultureInfo,
  };
  const token = serialize(newVtexSegment);

  setCookie(ctx.response.headers, {
    value: token,
    name: "vtex_segment",
    path: "/",
    secure: true,
    httpOnly: true,
  });

  setCookie(ctx.response.headers, {
    value: "sc=" + lang?.salesChannel,
    name: "VTEXSC",
    path: "/",
    secure: true,
    httpOnly: true,
  });

  return {
    ...props,
    preheader: { ...props.preheader, langs: langsOrderedWithSelectedFirst },
    url: req.url,
  };
};

const serialize = ({
  campaigns,
  channel,
  priceTables,
  regionId,
  utm_campaign,
  utm_source,
  utm_medium,
  utmi_campaign,
  utmi_page,
  utmi_part,
  currencyCode,
  currencySymbol,
  countryCode,
  cultureInfo,
  channelPrivacy,
}: Partial<Segment>) => {
  const seg = {
    campaigns,
    channel,
    priceTables,
    regionId,
    utm_campaign: utm_campaign &&
      removeNonLatin1Chars(utm_campaign).replace(/[\[\]{}()<>]/g, ""),
    utm_source: utm_source &&
      removeNonLatin1Chars(utm_source).replace(/[\[\]{}()<>]/g, ""),
    utm_medium: utm_medium &&
      removeNonLatin1Chars(utm_medium).replace(/[\[\]{}()<>]/g, ""),
    utmi_campaign: utmi_campaign && removeNonLatin1Chars(utmi_campaign),
    utmi_page: utmi_page && removeNonLatin1Chars(utmi_page),
    utmi_part: utmi_part && removeNonLatin1Chars(utmi_part),
    currencyCode,
    currencySymbol,
    countryCode,
    cultureInfo,
    channelPrivacy,
  };
  return btoa(JSON.stringify(seg));
};

export default function Header(props: SectionProps<typeof loader>) {
  const isDesktop = useDevice() === "desktop";

  return (
    <header
      style={{
        height: isDesktop ? HEADER_HEIGHT_DESKTOP : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-white fixed w-full z-40 shadow-header">
        <div class="w-full h-full flex items-center">
          <div class="flex items-center h-full w-full border-b-[3px] border-b-green-100 bg-gray-100">
            {!isDesktop && <Alerts alerts={props.preheader.alerts ?? []} />}
            {props.url && isDesktop && (
              <Preheader
                url={new URL(props.url)}
                alerts={props.preheader.alerts ?? []}
                langs={props.preheader.langs}
              />
            )}
          </div>
        </div>
        {isDesktop ? <Desktop {...props} /> : <Mobile {...props} />}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="lazy" />
);
