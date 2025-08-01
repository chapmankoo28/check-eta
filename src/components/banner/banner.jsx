import { Flex, Heading, Separator, Text, Tooltip } from '@radix-ui/themes';
import './banner.css';
import logo from '/logo.webp';

export default function Banner({ type, setSearchParams }) {
  return (
    <>
      <div id="banner">
        <nav>
          <Flex align="center" width="auto" justify="between" mb="2">
            <Tooltip content="About this project">
              <a href="https://github.com/chapmankoo28/check-eta">
                <Flex align="center" width="auto" justify="between">
                  <img src={logo} alt="Logo" width="38" height="38" />
                  <Heading id="nav-title">幾時到</Heading>
                </Flex>
              </a>
            </Tooltip>
            <button type='button' onClick={() => setSearchParams({ type: 'bus' })}>
              <Text className={type === 'bus' ? 'active' : ''} id="nav-bus">
                🚍巴士
              </Text>
            </button>
            <button type='button' onClick={() => setSearchParams({ type: 'metro' })}>
              <Text className={type === 'metro' ? 'active' : ''} id="nav-metro">
                🚇鐡路
              </Text>
            </button>
          </Flex>
          <Separator size="4" />
        </nav>
      </div>
    </>
  );
}
