import { useEffect, useRef } from 'react'
import './BambooBackground.css'

/* 
  Draws animated bamboo trees using pure CSS + HTML.
  No libraries needed! Each "stalk" is a div with CSS animation.
  The leaves sway using a CSS keyframe called 'sway'.
*/

// How many bamboo stalks to render
const STALK_COUNT = 14

// Generate stalks with deterministic but varied properties
function generateStalks() {
    return Array.from({ length: STALK_COUNT }, (_, i) => ({
        id: i,
        left: `${5 + (i * 7) + (i % 3) * 2}%`,
        height: 180 + (i % 5) * 60,           // 180–420px tall
        width: 10 + (i % 3) * 4,              // 10–18px wide
        delay: (i * 0.4) % 3,                 // stagger swaying
        duration: 3 + (i % 4) * 0.8,         // 3–5.4s sway cycle
        segments: 3 + (i % 3),               // 3–5 bamboo segments
        leafCount: 2 + (i % 3),              // 2–4 leaves
        opacity: 0.55 + (i % 4) * 0.1,       // 0.55–0.85 opacity
    }))
}

export function BambooBackground({ visible }) {
    const stalks = generateStalks()

    if (!visible) return null

    return (
        <div className="bamboo-bg" aria-hidden="true">
            {stalks.map(stalk => (
                <div
                    key={stalk.id}
                    className="bamboo-stalk"
                    style={{
                        left: stalk.left,
                        height: `${stalk.height}px`,
                        width: `${stalk.width}px`,
                        opacity: stalk.opacity,
                        animationDuration: `${stalk.duration}s`,
                        animationDelay: `${stalk.delay}s`,
                    }}
                >
                    {/* Bamboo segments (the joints) */}
                    {Array.from({ length: stalk.segments }, (_, si) => (
                        <div
                            key={si}
                            className="bamboo-segment"
                            style={{ height: `${100 / stalk.segments}%` }}
                        />
                    ))}
                    {/* Leaves */}
                    {Array.from({ length: stalk.leafCount }, (_, li) => (
                        <div
                            key={li}
                            className={`bamboo-leaf leaf-${li % 2 === 0 ? 'left' : 'right'}`}
                            style={{
                                top: `${20 + li * (60 / stalk.leafCount)}%`,
                                animationDelay: `${stalk.delay + li * 0.3}s`,
                                animationDuration: `${stalk.duration + 0.5}s`,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
