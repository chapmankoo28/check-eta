export function Icon({
  path,
  size = 32,
  color = '#adadad',
  rotate = 0,
  className = '',
  status = 'idle',
}) {
  return (
    <svg
      className={className}
      data-status={status}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        fill: color,
        transform: `rotate(${rotate}deg)`,
      }}
      width={size}
      height={size}
      viewBox="0 -960 960 960"
    >
      <path d={path} />
    </svg>
  );
}
