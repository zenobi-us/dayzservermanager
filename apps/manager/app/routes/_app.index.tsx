import { createFileRoute, Link } from '@tanstack/react-router';

import { Container } from ':components/container';
import { Text } from ':components/text';
export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container className="w-44 p-8 flex flex-grow items-center justify-center [view-transition-name:main-content]">
      <div className="flex flex-col flex-grow items-center">
        <Text>Public</Text>
        <Link to="/d">Start</Link>
      </div>
    </Container>
  );
}
