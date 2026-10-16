interface AnsahLogoProps {
  className?: string;
  variant?: 'mark' | 'full';
  size?: number | string;
  color?: string;
}

export default function AnsahLogo({
  className = '',
  variant = 'full',
  size = 40,
  color = 'currentColor',
}: AnsahLogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: size, height: size }}
        aria-label="ANSAH Technology Logo Mark"
      >
        {/* Left Circle Node */}
        <circle cx="34" cy="98" r="14" fill={color} />

        {/* Lower Left Foot */}
        <path
          d="M26 138 C26 130, 32 124, 40 124 L48 124 C56 124, 62 130, 62 138 L58 160 C58 168, 52 174, 44 174 L36 174 C28 174, 24 168, 26 160 Z"
          fill={color}
        />

        {/* Dynamic Sweeping 'A' Stroke */}
        <path
          d="M82 52 C72 52, 64 64, 62 76 L44 122 C42 128, 48 134, 55 134 L92 134 L110 170 C113 176, 120 178, 126 174 L142 164 C148 160, 149 152, 145 146 L108 80 C103 66, 94 52, 82 52 Z M72 108 L84 84 L94 108 Z"
          fill={color}
        />

        {/* Modern 'T' Crossbar and Stem */}
        <path
          d="M96 52 C96 46, 101 42, 107 42 L182 42 C188 42, 193 46, 193 52 L193 72 C193 78, 188 82, 182 82 L164 82 L164 130 C164 140, 156 148, 146 148 L134 148 C128 148, 124 144, 124 138 L124 82 L107 82 C101 82, 96 78, 96 72 Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Monogram Graphic Icon */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
        className="shrink-0"
        aria-label="ANSAH Technology Monogram"
      >
        {/* Left Circle Node */}
        <circle cx="34" cy="98" r="14" fill={color} />

        {/* Lower Left Foot */}
        <path
          d="M26 138 C26 130, 32 124, 40 124 L48 124 C56 124, 62 130, 62 138 L58 160 C58 168, 52 174, 44 174 L36 174 C28 174, 24 168, 26 160 Z"
          fill={color}
        />

        {/* Dynamic Sweeping 'A' Stroke */}
        <path
          d="M82 52 C72 52, 64 64, 62 76 L44 122 C42 128, 48 134, 55 134 L92 134 L110 170 C113 176, 120 178, 126 174 L142 164 C148 160, 149 152, 145 146 L108 80 C103 66, 94 52, 82 52 Z M72 108 L84 84 L94 108 Z"
          fill={color}
        />

        {/* Modern 'T' Crossbar and Stem */}
        <path
          d="M96 52 C96 46, 101 42, 107 42 L182 42 C188 42, 193 46, 193 52 L193 72 C193 78, 188 82, 182 82 L164 82 L164 130 C164 140, 156 148, 146 148 L134 148 C128 148, 124 144, 124 138 L124 82 L107 82 C101 82, 96 78, 96 72 Z"
          fill={color}
        />
      </svg>

      {/* Typography Lockup matching the user-uploaded logo */}
      <div className="flex flex-col justify-center leading-none select-none">
        <span className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans uppercase">
          ANSAH
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-neutral-700 dark:text-neutral-300 uppercase -mt-0.5">
          TECHNOLOGY
        </span>
      </div>
    </div>
  );
}
