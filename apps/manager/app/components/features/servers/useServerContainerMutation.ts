import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import * as api from '../../../core/api';

import { useGetServerDetailQuery } from './useGetServerDetailQuery';

import type { Server } from '@dayzserver/sdk/schema';

export function useCreateServerContainerMutation(server?: Server | null) {
  const queryClient = useQueryClient();
  const createServerContainerFn = useServerFn(api.server.createServerContainer);
  return useMutation({
    mutationFn: async () => {
      if (!server) {
        return;
      }

      return await createServerContainerFn({
        data: {
          serverId: server.id,
        },
      });
    },
    async onSuccess() {
      if (!server) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.invalidateQueries({
        queryKey: useGetServerDetailQuery.createKey({
          serverId: server.id,
        }),
      });
    },
  });
}
export function useStartServerContainerMutation(server?: Server | null) {
  const queryClient = useQueryClient();
  const startContainerFn = useServerFn(api.server.startServerContainer);
  return useMutation({
    mutationFn: async () => {
      if (!server) {
        return;
      }

      return await startContainerFn({
        data: {
          serverId: server.id,
        },
      });
    },
    async onSuccess() {
      if (!server) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.invalidateQueries({
        queryKey: useGetServerDetailQuery.createKey({
          serverId: server.id,
        }),
      });
    },
  });
}

export function useRestartServerContainerMutation(server?: Server | null) {
  const queryClient = useQueryClient();
  const startContainerFn = useServerFn(api.server.startServerContainer);
  return useMutation({
    mutationFn: async () => {
      if (!server) {
        return;
      }

      return await startContainerFn({
        data: {
          serverId: server.id,
        },
      });
    },
    async onSuccess() {
      if (!server) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.invalidateQueries({
        queryKey: useGetServerDetailQuery.createKey({
          serverId: server.id,
        }),
      });
    },
  });
}
export function useStopServerContainerMutation(server?: Server | null) {
  const queryClient = useQueryClient();
  const startContainerFn = useServerFn(api.server.startServerContainer);
  return useMutation({
    mutationFn: async () => {
      if (!server) {
        return;
      }

      return await startContainerFn({
        data: {
          serverId: server.id,
        },
      });
    },
    async onSuccess() {
      if (!server) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.invalidateQueries({
        queryKey: useGetServerDetailQuery.createKey({
          serverId: server.id,
        }),
      });
    },
  });
}
export function useRemoveServerContainerMutation(server?: Server | null) {
  const queryClient = useQueryClient();
  const removeContainerFn = useServerFn(api.server.removeServerContainer);
  return useMutation({
    mutationFn: async () => {
      if (!server) {
        return;
      }

      return await removeContainerFn({
        data: {
          serverId: server.id,
        },
      });
    },
    async onSuccess() {
      if (!server) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.invalidateQueries({
        queryKey: useGetServerDetailQuery.createKey({
          serverId: server.id,
        }),
      });
    },
  });
}
