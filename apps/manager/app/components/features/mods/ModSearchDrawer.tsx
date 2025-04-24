import { IconCircleX, IconPlus, } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ModSearchResults } from './ModSearchResults';
import { cn } from '@/lib/utils';
import { ModSearchForm } from './ModSearchForm';
import { ModSearchPagination } from './ModSearchPagination';
import { resetSearch, search } from './useModSearch';


export function ModSearchDrawer() {

    return (
        <Drawer onClose={() => {
            resetSearch()
        }}>
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <IconPlus className='mr-2' /> Add mod
                </Button>
            </DrawerTrigger>
            <DrawerContent className='flex flex-col mx-4 min-h-3/4 max-h-3/4'>
                <DrawerHeader className='relative'>
                    <div className="flex flex-grow jusitfy-start items-end gap-4">
                        <div className="flex flex-col gap-2 min-w-1/4">
                            <DrawerTitle>Search for mods</DrawerTitle>
                            <DrawerDescription>find and install a mod.</DrawerDescription>
                        </div>
                        <ModSearchForm
                            onClearClick={() => {
                                search()
                            }}
                            onSubmit={(data) => {
                                search(data)
                            }}
                        />
                        <DrawerClose className={cn(
                            'absolute -top-10 right-5 cursor-pointer border-4 rounded-full border-white bg-white',
                        )}>
                            <IconCircleX
                                size={32}
                                className='stroke-gray-400 hover:stroke-black'
                            />
                        </DrawerClose>
                    </div>
                </DrawerHeader>
                <div className="overflow-y-scroll rounded-md border m-2 p-2 flex flex-col flex-grow">
                    <ModSearchResults className="block overflow-visible" />
                </div>
                <DrawerFooter>
                    <ModSearchPagination />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}