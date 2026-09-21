export type CosmicSoundId = "earth";

class CosmicAudioEngine {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  async play(id: CosmicSoundId) {
    if (id !== "earth") return;

    if (!this.context) {
      this.context = new AudioContext();
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    this.stop();

    this.oscillator = this.context.createOscillator();
    this.gain = this.context.createGain();

    this.oscillator.type = "sine";

    // Educational procedural representation of Earth's
    // electromagnetic environment — not literal sound
    // traveling through space.
    this.oscillator.frequency.setValueAtTime(
      110,
      this.context.currentTime
    );

    this.gain.gain.setValueAtTime(
      0.0001,
      this.context.currentTime
    );

    this.gain.gain.exponentialRampToValueAtTime(
      0.12,
      this.context.currentTime + 0.08
    );

    this.gain.gain.exponentialRampToValueAtTime(
      0.0001,
      this.context.currentTime + 2.5
    );

    this.oscillator.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.oscillator.start();

    this.oscillator.stop(
      this.context.currentTime + 2.6
    );

    this.oscillator.onended = () => {
      this.oscillator = null;
    };
  }

  stop() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch {
        // Already stopped.
      }

      this.oscillator.disconnect();
      this.oscillator = null;
    }

    if (this.gain) {
      this.gain.disconnect();
      this.gain = null;
    }
  }
}

export const cosmicAudio = new CosmicAudioEngine();