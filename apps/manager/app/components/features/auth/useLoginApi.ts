import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Effect, useStore } from '@tanstack/react-store';
import { useEffect } from 'react';

import { AuthStore } from ':core/store/AuthStore';
import { isErrorResponse } from ':types/response';

import * as api from '../../../core/api';

export function useLoginApi() {
  const queryClient = useQueryClient();
  const authenticatedUserFn = useServerFn(api.auth.getAuthenticatedUser);
  const loginFn = useServerFn(api.auth.login);
  const logoutFn = useServerFn(api.auth.logout);

  const isAuthenticated = useStore(AuthStore, (state) => state.isAuthenticated);
  const username = useStore(
    AuthStore,
    (state) => state.isAuthenticated && state.username,
  );

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

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await logoutFn();
    },
    async onSuccess(data) {
      if (isErrorResponse(data)) {
        throw new Error(data.errorCode);
      }
      AuthStore.setState((state) => ({
        ...state,
        username: undefined,
        isAuthenticated: false,
      }));
      await queryClient.invalidateQueries({
        queryKey: ['authenticated-user'],
      });
    },
    async onError() {
      AuthStore.setState((state) => ({
        ...state,
        username: undefined,
        isAuthenticated: false,
      }));
      await queryClient.invalidateQueries({
        queryKey: ['authenticated-user'],
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginFn,
    async onSuccess(data) {
      if (isErrorResponse(data)) {
        throw new Error(data.errorCode);
      }
      AuthStore.setState((state) => ({
        ...state,
        username: data.data.username,
        isAuthenticated: true,
      }));
      await queryClient.invalidateQueries({
        queryKey: ['authenticated-user'],
      });
    },
    async onError() {
      AuthStore.setState((state) => ({
        ...state,
        username: undefined,
        isAuthenticated: false,
      }));
      await queryClient.invalidateQueries({
        queryKey: ['authenticated-user'],
      });
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
    logoutMutation,
  };
}
