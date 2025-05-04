import {
  PublishedFileServiceQueryFilesRequestParamsSchema,
  type IPublishedFileServiceQueryFilesRequestParams,
} from '@dayzserver/sdk/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconSearch } from '@tabler/icons-react';
import { DeleteIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from ':components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from ':components/ui/form';
import { Input } from ':components/ui/input';

function useModSearchForm() {
  return useForm<IPublishedFileServiceQueryFilesRequestParams>({
    resolver: zodResolver(PublishedFileServiceQueryFilesRequestParamsSchema),
    defaultValues: {
      search_text: '',
    },
  });
}

export function ModSearchForm({
  onSubmit,
}: {
  onSubmit: (data: IPublishedFileServiceQueryFilesRequestParams) => void;
}) {
  const form = useModSearchForm();

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          handleSubmit(event).catch(console.error);
        }}
        className="space-y-8 w-full"
      >
        <div className="relative flex w-full flex-grow gap-2 items-center">
          <FormField
            control={form.control}
            name="search_text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative flex gap-2 items-center">
                    <FormControl>
                      <Input placeholder="search for mods..." {...field} />
                    </FormControl>

                    {form.formState.isDirty && (
                      <Button
                        variant="link"
                        type="reset"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => {
                          form.reset();
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </div>

                  <FormMessage />

                  <Button variant="secondary" type="submit" className="gap-2">
                    <IconSearch />
                    <span>Search</span>
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
