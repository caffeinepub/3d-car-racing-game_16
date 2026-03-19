import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Score } from "../backend.d";
import { useActor } from "./useActor";

export function useHighScores() {
  const { actor, isFetching } = useActor();
  return useQuery<Score[]>({
    queryKey: ["highScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHighScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerName,
      scoreValue,
    }: {
      playerName: string;
      scoreValue: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitScore(playerName, scoreValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highScores"] });
    },
  });
}
