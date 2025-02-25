"use client";

import { Card } from "~/components/ui/card";
import { SoundDrawer } from "~/app/_components/sound-drawer";
import { EmojiSelector } from "~/app/_components/emoji-selector-keyboard";
import SoundVisualizer from "~/app/_components/sound-visualizer";
import { EmojiInput } from "./emoji-input";
import { useEmojiSounds } from "./hooks/use-emoji-sounds";
import { useState, useEffect, useRef } from "react";
import type { Sound } from "~/app/_types/types";
import { Progress } from "~/components/ui/progress";

export function EmojiAudioGame() {
	const [currentSound, setCurrentSound] = useState<Sound | null>(null);
	const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
	const previousSoundsCountRef = useRef<number>(0);
	const {
		selectedEmojis,
		discoveredSounds,
		handleEmojiClick,
		handleBackspace,
		handleClearAll,
		handlePlaySound,
		handleGPTSubmit,
		progress,
	} = useEmojiSounds();

	// Update current audio URL when new sounds are discovered
	useEffect(() => {
		if (discoveredSounds.length > 0) {
			// Check if we have a new sound (more sounds than before)
			const hasNewSound =
				discoveredSounds.length > previousSoundsCountRef.current;
			previousSoundsCountRef.current = discoveredSounds.length;

			// Get the latest sound
			const latestSound = discoveredSounds[discoveredSounds.length - 1];

			if (latestSound?.audioUrl) {
				// Always update the current sound to the latest one
				setCurrentSound(latestSound);

				// If this is a new sound (not just a refetch of existing data),
				// set autoPlay to true to trigger auto-play in the visualizer
				if (hasNewSound && progress === 100) {
					setShouldAutoPlay(true);
				}
			}
		}
	}, [discoveredSounds, progress]);

	return (
		<Card className="mx-auto max-w-2xl space-y-6 p-6">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<EmojiInput
						value={selectedEmojis.join(" ")}
						onBackspace={handleBackspace}
						onClearAll={handleClearAll}
						onSubmit={handleGPTSubmit}
					/>
					<SoundDrawer
						sounds={discoveredSounds}
						onPlaySound={handlePlaySound}
					/>
				</div>
				{progress > 0 && <Progress value={progress} className="h-1" />}
			</div>

			{currentSound?.audioUrl && (
				<SoundVisualizer
					audioUrl={currentSound.audioUrl}
					emoji={currentSound.emoji}
					autoPlay={shouldAutoPlay}
				/>
			)}

			<EmojiSelector onEmojiSelect={handleEmojiClick} />
		</Card>
	);
}
