import React, { useId } from 'react';
import { CategoryKey } from '../types';

interface VectorFashionArtProps {
  artKey?: CategoryKey;
  sceneKeys?: CategoryKey[];
  colorPalette: string; // e.g. "#f3d3b8,#d98b6b,#fff3e6"
  className?: string;
  animate?: boolean;
}

const SKINS = ['#f2cba8', '#e5b78f', '#d4a17a', '#c48a64'];
const HAIRS = ['#191010', '#241612', '#33201a'];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export const VectorFashionArt: React.FC<VectorFashionArtProps> = ({
  artKey,
  sceneKeys,
  colorPalette,
  className = '',
  animate = true,
}) => {
  const gradientId = useId().replace(/:/g, '_');
  const [a = '#2b2a33', b = '#8b6f5a', d = '#f1e3cc'] = colorPalette.split(',');

  const renderFigure = (
    k: CategoryKey,
    index: number,
    fx: boolean,
    scale = 1,
    tx = 0,
    ty = 0
  ) => {
    const skin = SKINS[index % 4];
    const hair = HAIRS[index % 3];
    const isFam = k === 'kurta' || k === 'dupatta' || k === 'bag' || k === 'jewel';

    const hand = (x: number, y: number) => (
      <ellipse cx={x} cy={y} rx={6} ry={10} fill={skin} />
    );

    const arm = (path: string) => (
      <path
        d={path}
        stroke={skin}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );

    let legs = null;
    let body = null;
    let arms = null;
    let extra = null;

    if (isFam) {
      legs = (
        <>
          <path d="M108 290H192L188 372H157L150 306L143 372H112Z" fill={b} />
          <ellipse cx="128" cy="377" rx="15" ry="5" fill="#222" />
          <ellipse cx="172" cy="377" rx="15" ry="5" fill="#222" />
        </>
      );
      body = (
        <>
          <path
            d="M116 98Q150 114 184 98L192 200L196 296H104L108 200Z"
            fill={d}
          />
          <path
            d="M104 284H196"
            stroke={b}
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </>
      );
      arms = (
        <>
          <g>
            <path d="M118 98L94 116L88 214L105 217L112 140Z" fill={d} />
            {hand(96, 226)}
          </g>
          <g transform="translate(300 0) scale(-1 1)">
            <path d="M118 98L94 116L88 214L105 217L112 140Z" fill={d} />
            {hand(96, 226)}
          </g>
        </>
      );
      extra = (
        <>
          <path d="M136 99Q150 126 164 99Z" fill={skin} />
          <path
            d="M136 100Q150 124 164 100"
            fill="none"
            stroke={b}
            strokeWidth="3"
          />
          <path
            d="M126 128Q150 144 174 128"
            fill="none"
            stroke={b}
            strokeWidth="2"
            strokeDasharray="3 4"
          />
          {k === 'dupatta' && (
            <path
              d="M184 96C226 140 216 240 230 344L248 340C234 236 244 130 194 88Z"
              fill={b}
              opacity={0.9}
            />
          )}
          {k === 'bag' && (
            <g>
              <path
                d="M198 232Q208 210 218 232"
                fill="none"
                stroke={b}
                strokeWidth="4"
              />
              <rect x="190" y="232" width="40" height="44" rx="6" fill={b} />
              <circle cx="210" cy="250" r="4" fill={d} />
            </g>
          )}
          {k === 'jewel' && (
            <g>
              <path
                d="M134 100Q150 134 166 100"
                fill="none"
                stroke="#e8c469"
                strokeWidth="2.5"
              />
              <circle cx="150" cy="123" r="4" fill="#e8c469" />
              <circle cx="133" cy="72" r="3" fill="#e8c469" />
              <circle cx="167" cy="72" r="3" fill="#e8c469" />
            </g>
          )}
        </>
      );
    } else if (k === 'dress') {
      body = (
        <>
          <path
            d="M118 98Q150 114 182 98L194 200L218 374H82L106 200Z"
            fill={d}
          />
          <path
            d="M92 360H208"
            stroke={b}
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </>
      );
      arms = (
        <>
          <g>
            {arm('M99 190L96 216')}
            <path d="M118 98L96 116L91 192L108 194L112 138Z" fill={d} />
            {hand(96, 226)}
          </g>
          <g transform="translate(300 0) scale(-1 1)">
            {arm('M99 190L96 216')}
            <path d="M118 98L96 116L91 192L108 194L112 138Z" fill={d} />
            {hand(96, 226)}
          </g>
        </>
      );
      extra = (
        <>
          <path d="M136 99Q150 124 164 99Z" fill={skin} />
          <path
            d="M136 100Q150 124 164 100"
            fill="none"
            stroke={b}
            strokeWidth="3"
          />
        </>
      );
      legs = (
        <>
          <ellipse cx="128" cy="379" rx="15" ry="5" fill="#222" />
          <ellipse cx="172" cy="379" rx="15" ry="5" fill="#222" />
        </>
      );
    } else if (k === 'gown') {
      body = (
        <>
          <path
            d="M122 98Q150 112 178 98L176 168L246 384H54L124 168Z"
            fill={d}
          />
          <path d="M124 168H176" stroke={b} strokeWidth="5" />
          <path d="M150 168V384" stroke={b} strokeWidth="2" opacity="0.5" />
        </>
      );
      arms = (
        <>
          <g>
            {arm('M121 102L106 160L98 216')}
            {hand(98, 226)}
          </g>
          <g transform="translate(300 0) scale(-1 1)">
            {arm('M121 102L106 160L98 216')}
            {hand(98, 226)}
          </g>
        </>
      );
      extra = (
        <path d="M134 99Q150 118 166 99Z" fill={skin} />
      );
    } else {
      // Co-ord
      legs = (
        <path d="M112 164H188L212 376H156L150 236L144 376H88Z" fill={b} />
      );
      body = (
        <>
          <path d="M118 98Q150 112 182 98L188 168H112Z" fill={d} />
          <path
            d="M112 160H188"
            stroke={b}
            strokeWidth="3"
            strokeDasharray="5 4"
          />
        </>
      );
      arms = (
        <>
          <g>
            {arm('M100 150L96 216')}
            <path d="M118 98L100 114L97 150L112 152Z" fill={d} />
            {hand(96, 226)}
          </g>
          <g transform="translate(300 0) scale(-1 1)">
            {arm('M100 150L96 216')}
            <path d="M118 98L100 114L97 150L112 152Z" fill={d} />
            {hand(96, 226)}
          </g>
        </>
      );
      extra = <path d="M136 99Q150 122 164 99Z" fill={skin} />;
    }

    const hairBack = (
      <path
        d="M132 58Q128 26 150 26Q172 26 168 58L174 128Q150 118 126 128Z"
        fill={hair}
      />
    );

    const head = (
      <>
        <rect x="144" y="78" width="12" height="24" rx="5" fill={skin} />
        <ellipse cx="150" cy="60" rx="16" ry="20" fill={skin} />
        <path
          d="M134 58Q132 38 150 38Q168 38 166 58Q158 46 150 46Q142 46 134 58Z"
          fill={hair}
        />
      </>
    );

    const transform =
      scale !== 1 || tx !== 0 || ty !== 0
        ? `translate(${tx} ${ty}) scale(${scale})`
        : undefined;

    return (
      <g
        key={`${k}-${index}`}
        transform={transform}
        className={fx && animate ? 'transition-transform duration-700 ease-in-out' : undefined}
      >
        <circle cx="150" cy="230" r="125" fill={d} opacity="0.13" />
        <ellipse cx="150" cy="384" rx="78" ry="7" fill="#000" opacity="0.22" />
        <g stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinejoin="round">
          {hairBack}
          {legs}
          {body}
          {arms}
          {head}
          {extra}
        </g>
      </g>
    );
  };

  const renderParticles = (width: number) => {
    return (
      <>
        <circle
          cx={width * 0.25}
          cy={120}
          r={120}
          fill={d}
          opacity="0.12"
          className={animate ? 'animate-pulse' : ''}
        />
        <circle
          cx={width * 0.8}
          cy={300}
          r={150}
          fill="#fff"
          opacity="0.08"
          className={animate ? 'animate-pulse' : ''}
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 67 + 30) % width}
            cy={300 + ((i * 41) % 90)}
            r={1.5 + (i % 3)}
            fill="#fff"
            opacity={0.35 + (i % 4) * 0.15}
          />
        ))}
      </>
    );
  };

  // Panoramic Multi-figure Scene
  if (sceneKeys && sceneKeys.length > 0) {
    const xs = [470, 650, 830];
    const ss = [0.94, 1, 0.94];

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 900 400"
        preserveAspectRatio="xMidYMid slice"
        className={`w-full h-full block ${className}`}
        role="img"
        aria-label="Models wearing the luxury collection"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>
        <rect x="-50" y="-50" width="1100" height="600" fill={`url(#${gradientId})`} />
        {renderParticles(900)}
        {sceneKeys.map((key, i) =>
          renderFigure(
            key,
            hashString(colorPalette + i),
            true,
            ss[i],
            xs[i] - 150 * ss[i],
            400 - 400 * ss[i]
          )
        )}
      </svg>
    );
  }

  // Single Figure or Hero View
  const actualKey = artKey || 'coord';
  const vb = actualKey === 'jewel' ? '72 26 156 208' : '0 0 300 400';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={vb}
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full block ${className}`}
      role="img"
      aria-label={`Model wearing ${actualKey}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x="-50" y="-50" width="1100" height="600" fill={`url(#${gradientId})`} />
      {renderParticles(300)}
      {actualKey !== 'hero' &&
        renderFigure(actualKey, hashString(colorPalette + actualKey), true)}
    </svg>
  );
};
