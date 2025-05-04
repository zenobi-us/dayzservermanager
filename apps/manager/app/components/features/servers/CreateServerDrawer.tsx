import {
  CreateServerPayloadSchema,
  type CreateServerPayload,
} from '@dayzserver/sdk/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useForm } from 'react-hook-form';

import { createServer } from '../../../core/api/server/routes';

import { Button } from ':components/ui/button';
import { Checkbox } from ':components/ui/checkbox';
import { CollapsibleTrigger } from ':components/ui/collapsible';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from ':components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from ':components/ui/form';
import { Input } from ':components/ui/input';

import type { ElementType, PropsWithChildren, ReactNode } from 'react';

export function CreateServerDrawer({ children }: PropsWithChildren) {
  const createServerMutation = useCreateServerMutation();
  const handleSubmit = (data: CreateServerPayload) => {
    createServerMutation.mutate({ data });
  };
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex flex-col w-[480px] rounded-[10px] m-4">
        <div>
          <DrawerHeader>
            <DrawerTitle>New Server</DrawerTitle>
            <DrawerDescription>
              Define configuration and start new container.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col flex-grow px-4">
            <NewServerForm
              isSubmitting={createServerMutation.isPending}
              onSubmit={handleSubmit}
            />
          </div>
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function useCreateServerMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createServerFn = useServerFn(createServer);
  return useMutation({
    onMutate() {},
    mutationFn: createServerFn,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['servers'],
      });
      await router.invalidate();
    },
  });
}

function useCreateServerForm({ disabled }: { disabled?: boolean }) {
  return useForm<CreateServerPayload>({
    disabled,
    resolver: zodResolver(CreateServerPayloadSchema),
    defaultValues: CreateServerPayloadSchema.parse({ hostname: '' }),
  });
}

function NewServerForm({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting?: boolean;
  onSubmit: (data: CreateServerPayload) => void;
}) {
  const form = useCreateServerForm({ disabled: isSubmitting });
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          handleSubmit(event).catch(console.error);
        }}
        className="space-y-8 w-full"
      >
        <div className="flex flex-col gap-4 w-full flex-grow">
          <CreateServerField name="hostname" input={Input} form={form} />
          <CreateServerField name="instanceId" input={Input} form={form} />

          <Collapsible>
            <CollapsibleTrigger>Advanced</CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <CreateServerField
                  name="adminLogPlayerHitsOnly"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="allowFilePatching"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="defaultVisibility"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="disable3rdPerson"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="disableBaseDamage"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="disableVoN"
                  input={Checkbox}
                  form={form}
                />{' '}
                <CreateServerField
                  name="enableCfgGameplayFile"
                  input={Checkbox}
                  form={form}
                />{' '}
                <CreateServerField
                  name="enableDebugMonitor"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="forceSameBuild"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="guaranteedUpdates"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="lightingConfig"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="loginQueueConcurrentPlayers"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="lootHistory"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="maxPlayers"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="multithreadedReplication"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="networkRangeClose"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="respawnTime"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="serverTime"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="serverTimePersistent"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="simulatedPlayersBatch"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="speedhackDetection"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="steamQueryPort"
                  input={Input}
                  form={form}
                />
                <CreateServerField name="template" input={Input} form={form} />
                <CreateServerField
                  name="timeStampFormat"
                  input={Input}
                  form={form}
                />
                <CreateServerField
                  name="verifySignatures"
                  input={Checkbox}
                  form={form}
                />
                <CreateServerField
                  name="vppDisablePassword"
                  input={Checkbox}
                  form={form}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
function CreateServerField<T extends keyof CreateServerPayload>({
  name,
  form,
  description,
  input: Input,
  disabled,
}: PropsWithChildren<{
  name: T;
  description?: ReactNode;
  input: ElementType;
  form: ReturnType<typeof useCreateServerForm>;
  disabled?: boolean;
}>) {
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={!!disabled}
      render={({ field }) => (
        <FormItem className="flex-1">
          <div className="flex gap-2">
            <FormLabel>{name}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
