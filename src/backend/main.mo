import Array "mo:core/Array";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  type Score = {
    playerName : Text;
    scoreValue : Nat;
    timestamp : Time.Time;
  };

  module Score {
    public func compare(score1 : Score, score2 : Score) : Order.Order {
      Nat.compare(score2.scoreValue, score1.scoreValue);
    };
  };

  let scores = Map.empty<Text, Score>();

  let maxHighScores = 10;

  public shared ({ caller }) func submitScore(playerName : Text, scoreValue : Nat) : async () {
    let newScore : Score = {
      playerName;
      scoreValue;
      timestamp = Time.now();
    };

    let allScores = scores.values().toArray();
    let sortedScores = allScores.sort();

    let topScores = sortedScores.sliceToArray(0, if (sortedScores.size() < maxHighScores) {
      sortedScores.size();
    } else { maxHighScores });

    let isHighScore = if (topScores.size() > 0) {
      scoreValue > topScores[topScores.size() - 1].scoreValue;
    } else { false };

    if (topScores.size() < maxHighScores or isHighScore) {
      scores.add(playerName, newScore);
    };
  };

  public query ({ caller }) func getHighScores() : async [Score] {
    let allScores = scores.values().toArray();
    let sortedScores = allScores.sort();
    sortedScores.sliceToArray(0, if (sortedScores.size() < maxHighScores) { sortedScores.size() } else { maxHighScores });
  };
};
