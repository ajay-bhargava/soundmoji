import React, { useRef, useEffect, useState } from 'react';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

interface AudioVisualizerProps {
	audioUrl: string;
	className?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioUrl, className }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const analyzerRef = useRef<AudioMotionAnalyzer | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string>('');

	// Set up audio source when URL changes
	useEffect(() => {
		if (!audioRef.current) return;
		
		audioRef.current.src = audioUrl;
		audioRef.current.crossOrigin = "anonymous";
		setIsInitialized(false); // Reset for new audio
	}, [audioUrl]);

	const togglePlayback = async () => {
		if (!audioRef.current) return;

		try {
			if (!isInitialized) {
				await initializeAnalyzer();
			}

			if (isPlaying) {
				audioRef.current.pause();
			} else {
				await audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(`Playback error: ${errorMessage}`);
			console.error('Playback error:', error);
		}
	};

	// Listen for spacebar
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.code === 'Space' && !event.repeat) {
				event.preventDefault(); // Prevent page scroll
				togglePlayback();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isPlaying, isInitialized]);

	const initializeAnalyzer = async () => {
		if (!containerRef.current || !audioRef.current || isInitialized) return;

		try {
			const audioCtx = new AudioContext();
			const source = audioCtx.createMediaElementSource(audioRef.current);
			
			analyzerRef.current = new AudioMotionAnalyzer(containerRef.current, {
				source: source,
				audioCtx: audioCtx,
				mode: 2,
				radial: true,
				spinSpeed: 1,
				showBgColor: true,
				bgAlpha: 0.0,
				overlay: true,
				showScaleX: false,
				showPeaks: true,
				gradient: 'prism',
				mirror: 1,
				lumiBars: false,
				reflexRatio: 0.1,
				reflexAlpha: 0.25,
				reflexBright: 1.1
			});

			setIsInitialized(true);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(`Failed to initialize analyzer: ${errorMessage}`);
			console.error('Analyzer initialization error:', error);
		}
	};

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (analyzerRef.current) {
				analyzerRef.current.destroy();
			}
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = '';
			}
		};
	}, []);

	return (
		<div className={className}>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<div className="text-center text-sm text-muted-foreground mb-4">
				Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to {isPlaying ? 'pause' : 'play'}
			</div>
			<audio ref={audioRef} />
			<div
				ref={containerRef}
				className="w-full aspect-square"
			/>
		</div>
	);
};

export default AudioVisualizer;