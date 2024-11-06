import { MatchContext } from "@deco/deco";
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
export default function matcher(
  { language }: Props,
  { request }: MatchContext,
) {
  const cookies = request?.headers ? getCookies(request.headers) : {};
  const langParamValue = request.url
    ? new URL(request.url)?.searchParams?.get("language")
    : "";

  if (cookies?.["language"] === language || langParamValue === language) {
    return true;
  }

  return false;
}
