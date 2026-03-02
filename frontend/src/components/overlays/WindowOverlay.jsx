import './animations.css'

/* ─────────────────────────────────────────────────────────────
   WINDOW / ABANDONED ROOM OVERLAY
   - Volumetric light rays through the window (pulsing opacity)
   - Floating dust / pollen motes drifting upward
   - Subtle vine leaf sway at the window edges
   - Soft cloud shift visible through the window
   ───────────────────────────────────────────────────────────── */

const DUST_MOTES = [
    { x: 36, y: 70, r: 0.6, dur: 8, del: 0 },
    { x: 42, y: 55, r: 0.5, dur: 11, del: 2 },
    { x: 48, y: 75, r: 0.7, dur: 9, del: 4 },
    { x: 53, y: 62, r: 0.4, dur: 13, del: 1 },
    { x: 57, y: 80, r: 0.6, dur: 10, del: 6 },
    { x: 62, y: 50, r: 0.5, dur: 12, del: 3 },
    { x: 38, y: 42, r: 0.4, dur: 7, del: 5 },
    { x: 67, y: 68, r: 0.6, dur: 14, del: 0.5 },
    { x: 44, y: 35, r: 0.3, dur: 10, del: 7 },
    { x: 72, y: 58, r: 0.5, dur: 9, del: 2.5 },
    { x: 50, y: 88, r: 0.7, dur: 11, del: 1.5 },
    { x: 58, y: 45, r: 0.4, dur: 8, del: 4.5 },
]

// Light rays: start X, angle (degrees), width, opacity, pulse dur
const RAYS = [
    { x: 30, angle: -4, w: 18, dur: 7, del: 0 },
    { x: 45, angle: -8, w: 12, dur: 9, del: 2 },
    { x: 55, angle: -12, w: 8, dur: 6, del: 4 },
    { x: 62, angle: -16, w: 10, dur: 11, del: 1 },
]

// Vine leaves at window edges — gentle sway
const VINE_LEAVES = [
    // Left edge
    { cx: 27, cy: 15, rx: 2.5, ry: 0.9, rot: -20, dur: 4.5, del: 0 },
    { cx: 25, cy: 22, rx: 2.0, ry: 0.7, rot: -30, dur: 3.8, del: 0.8 },
    { cx: 26, cy: 30, rx: 2.2, ry: 0.8, rot: -15, dur: 5.0, del: 1.5 },
    // Right edge
    { cx: 74, cy: 12, rx: 2.5, ry: 0.9, rot: 20, dur: 4.2, del: 0.4 },
    { cx: 75, cy: 20, rx: 2.0, ry: 0.8, rot: 28, dur: 3.6, del: 1.2 },
    { cx: 73, cy: 28, rx: 2.3, ry: 0.7, rot: 18, dur: 4.8, del: 0.6 },
]

// Cloud glow through the window — upper portion
const WINDOW_CLOUDS = [
    { cx: 42, cy: 22, rx: 14, ry: 6, dur: 20, del: 0 },
    { cx: 60, cy: 18, rx: 10, ry: 4, dur: 25, del: 8 },
]

export function WindowOverlay() {
    return (
        <svg
            className="theme-svg-overlay"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="raygrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#bde8ff" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#bde8ff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="dustg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ddf4ff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ddf4ff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cloudwg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e8f8ff" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#e8f8ff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="vineg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4a8c38" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#2d6020" stopOpacity="0.5" />
                </radialGradient>
            </defs>

            {/* Cloud glow through window */}
            {WINDOW_CLOUDS.map((c, i) => (
                <ellipse
                    key={i}
                    cx={c.cx}
                    cy={c.cy}
                    rx={c.rx}
                    ry={c.ry}
                    fill="url(#cloudwg)"
                    style={{
                        animation: `clouddrift ${c.dur}s ease-in-out ${c.del}s infinite`,
                    }}
                />
            ))}

            {/* Volumetric light rays */}
            {RAYS.map((r, i) => (
                <rect
                    key={i}
                    x={r.x}
                    y="0"
                    width={r.w}
                    height="100"
                    fill="url(#raygrad)"
                    transform={`skewX(${r.angle})`}
                    style={{
                        animation: `raypulse ${r.dur}s ease-in-out ${r.del}s infinite`,
                    }}
                />
            ))}

            {/* Floating dust motes */}
            {DUST_MOTES.map((d, i) => (
                <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill="url(#dustg)"
                    style={{
                        animation: `dustfloat ${d.dur}s ease-in-out ${d.del}s infinite`,
                    }}
                />
            ))}

            {/* Vine leaves at window frame edges */}
            {VINE_LEAVES.map((v, i) => (
                <ellipse
                    key={i}
                    cx={v.cx}
                    cy={v.cy}
                    rx={v.rx}
                    ry={v.ry}
                    fill="url(#vineg)"
                    transform={`rotate(${v.rot} ${v.cx} ${v.cy})`}
                    style={{
                        transformOrigin: `${v.cx}% ${v.cy}%`,
                        animation: `leafsway ${v.dur}s ease-in-out ${v.del}s infinite`,
                    }}
                />
            ))}
        </svg>
    )
}
