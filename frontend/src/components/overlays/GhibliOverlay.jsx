import './animations.css'

/* ─────────────────────────────────────────────────────────────
   GHIBLI / JOURNEY OVERLAY — Kung Fu Panda / Ghibli style
   - Tall grass blades swaying at the bottom of the screen
   - Fluffy clouds slowly drifting rightward
   - Small birds flying in loose formation across the sky
   ───────────────────────────────────────────────────────────── */

// Grass blades: x position (%), height (%), sway dur, sway delay
const GRASS = [
    { x: 0, h: 9, dur: 2.8, del: 0 },
    { x: 2, h: 12, dur: 3.2, del: 0.3 },
    { x: 4, h: 8, dur: 2.5, del: 0.7 },
    { x: 6, h: 13, dur: 3.5, del: 0.1 },
    { x: 8, h: 10, dur: 2.9, del: 0.5 },
    { x: 10, h: 14, dur: 3.1, del: 0.9 },
    { x: 12, h: 9, dur: 2.6, del: 1.2 },
    { x: 14, h: 11, dur: 3.3, del: 0.4 },
    { x: 16, h: 13, dur: 2.8, del: 0.8 },
    { x: 18, h: 8, dur: 3.0, del: 0.2 },
    { x: 20, h: 12, dur: 2.7, del: 1.0 },
    { x: 22, h: 10, dur: 3.4, del: 0.6 },
    { x: 24, h: 14, dur: 2.9, del: 1.3 },
    { x: 26, h: 9, dur: 3.1, del: 0.3 },
    { x: 28, h: 13, dur: 2.6, del: 0.7 },
    { x: 30, h: 11, dur: 3.2, del: 1.1 },
    // right side continues past the van
    { x: 35, h: 12, dur: 3.0, del: 0.4 },
    { x: 38, h: 9, dur: 2.8, del: 0.9 },
    { x: 41, h: 13, dur: 3.3, del: 0.2 },
    { x: 44, h: 10, dur: 2.7, del: 0.6 },
    { x: 47, h: 14, dur: 3.1, del: 1.0 },
    { x: 50, h: 11, dur: 2.9, del: 0.5 },
    { x: 53, h: 9, dur: 3.4, del: 1.4 },
    { x: 56, h: 13, dur: 2.6, del: 0.3 },
    { x: 59, h: 10, dur: 3.0, del: 0.8 },
    { x: 62, h: 12, dur: 2.8, del: 1.2 },
    { x: 65, h: 14, dur: 3.2, del: 0.1 },
    { x: 68, h: 9, dur: 2.7, del: 0.7 },
    { x: 71, h: 11, dur: 3.5, del: 0.9 },
    { x: 74, h: 13, dur: 2.9, del: 1.3 },
    { x: 77, h: 10, dur: 3.1, del: 0.4 },
    { x: 80, h: 12, dur: 2.6, del: 0.6 },
    { x: 83, h: 9, dur: 3.3, del: 1.0 },
    { x: 86, h: 14, dur: 2.8, del: 0.2 },
    { x: 89, h: 11, dur: 3.0, del: 0.5 },
    { x: 92, h: 13, dur: 2.7, del: 1.1 },
    { x: 95, h: 10, dur: 3.4, del: 0.8 },
    { x: 98, h: 12, dur: 2.9, del: 0.3 },
]

// Clouds: position, size, drift duration/delay
const CLOUDS = [
    { cx: 65, cy: 30, rx: 12, ry: 5.5, dur: 18, del: 0 },
    { cx: 72, cy: 37, rx: 8, ry: 3.5, dur: 22, del: 3 },
    { cx: 60, cy: 35, rx: 6, ry: 2.5, dur: 15, del: 7 },
    { cx: 78, cy: 28, rx: 5, ry: 2, dur: 25, del: 10 },
]

// Birds flying across the top of the sky
const SKY_BIRDS = [
    { startY: 10, dur: 18, del: 0 },
    { startY: 13, dur: 24, del: 5 },
    { startY: 8, dur: 30, del: 11 },
]

function GrassBlade({ x, h, dur, del }) {
    // Each blade is a thin curved path from bottom upward, anchored at base
    const bx = x
    const by = 100
    const tipX = bx + 0.5
    const tipY = by - h
    return (
        <path
            d={`M ${bx} ${by} C ${bx - 0.8} ${by - h * 0.4} ${tipX + 1} ${by - h * 0.7} ${tipX} ${tipY}`}
            stroke="#3d6b2a"
            strokeWidth="0.55"
            fill="none"
            opacity="0.82"
            style={{
                transformOrigin: `${bx}% 100%`,
                animation: `grasssway ${dur}s ease-in-out ${del}s infinite`,
            }}
        />
    )
}

function FlyingBird({ startY, dur, del }) {
    return (
        <g style={{ animation: `birdflight ${dur}s linear ${del}s infinite` }}>
            {/* Left wing */}
            <path
                d={`M 0,${startY} Q -2,${startY - 1.5} -3.5,${startY}`}
                stroke="#1a1a2e"
                strokeWidth="0.45"
                fill="none"
                opacity="0.7"
                style={{ animation: `wingflap 0.8s ease-in-out infinite alternate` }}
            />
            {/* Right wing */}
            <path
                d={`M 0,${startY} Q 2,${startY - 1.5} 3.5,${startY}`}
                stroke="#1a1a2e"
                strokeWidth="0.45"
                fill="none"
                opacity="0.7"
                style={{ animation: `wingflap 0.8s ease-in-out infinite alternate reverse` }}
            />
        </g>
    )
}

export function GhibliOverlay() {
    return (
        <svg
            className="theme-svg-overlay"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient id="cloudg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffd8a8" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#ffd8a8" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Drifting cloud glows behind the big cumulus */}
            {CLOUDS.map((c, i) => (
                <ellipse
                    key={i}
                    cx={c.cx}
                    cy={c.cy}
                    rx={c.rx}
                    ry={c.ry}
                    fill="url(#cloudg)"
                    style={{
                        animation: `clouddrift ${c.dur}s ease-in-out ${c.del}s infinite`,
                    }}
                />
            ))}

            {/* Birds flying across the blue sky above the van */}
            {SKY_BIRDS.map((b, i) => (
                <FlyingBird key={i} startY={b.startY} dur={b.dur} del={b.del} />
            ))}

            {/* Swaying grass at the bottom — the green hill */}
            {GRASS.map((g, i) => (
                <GrassBlade key={i} {...g} />
            ))}
        </svg>
    )
}
