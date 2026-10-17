const iconPaths = {
  github:
    "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56l-.02-1.97c-3.2.69-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.72 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.03 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.57.24 2.74.12 3.03.74.81 1.18 1.84 1.18 3.1 0 4.45-2.69 5.42-5.26 5.7.41.36.78 1.08.78 2.18l-.01 3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z",
  "arrow-down": "M12 5v14m0 0 6-6m-6 6-6-6",
  zap: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  layers: "M12 2 2 7l10 5 10-5-10-5Zm0 10 10-5M2 17l10 5 10-5M2 12l10 5 10-5",
  handshake:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0m7-3.87a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87",
  code: "m16 18 6-6-6-6M8 6l-6 6 6 6",
  smartphone: "M12 18h.01M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
  briefcase: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm5 5h8",
  signature: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",
  car: "M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0M5 17H3v-5l2-5h14l2 5v5h-2M5 12h14",
  clock: "M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
};

const strokeIcons = new Set([
  "arrow-down",
  "zap",
  "layers",
  "handshake",
  "code",
  "smartphone",
  "briefcase",
  "signature",
  "car",
  "clock"
]);

function Icon({ name, className = "icon", title }) {
  const path = iconPaths[name];
  if (!path) {
    return null;
  }

  const isStroke = strokeIcons.has(name);

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path
        d={path}
        fill={isStroke ? "none" : "currentColor"}
        stroke={isStroke ? "currentColor" : undefined}
        strokeWidth={isStroke ? "1.8" : undefined}
        strokeLinecap={isStroke ? "round" : undefined}
        strokeLinejoin={isStroke ? "round" : undefined}
      />
    </svg>
  );
}

export default Icon;
