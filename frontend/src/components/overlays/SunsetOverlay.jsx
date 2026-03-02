import './animations.css'

/* ─────────────────────────────────────────────────────────────
   SUNSET LAKE OVERLAY
   - Gentle water shimmer gradient over the lake
   - Moving shimmer highlight sweeping across
   - Animated bird silhouettes flying in formation
   ───────────────────────────────────────────────────────────── */

// Bird flocks — each bird in a formation
const BIRD_FLOCKS = [
    {
        id: 'f1', dur: 24, del: 0, y: 18,
        birds: [
            { dx: 0, dy: 0 },
            { dx: 4, dy: -2 },
            { dx: 8, dy: -4 },
            { dx: 12, dy: -2 },
            { dx: 16, dy: 1 },
            { dx: -4, dy: -1 },
            { dx: -8, dy: 1 },
        ]
    },
    {
        id: 'f2', dur: 32, del: 8, y: 22,
        birds: [
            { dx: 0, dy: 0 },
            { dx: 5, dy: -2 },
            { dx: 10, dy: -3 },
            { dx: -4, dy: -1 },
        ]
    },
    {
        id: 'f3', dur: 40, del: 18, y: 15,
        birds: [
            { dx: 0, dy: 0 },
            { dx: 6, dy: -3 },
            { dx: 12, dy: -5 },
            { dx: 18, dy: -3 },
        ]
    },
]

// Draw a single bird: two arc-shaped wings
function Bird({ x, y, scale = 1 }) {
    const w = 3.5 * scale
    return (
        <g>
            {/* Left wing */}
            <path
                d={`M ${x},${y} Q ${x - w * 0.6},${y - w * 0.5} ${x - w},${y}`}
                stroke="#2a1a0a"
                strokeWidth="0.5"
                fill="none"
                opacity="0.75"
                style={{ animation: `wingflap 0.9s ease-in-out infinite alternate` }}
            />
            {/* Right wing */}
            <path
                d={`M ${x},${y} Q ${x + w * 0.6},${y - w * 0.5} ${x + w},${y}`}
                stroke="#2a1a0a"
                strokeWidth="0.5"
                fill="none"
                opacity="0.75"
                style={{ animation: `wingflap 0.9s ease-in-out infinite alternate reverse` }}
            />
        </g>
    )
}

export function SunsetOverlay() {
    return (
        <svg
            className="theme-svg-overlay"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Water gradient — covers lower ~40% of image */}
                <linearGradient id="waterg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f4a06a" stopOpacity="0" />
                    <stop offset="40%" stopColor="#d4708a" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#9b5eab" stopOpacity="0.1" />
                </linearGradient>
                {/* Shimmer highlight */}
                <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Water ripple area */}
            <rect
                x="0" y="55" width="100" height="45"
                fill="url(#waterg)"
                style={{ animation: `waterripple 5s ease-in-out infinite` }}
            />

            {/* Horizontal shimmer lines sweeping across */}
            {[60, 66, 72, 78].map((y, i) => (
                <rect
                    key={i}
                    x="-100" y={y + i * 0.5}
                    width="80" height="0.6"
                    fill="url(#shimmer)"
                    opacity="0.5"
                    style={{
                        animation: `shimmerwave ${6 + i * 1.5}s linear ${i * 1.2}s infinite`,
                    }}
                />
            ))}

            {/* Bird flocks flying from left to right */}
            {BIRD_FLOCKS.map(flock => (
                <g
                    key={flock.id}
                    style={{
                        animation: `birdflight ${flock.dur}s linear ${flock.del}s infinite`,
                    }}
                >
                    {flock.birds.map((b, bi) => (
                        <Bird
                            key={bi}
                            x={-5 + b.dx * 0.3}
                            y={flock.y + b.dy * 0.3}
                            scale={0.85}
                        />
                    ))}
                </g>
            ))}
        </svg>
    )
}
