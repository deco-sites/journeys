import { getCookies } from "std/http/cookie.ts";

const getCurrency = (_props: unknown, req: Request) => {
  const cookies = getCookies(req.headers);
  const vtexSegment = cookies?.["vtex_segment"]
    ? JSON.parse(atob(cookies["vtex_segment"]))
    : {};

  return vtexSegment.currencyCode || "USD";
};

export default getCurrency;

export const cacheKey = (_props: unknown, req: Request) => {
  const cookies = getCookies(req.headers);
  const vtexSegment = cookies?.["vtex_segment"]
    ? JSON.parse(atob(cookies["vtex_segment"]))
    : {};

  return vtexSegment.currencyCode;
};
