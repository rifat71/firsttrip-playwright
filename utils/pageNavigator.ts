export class PageNavigator {
  static getPath(page: string): string {
    switch (page.toLowerCase()) {
      case "flight":
        return "/flight";
      default:
        return "/";
    }
  }
}
