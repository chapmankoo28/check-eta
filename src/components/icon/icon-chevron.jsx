import { Icon } from './icon';

export function IconChevron({ size = 32, rotate = 90 }) {
  return (
    <Icon
      size={size}
      rotate={rotate}
      className="icon-chevron"
      path={
        'M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z'
      }
    />
  );
}
