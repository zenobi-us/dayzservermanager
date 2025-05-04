import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useLoginFormContext } from './LoginFormContext';

export function LoginFormFields() {
  const form = useLoginFormContext();
  return (
    <div className="flex flex-col w-full gap-4 px-4">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                className="flex"
                type="text"
                placeholder="Username"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                className="flex"
                type="password"
                placeholder="password"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
