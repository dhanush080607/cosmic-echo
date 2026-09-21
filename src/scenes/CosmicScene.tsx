import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function Earth({
  onHoverChange,
  onSelect,
}: {
  onHoverChange: (hovered: boolean) => void;
  onSelect: () => void;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.12;

      const targetScale = hovered ? 1.06 : 1;

      earthRef.current.scale.lerp(
        new THREE.Vector3(
          targetScale,
          targetScale,
          targetScale
        ),
        0.08
      );
    }

    if (atmosphereRef.current) {
      const targetScale = hovered ? 1.075 : 1.055;

      atmosphereRef.current.scale.lerp(
        new THREE.Vector3(
          targetScale,
          targetScale,
          targetScale
        ),
        0.08
      );
    }
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;

      gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;

    float hash(vec3 p) {
      p = fract(
        p * 0.3183099 +
        vec3(0.1, 0.2, 0.3)
      );

      p *= 17.0;

      return fract(
        p.x * p.y * p.z *
        (p.x + p.y + p.z)
      );
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);

      f = f * f * (3.0 - 2.0 * f);

      float a = hash(i);
      float b = hash(i + vec3(1.0, 0.0, 0.0));
      float c = hash(i + vec3(0.0, 1.0, 0.0));
      float d = hash(i + vec3(1.0, 1.0, 0.0));

      float e = hash(i + vec3(0.0, 0.0, 1.0));
      float f1 = hash(i + vec3(1.0, 0.0, 1.0));
      float g = hash(i + vec3(0.0, 1.0, 1.0));
      float h = hash(i + vec3(1.0, 1.0, 1.0));

      return mix(
        mix(
          mix(a, b, f.x),
          mix(c, d, f.x),
          f.y
        ),
        mix(
          mix(e, f1, f.x),
          mix(g, h, f.x),
          f.y
        ),
        f.z
      );
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;

      for (int i = 0; i < 5; i++) {
        value += noise(p) * amplitude;
        p *= 2.0;
        amplitude *= 0.5;
      }

      return value;
    }

    void main() {
      vec3 normal = normalize(vNormal);

      vec3 sun =
        normalize(vec3(5.0, 3.0, 5.0));

      float sunlight =
        max(dot(normal, sun), 0.0);

      float terrain =
        fbm(vPosition * 1.6);

      float detail =
        fbm(vPosition * 4.5);

      terrain =
        terrain * 0.75 +
        detail * 0.25;

      vec3 ocean =
        vec3(0.005, 0.045, 0.16);

      vec3 shallowOcean =
        vec3(0.015, 0.13, 0.30);

      vec3 land =
        vec3(0.07, 0.24, 0.08);

      vec3 highLand =
        vec3(0.34, 0.28, 0.12);

      vec3 color;

      if (terrain < 0.46) {
        color = ocean;
      } else if (terrain < 0.53) {
        color = shallowOcean;
      } else if (terrain < 0.70) {
        color = land;
      } else {
        color = highLand;
      }

      float clouds =
        fbm(vPosition * 3.8);

      clouds =
        smoothstep(0.62, 0.72, clouds);

      color =
        mix(
          color,
          vec3(0.95),
          clouds * 0.25
        );

      float night =
        1.0 - sunlight;

      float cityNoise =
        smoothstep(
          0.72,
          0.90,
          fbm(vPosition * 10.0)
        );

      color +=
        vec3(1.0, 0.45, 0.08) *
        cityNoise *
        night *
        0.18;

      color *=
        0.20 +
        sunlight * 1.15;

      float rim =
        pow(
          1.0 -
          max(
            dot(
              normal,
              vec3(0.0, 0.0, 1.0)
            ),
            0.0
          ),
          3.0
        );

      color +=
        vec3(0.03, 0.15, 0.35) *
        rim;

      gl_FragColor =
        vec4(color, 1.0);
    }
  `;

  return (
    <group>
      <mesh
        ref={earthRef}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
          onHoverChange(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          setHovered(false);
          onHoverChange(false);
          document.body.style.cursor = "default";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[2, 128, 128]} />

        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <mesh
        ref={atmosphereRef}
        scale={1.055}
      >
        <sphereGeometry args={[2, 128, 128]} />

        <shaderMaterial
          transparent
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vNormal;

            void main() {
              vNormal =
                normalize(
                  normalMatrix * normal
                );

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;

            void main() {
              float intensity =
                pow(
                  0.65 -
                  dot(
                    vNormal,
                    vec3(0.0, 0.0, 1.0)
                  ),
                  2.5
                );

              gl_FragColor =
                vec4(
                  vec3(0.05, 0.35, 1.0),
                  intensity * 0.45
                );
            }
          `}
        />
      </mesh>
    </group>
  );
}

function CameraController({
  selected,
}: {
  selected: boolean;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const targetPosition = selected
      ? new THREE.Vector3(0, 0, 4.5)
      : new THREE.Vector3(0, 0, 8);

    camera.position.lerp(
      targetPosition,
      1 - Math.exp(-delta * 2.5)
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CosmicWorld({
  onEarthHover,
  onEarthSelect,
  selected,
}: {
  onEarthHover: (hovered: boolean) => void;
  onEarthSelect: () => void;
  selected: boolean;
}) {
  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />

      <ambientLight intensity={0.15} />

      <directionalLight
        position={[5, 3, 5]}
        intensity={3}
      />

      <Earth
        onHoverChange={onEarthHover}
        onSelect={onEarthSelect}
      />

      <CameraController selected={selected} />
    </>
  );
}

export default function CosmicScene({
  onEarthSelect,
}: {
  onEarthSelect: () => void;
}) {
  const [earthHovered, setEarthHovered] =
    useState(false);

  const [earthSelected, setEarthSelected] =
    useState(false);

  const handleEarthSelect = () => {
    setEarthSelected(true);
    onEarthSelect();
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#02030a",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 50,
        }}
        dpr={[1, 2]}
      >
        <CosmicWorld
          onEarthHover={setEarthHovered}
          onEarthSelect={handleEarthSelect}
          selected={earthSelected}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enabled={!earthSelected}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(135px, -120px)",
          opacity: earthHovered ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 300ms ease",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "11px",
            letterSpacing: "0.22em",
            fontFamily:
              "Inter, system-ui, sans-serif",
          }}
        >
          EARTH
        </div>

        <div
          style={{
            marginTop: "6px",
            color:
              "rgba(255,255,255,0.55)",
            fontSize: "8px",
            letterSpacing: "0.16em",
          }}
        >
          PLANET · CLICK TO LISTEN
        </div>
      </div>
    </div>
  );
}