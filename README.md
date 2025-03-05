# Emoji Infinite Audio Game

## Description

This is a simple game where you can select multiple emojis and generate a sound from that.

## Tasks

### Completed
- [x] UI layer for selecting emojis to send to the tRPC API route

### In Progress
- [X] Database Schema Design
  - [X] Define types for emoji requests table
  - [X] Define types for text conversions table
  - [X] Define types for audio generations table

### Todo
- [X] Audio Generation Pipeline
  - [X] Connect tRPC API route to Fal.ai
  - [X] Implement audio generation from emoji input
  - [X] Add error handling and retries
- [X] Audio Visualization
  - [X] Add waveform visualization
  - [X] Add playback controls
- [X] Storage Implementation
  - [X] Set up Supabase storage
  - [X] Implement audio file upload/retrieval
  - [X] Add caching layer

## Flow

```mermaid
    sequenceDiagram
        actor User
        participant DB1 as emojiRequests
        participant GPT as ChatGPT
        participant DB2 as generatedPrompts
        participant FAL as Fal.ai
        participant DB3 as audioGenerations

        User->>DB1: Submit emoji string
        Note over DB1: Stores: <br/>- id<br/>- emojiString<br/>- createdAt

        DB1->>GPT: Send emoji string
        GPT->>DB2: Return generated prompt
        Note over DB2: Stores: <br/>- id<br/>- emojiRequestId<br/>- prompt<br/>- negativePrompt<br/>- createdAt

        DB2->>FAL: Send prompt & parameters
        FAL->>DB3: Return audio file
        Note over DB3: Stores: <br/>- id<br/>- promptId<br/>- generation params<br/>- file details<br/>- createdAt

        DB3-->>User: Return audio URL
```

