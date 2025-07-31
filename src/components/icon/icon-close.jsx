import { Icon } from './icon';

export function IconClose({ size = 32, rotate }) {
  return (
    <Icon
      color="#D93526"
      size={size}
      rotate={rotate}
      path={
        'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'
      }
    />
  );
}
