import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Score {
    scoreValue: bigint;
    timestamp: Time;
    playerName: string;
}
export type Time = bigint;
export interface backendInterface {
    getHighScores(): Promise<Array<Score>>;
    submitScore(playerName: string, scoreValue: bigint): Promise<void>;
}
