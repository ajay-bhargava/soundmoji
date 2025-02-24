import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq, isNotNull, asc } from "drizzle-orm";
import { emojiRequests, textConversions, audioGeneration } from "~/server/db/schema";

export const schemaRouter = createTRPCRouter({
  getSounds: publicProcedure
    .query(async ({ ctx }) => {
      const sounds = await ctx.db
        .select({
          emoji: emojiRequests.emojiString,
          audioUrl: audioGeneration.audioFileUrl,
        })
        .from(emojiRequests)
        .leftJoin(
          textConversions,
          eq(textConversions.emojiRequestId, emojiRequests.id)
        )
        .leftJoin(
          audioGeneration,
          eq(audioGeneration.textConversionId, textConversions.id)
        )
        .where(
          isNotNull(audioGeneration.audioFileUrl)
        );

      return sounds;
    }),
    
  getLatestSound: publicProcedure
    .query(async ({ ctx }) => {
      const latestSound = await ctx.db
        .select({
          emoji: emojiRequests.emojiString,
          audioUrl: audioGeneration.audioFileUrl,
          createdAt: audioGeneration.createdAt,
        })
        .from(emojiRequests)
        .leftJoin(
          textConversions,
          eq(textConversions.emojiRequestId, emojiRequests.id)
        )
        .leftJoin(
          audioGeneration,
          eq(audioGeneration.textConversionId, textConversions.id)
        )
        .where(
          isNotNull(audioGeneration.audioFileUrl)
        )
        .orderBy(audioGeneration.createdAt, asc(audioGeneration.createdAt))
        .limit(1);

      return latestSound[0];
    }),
});

// 