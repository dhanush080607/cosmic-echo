import { useState } from "react";
import { cosmicAudio } from "../../audio/CosmicAudio";

export default function EarthListeningPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  if (!visible) return null;

  const handlePlay = async () => {
    if (playing) {
      cosmicAudio.stop();
      setPlaying(false);
      return;
    }

    await cosmicAudio.play("earth");
    setPlaying(true);

    window.setTimeout(() => {
      setPlaying(false);
    }, 2700);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "48px",
        transform: "translateX(-50%)",
        width: "min(520px, calc(100vw - 40px))",
        padding: "22px 24px",
        boxSizing: "border-box",
        background:
          "rgba(3, 7, 18, 0.82)",
        border:
          "1px solid rgba(120, 170, 255, 0.18)",
        backdropFilter: "blur(18px)",
        boxShadow:
          "0 20px 80px rgba(0, 0, 0, 0.45)",
        color: "#ffffff",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.24em",
              color:
                "rgba(255,255,255,0.45)",
            }}
          >
            COSMIC ECHO
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            Earth
          </div>

          <div
            style={{
              marginTop: "5px",
              fontSize: "10px",
              letterSpacing: "0.12em",
              color:
                "rgba(255,255,255,0.42)",
            }}
          >
            ELECTROMAGNETIC ENVIRONMENT
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color:
              "rgba(255,255,255,0.5)",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          height: "1px",
          background:
            "rgba(255,255,255,0.08)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handlePlay}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border:
              "1px solid rgba(120,170,255,0.5)",
            background:
              playing
                ? "rgba(70,130,255,0.25)"
                : "rgba(255,255,255,0.04)",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "17px",
          }}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>

        <div style={{ flex: 1 }}>
          <div
            style={{
              height: "2px",
              background:
                "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: playing ? "100%" : "0%",
                height: "100%",
                background: "#6aa8ff",
                transition:
                  "width 2.6s linear",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginTop: "8px",
              fontSize: "9px",
              letterSpacing: "0.1em",
              color:
                "rgba(255,255,255,0.35)",
            }}
          >
            <span>
              {playing ? "PLAYING" : "READY"}
            </span>

            <span>02.6</span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "18px",
          fontSize: "10px",
          lineHeight: 1.7,
          color:
            "rgba(255,255,255,0.45)",
        }}
      >
        What you're hearing is a procedural
        sonification representing Earth's
        electromagnetic environment. It is not
        ordinary sound traveling through the
        vacuum of space.
      </div>
    </div>
  );
}