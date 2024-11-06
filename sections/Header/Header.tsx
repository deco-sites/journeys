import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
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
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps, SectionProps } from "@deco/deco";
import { clx } from "../../sdk/clx.ts";
import Preheader, { ONE_YEAR_MS } from "../../components/header/Preheader.tsx";
import type { MenuItemProps } from "../../components/header/Menu.tsx";
import { getCookies, setCookie } from "std/http/cookie.ts";
import { AppContext } from "../../apps/site.ts";
import { Lang, Langs } from "../../loaders/languages.ts";

export interface Logo {
  src: ImageWidget;
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
}

export interface HeaderProps {
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
}
type Props = Omit<HeaderProps, "preheader">;
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
            <Image
              src={logo.src}
              alt={logo.alt}
              width={91}
              height={38}
            />
          </a>
        </div>
        <ul class="flex gap-8">
          {navItems?.slice(0, 10).map(({ item, subItems, itemUrl }) => (
            <NavItem item={item} itemUrl={itemUrl} subItems={subItems} />
          ))}
        </ul>

        <div class="flex gap-8 items-center ml-auto">
          <Icon id="search" size={17} />
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

const Mobile = ({ logo, searchbar, navItems, loading }: Props) => (
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
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
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
        </Drawer.Aside>
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
        class={clx(
          "w-[68px] flex items-center justify-start",
        )}
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

export const loader = (props: HeaderProps, req: Request, ctx: AppContext) => {
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
  const currentCookieLang = langParamValue ?? cookies?.["language"] ?? "";

  const langsOrderedWithSelectedFirst = props?.preheader?.langs?.sort((a) =>
    a?.value === currentCookieLang ? -1 : 1
  );

  return {
    ...props,
    preheader: { ...props.preheader, langs: langsOrderedWithSelectedFirst },
  };
};

function Header({
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: SectionProps<typeof loader>) {
  const device = useDevice();
  return (
    <header
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-white fixed w-full z-40 shadow-header">
        <Preheader {...props.preheader} />
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<HeaderProps>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...props as any} loading="lazy" />
);
export default Header;
