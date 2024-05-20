declare module "jquery" {
    interface JQuery<TElement = HTMLElement> {
      countrySelect(options?: any): JQuery<TElement>;
    }
  }