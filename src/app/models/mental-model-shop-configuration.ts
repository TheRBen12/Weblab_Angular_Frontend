export interface MentalModelShopConfiguration {
  [key: string]: boolean | number | undefined;
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

}
