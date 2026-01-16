import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const colors = ["#FF3FA4", "#FFC533", "#FF7A00", "#2AA1FF", "#16C3A3", "#7A3FFF"];

const ConfettiPiece = ({ x, y, rotation, color }) => (
    <motion.div
        style={{
            position: 'absolute',
            left: `${x}vw`,
            top: `${y}vh`,
            width: '10px',
            height: '10px',
            backgroundColor: color,
            rotate: rotation,
        }}
        animate={{
            y: '100vh',
            opacity: 0,
            rotate: rotation + 360,
        }}
        transition={{
            duration: Math.random() * 2 + 2,
            ease: 'linear',
        }}
    />
);

export function Confetti() {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * -20,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
            {pieces.map(p => <ConfettiPiece key={p.id} {...p} />)}
        </div>
    );
}