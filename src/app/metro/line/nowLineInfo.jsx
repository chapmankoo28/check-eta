import { IconSwap } from '@/components/icon/icon-swap';
import { Flex, Heading, Text, Tooltip } from '@radix-ui/themes';
import { useState } from 'react';

export default function NowLineInfo({ dir, setSearchParams, now_line: nowLine }) {
  const [rotate, setRotate] = useState(false);
  const handleSwapBound = () => {
    setSearchParams(
      (prev) => {
        prev.set('dir', prev.get('dir') === 'DT' ? 'UT' : 'DT');
        return prev;
      },
      { replace: true }
    );
    setRotate(true);
    setTimeout(() => {
      // The timeout should match the animation duration
      setRotate(false);
    }, 500);
  };

  return (
    <>
      <div className="now-route-info">
        <div className={'mtr-line-color ' + nowLine['Line Code'].toLowerCase()} />

        <Heading id="now-route-dest">{nowLine['Chinese Name']}</Heading>

        <Flex gap="1" align="baseline">
          <Text size="2">往</Text>
          <Text size="5">{nowLine[dir][nowLine[dir].length - 1]['Chinese Name']}</Text>
        </Flex>
        <Tooltip content="切換方向">
          <button type='button' onClick={handleSwapBound}>
            <IconSwap state={rotate ? 'loading' : ''} />
          </button>
        </Tooltip>
      </div>
    </>
  );
}
