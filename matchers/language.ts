import { getCookies } from "std/http/cookie.ts";

export interface Props {
  /**
   * @title Language
   */
  language?: string;
}

/**
 * @title Language Preference
 * @description Checks cookies or search parameters to determine if the specified language exists.
 * @icon world-www
 */
export default function matcher({ language }: Props, req: Request) {
  const cookies = req?.headers ? getCookies(req.headers) : {};
  const langParamValue = req.url
    ? new URL(req.url)?.searchParams?.get("language")
    : "";

  if (cookies?.["language"] === language || langParamValue === language) {
    return true;
  }

  return false;
}
