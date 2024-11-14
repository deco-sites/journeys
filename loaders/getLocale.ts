import { getCookies } from "std/http/cookie.ts";

const getLocale = (_props: unknown, req: Request) => {
    const cookies = getCookies(req.headers);
    const vtexSegment = cookies?.["vtex_segment"]
      ? JSON.parse(atob(cookies["vtex_segment"]))
      : {};

    return vtexSegment.cultureInfo || "en-US"
}

export default getLocale;

export const cacheKey = (_props: unknown, req: Request) => {
    const cookies = getCookies(req.headers);
    const vtexSegment = cookies?.["vtex_segment"]
      ? JSON.parse(atob(cookies["vtex_segment"]))
      : {};

    return vtexSegment.cultureInfo;
}
