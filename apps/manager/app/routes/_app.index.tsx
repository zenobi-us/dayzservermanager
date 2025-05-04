import { createFileRoute } from '@tanstack/react-router';

import { Container } from ':components/container';
export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container className="w-44 p-8 flex flex-grow items-center justify-center [view-transition-name:main-content]">
      Public
    </Container>
  );
}
