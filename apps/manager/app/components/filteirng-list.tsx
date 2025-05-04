import { Fzf } from 'fzf';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Input } from './ui/input';

import type {
  ChangeEvent,
  Context,
  Dispatch,
  ElementType,
  PropsWithChildren,
  SetStateAction,
  ComponentProps,
} from 'react';

type FilteredItem = { id: string };
type FilteringContextShape<T extends FilteredItem> = {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
};
function createFilteringContext<T extends FilteredItem>() {
  return createContext<FilteringContextShape<T> | null>(null);
}

function createFilteringProvider<T extends FilteredItem>(
  context: Context<FilteringContextShape<T> | null>,
) {
  return ({
    children,
    ...props
  }: PropsWithChildren<{
    items: T[];
  }>) => {
    const [items, setItems] = useState(props.items);
    return (
      <context.Provider
        value={{
          items,
          setItems,
        }}
      >
        {children}
      </context.Provider>
    );
  };
}

function createFilteringHook<T extends FilteredItem>(
  context: Context<FilteringContextShape<T> | null>,
) {
  return () => {
    const ctx = useContext(context);
    if (!ctx) {
      throw new Error(
        'useFiltering can only be used within a Filtering Provider',
      );
    }
    return ctx;
  };
}

function createFilteringInputProps<T extends FilteredItem>(
  context: Context<FilteringContextShape<T> | null>,
) {
  return ({ indexer }: { indexer?: IndexerFn<T> }) => {
    const ctx = useContext(context);

    const index = useMemo(() => {
      if (!ctx || !indexer) {
        return;
      }

      return new Fzf(ctx.items, {
        selector: indexer || ((item) => JSON.stringify(item)),
      });
    }, []);

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (!ctx || !value || !index) {
          return;
        }

        const items = index.find(value);

        ctx.setItems(items.map((item) => item));
      },
      [ctx?.items, ctx?.setItems],
    );

    return {
      onChange: handleInputChange,
    };
  };
}

type IndexerFn<T extends FilteredItem> = (item: T) => string;

export function createFiltering<T extends FilteredItem>({
  indexer,
}: {
  indexer?: (item: T) => string;
} = {}) {
  const context = createFilteringContext<T>();
  const Provider = createFilteringProvider<T>(context);
  const useFiltering = createFilteringHook<T>(context);
  const useFilteringInputProps = createFilteringInputProps<T>(context);

  const List = ({
    listElement: List,
    itemElement: Item,
  }: {
    listElement: ElementType<PropsWithChildren>;
    itemElement: ElementType<{ item: T }>;
  }) => {
    const filtering = useFiltering();
    return (
      <List>
        {filtering.items.map((item) => {
          return <Item key={item.id} item={item} />;
        })}
      </List>
    );
  };

  const FilterInput = ({ ...props }: ComponentProps<'input'>) => {
    const filtering = useFilteringInputProps({ indexer });
    return <Input type="search" {...filtering} {...props} />;
  };

  return {
    Provider,
    List,
    FilterInput,
    useFiltering,
  };
}
