// Simple localStorage-based mock auth.
// Swap this for your real auth later.
export const auth = {
  isLoggedIn: () => localStorage.getItem("bb_auth") === "1",
  login:      () => localStorage.setItem("bb_auth", "1"),
  logout:     () => localStorage.removeItem("bb_auth"),
};
