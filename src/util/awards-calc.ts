import { IStatsResponse, IPlayerStatsDictionary, IPlayerStats } from "../api/types";


/* How to extend this
1. Create a function like calc_something_values(players)
       return shoud be a dictionary of {alias:value, alias2:value2}
2. Plug the returned dictionary into the metrics
       metrics["Something"] =  calc_terminator_values(players);
*/



function convert_statsall_to_players(stats: IStatsResponse) {
    let players: { [name: string]: any } = {};
    // console.log(stats);
    stats.statsall.map((player: IPlayerStatsDictionary) => {
        let alias = Object.values(player)[0].alias;
        players[alias] = Object.values(player)[0];  
    })
    return players
}

function calc_best_medic_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};
    for (const [alias, stat] of Object.entries(players) as any) {
        dict_[alias] = stat["categories"]['revives'] + Number((stat["categories"]['healthgiven']/4).toPrecision(1));
      }
    return dict_
}

function calc_best_engineer_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        dict_[alias] = stat["categories"]["dyn_planted"] + stat["categories"]["dyn_defused"];
      }
    return dict_
}

function calc_slow_bleeder_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        const kills = stat["categories"]["kills"] == 0 ? 2 : stat["categories"]["kills"];
        dict_[alias] = Math.round(stat["categories"]["damagegiven"] / stat["categories"]["kills"]);
      }
    return dict_
}

function calc_frag_stealer_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        const kills = stat["categories"]["kills"] == 0 ? 1000 : stat["categories"]["kills"];
        dict_[alias] = Math.round(stat["categories"]["damagegiven"] / kills);
      }
    return dict_
}

function calc_man_of_steel_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        const deaths = stat["categories"]["deaths"] == 0 ? 1 : stat["categories"]["deaths"];
        dict_[alias] = Math.round(stat["categories"]["damagereceived"] / stat["categories"]["deaths"]);
      }
    return dict_
}

function calc_terminator_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        const deaths = stat["categories"]["deaths"] == 0 ? 1 : stat["categories"]["deaths"];
        dict_[alias] = Number((stat["categories"]["kills"]/deaths).toFixed(2));
      }
    return dict_
}

function calc_killer_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        dict_[alias] = stat["categories"]["kills"];
      }
    return dict_
}

function calc_confirmed_kill_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
        dict_[alias] = stat["categories"]["gibs"];
      }
    return dict_
}

function calc_internal_enemy_values(players: { [name: string]: any }) {
    let dict_: { [name: string]: any } = {};

    for (const [alias, stat] of Object.entries(players) as any) {
            dict_[alias] = stat["categories"]["teamkills"];
      }
    return dict_
}

function biggest_values(metrics: { [name: string]: any }) {
    let max_values: { [name: string]: any } = {};

    for (const [metric, dict_] of Object.entries(metrics) as any) {
        max_values[metric] = Object.values(dict_).reduce((a, b) => Math.max(a as number, b as number));
        // console.log(metric + " top value is " + Object.values(dict_).reduce((a, b) => Math.max(a, b)))
      }
    return max_values
}

function smallest_values(metrics: { [name: string]: any }) {
    let max_values: { [name: string]: any } = {};

    for (const [metric, dict_] of Object.entries(metrics) as any) {
        max_values[metric] = Object.values(dict_).reduce((a, b) => Math.min(a as number, b as number));
        // console.log(metric + " top value is " + Object.values(dict_).reduce((a, b) => Math.max(a, b)))
      }
    return max_values
}

function keys_of_values(metrics: any, max_values: any) {
    let award_list: { [name: string]: any } = {};
    for (const [metric, all_values] of Object.entries(metrics) as any) {
        award_list[metric] = {}
        for (const [alias, value] of Object.entries(all_values) as any) {
            if (value == max_values[metric] && max_values[metric] > 0) {
                  award_list[metric][alias] = value;
            }
        }
    }
    return award_list;
}

export const deriveAwardsfromStats = (stats: IStatsResponse) => {
    let players = convert_statsall_to_players(stats);

    //bigger - better
    let metrics: { [name: string]: any } = {};
    metrics["Best Medic"] = calc_best_medic_values(players);
    metrics["Best Engineer"] =  calc_best_engineer_values(players);
    metrics["Terminator"] =  calc_terminator_values(players);
    metrics["Slow Bleeder"] =  calc_slow_bleeder_values(players);
    metrics["Man of Steel"] =  calc_man_of_steel_values(players);
    metrics["Internal Enemy"] =  calc_internal_enemy_values(players);
    metrics["Killer"] =  calc_killer_values(players);
    metrics["Confirmed Kill"] =  calc_confirmed_kill_values(players);
    

    let maxValues = biggest_values(metrics);
    let awardList_max = keys_of_values(metrics, maxValues)

    //smaller - better
    metrics["Frag Stealer"] =  calc_frag_stealer_values(players);

    let minValues = smallest_values(metrics);
    let awardList_min = keys_of_values(metrics, minValues)
    
    const awardList = {...awardList_min, ...awardList_max}
    return awardList
};

