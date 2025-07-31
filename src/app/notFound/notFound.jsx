import { IconHome } from '@/components/icon/icon-home';
import { Button, Flex, Heading } from '@radix-ui/themes';

export default function NotFound() {
  return (
    <>
      <Flex direction="column" gap="6" align="center">
        <Heading size="9" weight="light">
          404
        </Heading>
        <Heading size="8">Page Not Found</Heading>
        <Button asChild>
          <a href="/">
            <IconHome color="#ffffff" />
            Back to Home
          </a>
        </Button>
      </Flex>
    </>
  );
}
