import { useRef, useEffect, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";

interface AudioVisualizerProps {
	audioUrl: string;
	emoji: string;
	className?: string;
	autoPlay?: boolean;
	isLooping?: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
	audioUrl,
	emoji,
	className,
	autoPlay = false,
	isLooping = false,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const wavesurferRef = useRef<WaveSurfer | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string>("");
	const previousUrlRef = useRef<string>("");

	// Initialize WaveSurfer
	useEffect(() => {
		if (!containerRef.current) return;

		// Clean up previous instance
		if (wavesurferRef.current) {
			wavesurferRef.current.destroy();
		}

		try {
			// Create WaveSurfer instance
			const wavesurfer = WaveSurfer.create({
				container: containerRef.current,
				waveColor: "rgb(200, 200, 200)",
				progressColor: "rgb(100, 100, 100)",
				cursorColor: "transparent",
				barWidth: 2,
				barGap: 1,
				barRadius: 3,
				height: 100,
				url: audioUrl,
			});

			wavesurferRef.current = wavesurfer;

			// Event listeners
			wavesurfer.on("ready", () => {
				if (autoPlay) {
					wavesurfer.play();
					setIsPlaying(true);
				}
			});

			wavesurfer.on("play", () => setIsPlaying(true));
			wavesurfer.on("pause", () => setIsPlaying(false));
			wavesurfer.on("finish", () => setIsPlaying(false));

			wavesurfer.on("error", (err) => {
				setError(`Error loading audio: ${err}`);
				console.error("WaveSurfer error:", err);
			});

			previousUrlRef.current = audioUrl;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			setError(`Failed to initialize waveform: ${errorMessage}`);
			console.error("Waveform initialization error:", error);
		}

		// Cleanup function
		return () => {
			if (wavesurferRef.current) {
				wavesurferRef.current.destroy();
			}
		};
	}, [audioUrl, autoPlay]);

	// Toggle play/pause
	const togglePlayback = useCallback(() => {
		if (!wavesurferRef.current) return;

		if (isPlaying) {
			wavesurferRef.current.pause();
		} else {
			wavesurferRef.current.play();
		}
	}, [isPlaying]);

	// Listen for spacebar
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.code === "Space" && !event.repeat) {
				event.preventDefault(); // Prevent page scroll
				togglePlayback();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [togglePlayback]);

	return (
		<div className={className}>
			{error && <div className="text-red-500 mb-4">{error}</div>}

			<div className="flex flex-col items-center gap-2 mb-4">
				<div className="text-3xl">{emoji}</div>
				<div className="text-center text-sm text-muted-foreground mt-2">
					Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to{" "}
					{isPlaying ? "pause" : "play"}
					{isPlaying && isLooping && <span> (looping enabled)</span>}
				</div>
			</div>

			<div ref={containerRef} className="w-full" />
		</div>
	);
};

export default AudioVisualizer;
