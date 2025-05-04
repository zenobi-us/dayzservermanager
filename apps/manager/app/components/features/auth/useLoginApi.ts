import { useMutation, useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Effect, useStore } from '@tanstack/react-store';
import { useEffect } from 'react';

import { AuthStore } from ':core/store/AuthStore';

import * as api from '../../../core/api';

import { isErrorResponse } from ':types/response';

export function useLoginApi() {
  const authenticatedUserFn = useServerFn(api.steam.getAuthenticatedUser);
  const loginFn = useServerFn(api.steam.login);

  const username = useStore(
    AuthStore,
    (state) => state.isAuthenticated && state.username,
  );
  const isAuthenticated = useStore(AuthStore, (state) => state.isAuthenticated);

  const userQuery = useQuery({
    queryFn: () => authenticatedUserFn(),
    queryKey: ['authenticated-user'],
    select(data) {
      if (isErrorResponse(data)) {
        return;
      }
      AuthStore.setState((state) => ({
        ...state,
        isAuthenticated: !!data.data.username,
        username: data.data.username,
      }));
      return data;
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess(data) {
      if (isErrorResponse(data)) {
        throw new Error(data.errorCode);
      }
      AuthStore.setState((state) => ({
        ...state,
        username: data.data.username,
        isAuthenticated: true,
      }));
    },
    onError() {
      AuthStore.setState((state) => ({
        ...state,
        username: undefined,
        isAuthenticated: false,
      }));
    },
  });

  useEffect(() => {
    const effect = new Effect({
      fn: () => {
        console.log('The AuthStore is now:', AuthStore.state);
      },
      // Array of `Store`s or `Derived`s
      deps: [AuthStore],
      // Should effect run immediately, default is false
      eager: true,
    });

    return () => {
      effect.mount();
    };
  }, []);

  return {
    username,
    isAuthenticated,
    userQuery,
    loginMutation,
  };
}
