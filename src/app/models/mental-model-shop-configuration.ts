export interface MentalModelShopConfiguration {
  [key: string]: boolean | number | undefined | Date;
  shoppingCartBottomRight: boolean;
  shoppingCartBottomLeft: boolean;
  searchBarTop: boolean;
  autoCompleteTop: boolean;
  shoppingCartTopLeft: boolean;
  shoppingCartTopRight: boolean;
  searchBarBottom: boolean;
  autoCompleteBottom: boolean;
  sideMenuLeft: boolean;
  sideMenuRight: boolean;
  filter: boolean;
  navBarTop: boolean;
  navBarBottom: boolean;
  megaDropDown: boolean;
  userId?: number;
  breadcrumbs: boolean;
  createdAt: Date;
  experimentTestId: number
  menuToggleIcon: boolean,
  menuTitle: boolean,
  offCanvasMenu: boolean,

}
