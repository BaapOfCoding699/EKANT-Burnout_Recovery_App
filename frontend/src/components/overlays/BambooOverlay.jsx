import './animations.css'

/* ─────────────────────────────────────────────────────────────
   BAMBOO OVERLAY — Kung Fu Panda style
   SVG bamboo stalks swaying gently in front of the image,
   with organic fallen leaves spiraling down.
   ───────────────────────────────────────────────────────────── */

// Each stalk: x pos, height%, sway duration, sway delay, thickness
const STALKS = [
    { x: 3, h: 72, dur: 5.5, del: 0, w: 14, seg: 5 },
    { x: 10, h: 88, dur: 6.2, del: 0.8, w: 10, seg: 6 },
    { x: 18, h: 65, dur: 5.0, del: 1.6, w: 8, seg: 4 },
    { x: 76, h: 80, dur: 6.8, del: 0.3, w: 12, seg: 5 },
    { x: 85, h: 95, dur: 5.3, del: 1.1, w: 9, seg: 6 },
    { x: 93, h: 70, dur: 7.0, del: 2.0, w: 11, seg: 5 },
]

const LEAVES = [
    { sx: '15%', dur: 9, del: 0 },
    { sx: '30%', dur: 12, del: 2.5 },
    { sx: '60%', dur: 10, del: 5 },
    { sx: '75%', dur: 14, del: 1 },
    { sx: '88%', dur: 11, del: 7 },
    { sx: '45%', dur: 13, del: 3.5 },
]

export function BambooOverlay() {
    return (
        <svg
            className="theme-svg-overlay"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="stalkgrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4a7c35" stopOpacity="0.8" />
                    <stop offset="40%" stopColor="#6aaa48" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#3d6a2a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#2d5020" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="leafgrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dc855" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#3d7a28" stopOpacity="0.7" />
                </linearGradient>
            </defs>

            {/* Bamboo stalks — rooted at bottom, sway from base */}
            {STALKS.map((s, i) => (
                <g key={i} style={{
                    transformOrigin: `${s.x}% 100%`,
                    animation: `bamboosway ${s.dur}s ease-in-out ${s.del}s infinite`,
                }}>
                    {/* Main stalk */}
                    <rect
                        x={s.x - s.w / 2 / 10}
                        y={100 - s.h}
                        width={s.w / 10}
                        height={s.h}
                        fill="url(#stalkgrad)"
                        rx="0.4"
                    />
                    {/* Joints / nodes */}
                    {Array.from({ length: s.seg }, (_, j) => (
                        <rect
                            key={j}
                            x={s.x - s.w / 2 / 10 - 0.1}
                            y={100 - s.h + (j + 1) * (s.h / (s.seg + 1))}
                            width={s.w / 10 + 0.2}
                            height="0.5"
                            fill="#2a5018"
                            opacity="0.9"
                        />
                    ))}
                    {/* Side leaves at each node */}
                    {Array.from({ length: Math.floor(s.seg / 2) }, (_, j) => {
                        const leafY = 100 - s.h + (j * 2 + 1) * (s.h / (s.seg + 1))
                        const side = j % 2 === 0 ? 1 : -1
                        return (
                            <g key={j} style={{
                                transformOrigin: `${s.x}% ${leafY}%`,
                                animation: `leafsway ${s.dur * 0.9}s ease-in-out ${s.del + j * 0.4}s infinite`,
                            }}>
                                <ellipse
                                    cx={s.x + side * 2.5}
                                    cy={leafY - 0.5}
                                    rx="3"
                                    ry="0.8"
                                    fill="url(#leafgrad)"
                                    transform={`rotate(${side * -30} ${s.x} ${leafY})`}
                                />
                            </g>
                        )
                    })}
                </g>
            ))}

            {/* Falling leaves — spiraling down */}
            {LEAVES.map((l, i) => (
                <g key={i} style={{
                    animation: `leaffall ${l.dur}s ease-in-out ${l.del}s infinite`,
                }}>
                    <ellipse
                        cx={0}
                        cy={0}
                        rx="1.2"
                        ry="0.4"
                        fill="url(#leafgrad)"
                        transform={`translate(${parseFloat(l.sx)} 0)`}
                    />
                </g>
            ))}
        </svg>
    )
}
