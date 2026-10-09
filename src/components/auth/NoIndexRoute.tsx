import { Outlet } from "react-router-dom";
import { useNoIndex } from "../../seo/usePageMeta";

/**
 * Layout for pages that should never appear in search results
 * (sign-in, account recovery, security notices).
 */
export default function NoIndexRoute() {
  useNoIndex();

  return <Outlet />;
}
