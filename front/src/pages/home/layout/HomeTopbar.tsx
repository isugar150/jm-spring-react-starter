import { memo } from "react";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { Menu as MenuIcon } from "lucide-react";

type HomeTopbarProps = {
  activeMenuLabel: string;
  onMobileToggle: () => void;
};

const HomeTopbar = memo(function HomeTopbar({
  activeMenuLabel,
  onMobileToggle,
}: HomeTopbarProps) {
  return (
    <Flex className="home-topbar" align="center" justify="between">
      <Flex align="center" gap="2">
        <Button
          variant="soft"
          color="gray"
          className="home-mobile-toggle"
          onClick={onMobileToggle}
        >
          <MenuIcon size={18} />
        </Button>
        <Box>
          <Heading size="4">{activeMenuLabel}</Heading>
          <Text size="2" color="gray">
            {activeMenuLabel}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
});

export default HomeTopbar;
