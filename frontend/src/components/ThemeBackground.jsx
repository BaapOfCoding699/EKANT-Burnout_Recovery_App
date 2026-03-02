import bambooBg from '../assets/themes/bamboo.jpg'
import sunsetBg from '../assets/themes/sunset.jpg'
import ghibliBg from '../assets/themes/ghibli.png'
import roomBg from '../assets/themes/room.jpg'
import './ThemeBackground.css'

export const BACKGROUNDS = [
    { id: 'bamboo', label: '🎋 Bamboo', img: bambooBg, video: '/backgrounds/bamboo.mp4' },
    { id: 'sunset', label: '🌅 Sunset Lake', img: sunsetBg, video: '/backgrounds/sunset.mp4' },
    { id: 'ghibli', label: '🚐 Journey', img: ghibliBg, video: '/backgrounds/room.mp4' },
    { id: 'room', label: '🪟 Window', img: roomBg, video: '/backgrounds/ghibli.mp4' },
]

export function ThemeBackground({ visible, selectedId }) {
    const bg = BACKGROUNDS.find(b => b.id === selectedId) || BACKGROUNDS[0]

    return (
        <div className="theme-bg-wrap" aria-hidden="true">
            {/* Static crisp image — always present as fallback/base */}
            <div
                className="theme-bg-img"
                style={{ backgroundImage: `url(${bg.img})` }}
            />
            {/* High-quality video overlay — only when live bg is ON */}
            {visible && bg.video && (
                <video
                    className="theme-bg-video fadeIn"
                    src={bg.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    // Reset key when video changes so it mounts fresh and plays
                    key={bg.video}
                />
            )}
            {/* Warm tint for readability */}
            <div className="theme-bg-overlay" />
        </div>
    )
}
