import { getToken } from "./api";

export function authRequired(Component) {
  return function Wrapped(props) {
    const t = getToken();
    if (!t) {
      window.location.href = "/login";
      return null;
    }
    return <Component {...props} />;
  };
}
