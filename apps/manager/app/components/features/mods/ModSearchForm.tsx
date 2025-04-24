import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { DeleteIcon } from "lucide-react";
import { IPublishedFileServiceQueryFilesRequestParams, IPublishedFileServiceQueryFilesRequestParamsSchema } from "@dayzserver/sdk/steamSchema";


function useModSearchForm() {
    return useForm<IPublishedFileServiceQueryFilesRequestParams>({
        resolver: zodResolver(IPublishedFileServiceQueryFilesRequestParamsSchema),
        defaultValues: {
            search_text: ""
        },
    });
}

export function ModSearchForm({
    onSubmit,
    onClearClick
}: {
    onSubmit: (data: IPublishedFileServiceQueryFilesRequestParams) => void,
    onClearClick: () => void
}) {
    const form = useModSearchForm();

    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                                            <Button variant='link'
                                                type="reset"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive cursor-pointer"
                                                onClick={() => {
                                                    form.reset();
                                                    onClearClick();
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        )}
                                    </div>

                                    <FormMessage />

                                    <Button variant='secondary' type="submit" className="gap-2">
                                        <IconSearch /><span >Search</span>
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}