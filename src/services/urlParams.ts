export const UrlParams = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  getAll(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  set(key: string, value: string) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    this._updateUrl(params);
  },

  setMany(newParams: Record<string, string | null>) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    this._updateUrl(params);
  },

  remove(key: string) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    this._updateUrl(params);
  },

  _updateUrl(params: URLSearchParams) {
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  },

  onChange(callback: () => void) {
    if (typeof window === "undefined") return;
    window.addEventListener("popstate", callback);
    return () => window.removeEventListener("popstate", callback);
  },
};
