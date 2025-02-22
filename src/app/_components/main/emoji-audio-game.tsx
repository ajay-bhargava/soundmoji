"use client";

import { Card } from "~/components/ui/card";
import { SoundDrawer } from "~/app/_components/sound-drawer";
import { EmojiSelector } from "~/app/_components/emoji-selector-keyboard";
import SoundVisualizer from "~/app/_components/sound-visualizer";
import { EmojiInput } from "./emoji-input";
import { useEmojiSounds } from "./hooks/use-emoji-sounds";
import { useState, useEffect } from "react";
import type { Sound } from "~/app/_types/types";
import { Progress } from "~/components/ui/progress";

export function EmojiAudioGame() {
	const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
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
			const latestSound = discoveredSounds[discoveredSounds.length - 1];
			if (latestSound?.audioUrl) {
				setCurrentAudioUrl(latestSound.audioUrl);
			}
		}
	}, [discoveredSounds]);

	// Handle playing a specific sound from the drawer
	const handlePlay = (sound: Sound) => {
		if (sound.audioUrl) {
			setCurrentAudioUrl(sound.audioUrl);
		}
	};

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
					<SoundDrawer sounds={discoveredSounds} onPlaySound={handlePlay} />
				</div>
				{progress > 0 && <Progress value={progress} className="h-1" />}
			</div>

			{currentAudioUrl && <SoundVisualizer audioUrl={currentAudioUrl} />}

			<EmojiSelector onEmojiSelect={handleEmojiClick} />
		</Card>
	);
}
