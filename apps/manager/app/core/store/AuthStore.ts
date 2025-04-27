import { Store } from '@tanstack/react-store';

export const AuthStore = new Store<
  | {
      isAuthenticated: true;
      username: string;
    }
  | {
      isAuthenticated?: undefined | false;
    }
>(
  {
    isAuthenticated: false,
  },
  {
    onUpdate() {},
  },
);
