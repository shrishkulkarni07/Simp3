import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { islandPositions } from './TimelinePath';
import { timelineEvents } from '../../data/timelineEvents';
import { Island } from './Island';
import { FinalIsland } from './FinalIsland';
import { DockingMarker } from './DockingMarker';
import { Water } from './Water';
import { Ship } from './Ship';

export function TimelineScene() {
  const [activeIsland, setActiveIsland] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(to bottom, rgb(91,184,212), rgb(200,234,248))',
        pointerEvents: 'none'
      }} />

      <Canvas
        camera={{ fov: isMobile ? 75 : 55, near: 1, far: 3000 }}
        gl={{ powerPreference: 'high-performance', antialias: true, stencil: false, depth: true, alpha: true }}
        style={{ background: 'transparent' }}
        onCreated={({ gl, scene }) => {
          scene.fog = new THREE.Fog(0x1a2a3a, 400, 1200);
        }}
      >
        <ambientLight intensity={3} />
        <directionalLight position={[100, 100, 100]} intensity={8} />
        <directionalLight position={[-100, 80, -50]} intensity={5} />
        <directionalLight position={[0, 60, 100]} intensity={5} />

        <Suspense fallback={null}>
          <Water />
          
          <DockingMarker activeIsland={activeIsland} />

          {islandPositions.map((pos, i) => {
            const event = timelineEvents[i];
            const isLast = i === islandPositions.length - 1;
            const key = `island-${pos[0]}-${pos[2]}`;

            if (isLast) {
              return <FinalIsland key={key} position={pos} event={event} />;
            }
            return <Island key={key} position={pos} event={event} />;
          })}

          <Ship 
            isMobile={isMobile}
            onDock={(index) => {
              setActiveIsland(index);
              if (index !== null) {
                setSelectedEvent(timelineEvents[index]);
              } else {
                setSelectedEvent(null);
              }
            }}
          />
        </Suspense>
      </Canvas>
      
      {selectedEvent && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          fontFamily: 'sans-serif'
        }}>
          <h2>{selectedEvent.title}</h2>
          <p>Day {selectedEvent.day} • {selectedEvent.time}</p>
        </div>
      )}
    </div>
  );
}
