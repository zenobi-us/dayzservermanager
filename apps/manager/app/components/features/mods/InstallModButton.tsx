import { IconPackageImport } from '@tabler/icons-react';

import { Button } from ':components/ui/button';

export function InstallModButton() {
  return (
    <Button>
      <IconPackageImport />
      Install
    </Button>
  );
}
