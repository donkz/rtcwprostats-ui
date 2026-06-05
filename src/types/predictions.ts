export interface IPredictionMatch {
  gsi1sk: string;                          // match identifier, e.g. "na#6#2023-09-29 03:59:22"
  maps: string[];                          // e.g. ["te_frostbite", "te_adlernest_b1"]
  players: {
    TeamA: string[];                       // player aliases
    TeamB: string[];
  };
}

export interface IPredictionRequest {
  session_id: string;
  groupgsi1sk: string;
  prediction: string;                      // stringified integer, e.g. "-2"
}

export interface IPredictionResult {
  session_total_dist: number;              // sum of all prediction distances in session
  session_guesses: number;                 // total predictions submitted this session
  session_error_dist: number;              // sum of error distances (lower = more accurate)
  current_correct: number;                 // 1 if current prediction was correct, 0 otherwise
  session_correct: number;                 // total correct predictions in session
  scorea: number;  
  scoreb: number;  
  accuracy_percent: number;
}
