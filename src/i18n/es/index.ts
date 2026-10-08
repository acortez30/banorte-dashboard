import { nav } from "./nav";
import { carriers } from "./carriers";
import { home } from "./home";
import { auth } from "./auth";
import { orders } from "./orders";
import { lockers } from "./lockers";
import { services } from "./services";
import { clients } from "./clients";
import { tickets } from "./tickets";
import { finance } from "./finance";
import { units } from "./units";
import { users } from "./users";
import { settings } from "./settings";
import { analytics } from "./analytics";
import { common } from "./common";
import { help } from "./help";
import { orderDetail } from "./orderDetail";
import { transactionDetail } from "./transactionDetail";
import { company } from "./company";
import { property } from "./property";
import { advertising } from "./advertising";
import { olc } from "./olc";
import { filter } from "./filter";
import { packages } from "./package";

export const es: Record<string, string> = {
  ...nav,
  ...filter,
  ...carriers,
  ...home,
  ...auth,
  ...orders,
  ...lockers,
  ...services,
  ...clients,
  ...tickets,
  ...finance,
  ...packages,
  ...units,
  ...users,
  ...settings,
  ...analytics,
  ...common,
  ...help,
  ...orderDetail,
  ...transactionDetail,
  ...company,
  ...property,
  ...advertising,
  ...olc,
};