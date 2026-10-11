import { useAppSelector } from "../store/hooks";
import { isTokenValid } from "../utils/session";

/**
 * Which account areas the visitor can jump back into. Used by every
 * header so signed-in users and admins always have a way home and back.
 */
export function useAccountLinks() {
  const userToken = useAppSelector((state) => state.auth.token);

  return {
    isUser: isTokenValid(userToken, "user"),
    isAdmin: isTokenValid(localStorage.getItem("adminToken"), "admin"),
  };
}
