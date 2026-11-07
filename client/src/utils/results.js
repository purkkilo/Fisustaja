import { range } from "./format";

const winner_headers = [
  { text: "fish", value: "name" },
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "weight", value: "weight" },
];

const all_fishes_headers = [
  { text: "placement", value: "placement" },
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "fish", value: "name" },
  { text: "weight", value: "weight" },
];

const biggest_headers = [
  { text: "placement", value: "placement" },
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "weight", value: "weight" },
];

export const headers = {
  winner: winner_headers,
  all: all_fishes_headers,
  fish: biggest_headers,
};

export function cupDictToArray(results, competitions, type) {
  const arr = [];
  let boat_number = 1;
  let missing_numbers = false;
  results.forEach((boat) => {
    let values = [];
    if (type === "cup_total_points") {
      values[0] = `${boat.final_placement}.`;
      values[1] = `(${boat.boat_number})`;
      values[2] = `${boat.captain_name}`;
      values[3] = `${boat.locality}`;
      let counter = 4;
      competitions.forEach((competition) => {
        if (boat.cup_results[competition.key_name]) {
          values[counter] = `${
            boat.cup_results[competition.key_name].points
          }p (${boat.cup_results[competition.key_name].placement}.)`;
        } else {
          values[counter] = "-";
        }
        counter++;
      });
      values[counter] = `${boat.cup_results["total"]}p`;
    }

    if (type === "signees") {
      if (boat.boat_number > boat_number) {
        // values[0] is bigger than the next boat_number should be, so there is a gap
        missing_numbers = true;
        for (let i of range(boat_number, boat.boat_number)) {
          // When the i reaches the value boat_number should be, add the next real row
          if (i === boat.boat_number) {
            values[0] = String(boat.boat_number);
            values[1] = boat.captain_name;
            values[2] = boat.temp_captain_name;
            values[3] = boat.locality;
            missing_numbers = false;
            // Else just push empty rows until then
          } else {
            boat_number++;
            arr.push([String(i) + "*", "", "", ""]);
          }
        }
      } else {
        values[0] = String(boat.boat_number);
        values[1] = boat.captain_name;
        values[2] = boat.temp_captain_name;
        values[3] = boat.locality;
      }
    }

    // If there are gaps in boat_numbers --> 1, 2, 4, 5, 7, etc.
    if (!missing_numbers) {
      boat_number++;
    }
    arr.push(values);
  });

  return arr;
}

// Sorts the dictionary based on weights
export function sortDict(fishes, fish_names) {
  if (fishes) {
    let all_results = [];
    let temp_results = [];
    fish_names.forEach((name) => {
      // If fish name is not "winners"
      if (name !== "winners") {
        // For every fish name, sort the array
        if (fishes[name]) {
          temp_results = fishes[name].sort(function compare(a, b) {
            return parseInt(b.weight) - parseInt(a.weight);
          });
          fishes[name] = temp_results.filter((result) => result.weight > 0);
          // Now it's sorted so first element is fine for "winners" table
          if (fishes[name].length) {
            all_results.push({
              name: name,
              boat_number: temp_results[0].boat_number,
              captain_name: temp_results[0].captain_name,
              weight: temp_results[0].weight.toLocaleString(),
            });
          }
        }
      }
    });

    return (fishes, all_results);
  } else {
    return ({}, []);
  }
}

export function competitionToResults(competition) {
  const results = [];
  competition.normal_weights.forEach((e) => {
    let b = competition.normal_points.find(
      (boat) => boat.boat_number === e.boat_number,
    );
    let result = {
      boat_number: e.boat_number,
      captain_name: e.captain_name,
      crew: [b.temp_captain_name],
      fishes: [],
      competition_id: competition._id.$oid,
      createdAt: new Date(),
    };
    competition.fishes.forEach((f) => {
      result.fishes.push({
        name: f.name,
        weight: e[f.name],
      });
    });
    results.push(result);
  });
  return results;
}

export function competitionToFishes(competition) {
  const fishes = [];
  for (const [key, value] of Object.entries(competition.biggest_fishes)) {
    value.forEach((f) => {
      fishes.push({
        boat_number: f.boat_number,
        captain_name: f.captain_name,
        fish: key,
        weight: f.weight,
        competition_id: competition._id.$oid,
        createdAt: new Date(),
      });
    });
  }
  return fishes;
}

// "Normaalikilpailu" results
export function calculateNormalResults(competition, signees) {
  const placement_points = competition.cup_placement_points;
  let cup_placement_points = placement_points[0];
  const cup_participation_points = competition.cup_participation_points;
  let last_points = 0;
  let last_placement = 1;

  let placement = 1;
  let cup_points_total = 0;
  let normal_points = [];
  let normal_weights = [];
  signees = signees.sort(function compare(a, b) {
    return parseInt(b.total_points) - parseInt(a.total_points);
  });

  signees.forEach((signee, index) => {
    // If competitor has same points as last competitor
    if (signee.total_points === last_points) {
      placement = last_placement;
    }
    // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
    else {
      placement = index + 1;
    }

    // Find the placement points according to the placement
    let p = placement_points.find((e) => e.placement === placement);
    // If placement isn't found (placement > than provided placements), or points = 0 (no points from competition)
    if (!p || signee.total_points === 0) {
      cup_placement_points = 0;
    } else {
      cup_placement_points = p.points * competition.cup_points_multiplier;
    }
    // Calculate total cup points, cup points multiplier only scales the placement points
    cup_points_total = cup_placement_points + cup_participation_points;
    //For showing cup points, "Pisteet" on v-select
    normal_points.push({
      placement: placement,
      boat_number: signee.boat_number,
      captain_name: signee.captain_name,
      temp_captain_name: signee.temp_captain_name,
      locality: signee.locality,
      total_points: signee.total_points,
      cup_placement_points: cup_placement_points,
      cup_participation_points: cup_participation_points,
      cup_points_total: cup_points_total,
    });
    //For showing fish weights, "Kalat" on v-select
    signee.placement = placement;
    // For the data-table
    signee.fishes.forEach((f) => {
      signee[f.id] = f.weights;
    });
    normal_weights.push(signee);

    last_placement = placement;
    last_points = signee.total_points;
  });

  return { signees, normal_points, normal_weights };
}

export function calculateTeamResults(competition) {
  let signees = competition.signees;
  var team_names = [];
  let team_results = [];
  // Get all the team names
  signees.forEach((signee) => {
    if (signee.team !== "-" && signee.team !== null) {
      team_names.push(signee.team);
    }
  });
  // Only unique ones needed
  team_names = [...new Set(team_names)];

  // Get all the members of each team and add up their points
  team_names.forEach((team_name) => {
    let team = signees.filter((signee) => signee.team == team_name);
    let team_points = 0;
    let members = [];

    team.forEach((member) => {
      members.push(member.captain_name);
      team_points += member.total_points;
    });

    // If there aren't 3 members in a team, add "-"'s as members for nicer looking table
    if (members.length === 1) {
      members.push("-");
      members.push("-");
    }
    if (members.length === 2) {
      members.push("-");
    }
    team_results.push({
      name: team_name,
      captain_name_1: members[0],
      captain_name_2: members[1],
      captain_name_3: members[2],
      points: team_points.toLocaleString(),
    });
  });

  return team_results;
}

// Calculate "Suurimmat Kalat"
export function calculateBiggestFishes(
  biggest_fishes,
  fish_names,
  selected_fish,
) {
  let placement = 1;
  let header = [];
  let results = [];

  // Check v-select value, don't allow it to go null because it shows error
  if (!selected_fish) {
    selected_fish = "all";
  }
  if (selected_fish === "winners") {
    header = headers.winner;
    fish_names.forEach((n) => {
      let temp_fishes = biggest_fishes.filter((f) => f.name === n);
      if (temp_fishes.length) {
        results.push(temp_fishes.sort((a, b) => b.weight - a.weight)[0]);
      }
    });
  } else if (selected_fish === "all") {
    header = headers.all;

    if (biggest_fishes.length) {
      results = biggest_fishes.sort((a, b) => {
        return parseInt(b.weight) - parseInt(a.weight);
      });
    }

    let last_weight = -1;
    let last_placement = -1;
    results.forEach((result) => {
      if (last_weight === result.weight) {
        result.placement = last_placement;
      } else {
        result.placement = last_placement = placement;
        last_weight = result.weight;
      }
      placement++;
    });
  } else {
    header = headers.fish;
    // If v-select (selected_fish) not "winners", get fish related results and sort them
    // based on the v-select fish name

    results = biggest_fishes.filter((f) => f.name === selected_fish);

    if (results.length) {
      results.sort((a, b) => {
        return parseInt(b.weight) - parseInt(a.weight);
      });
    }
    let last_weight = -1;
    let last_placement = -1;
    results.forEach((result) => {
      if (last_weight === result.weight) {
        result.placement = last_placement;
      } else {
        result.placement = last_placement = placement;
        last_weight = result.weight;
      }
      placement++;
    });
  }
  return { header, results, selected_fish };
}

// Calculate "Suurimmat kalasaaliit", works exactly like the calculateBiggestFishes
export function calculateBiggestAmounts(
  biggest_amounts,
  selected_amount,
  fish_names,
) {
  let fishes = biggest_amounts;
  let results = [];
  let header = [];
  let placement = 1;
  if (!selected_amount) {
    selected_amount = "all";
  }
  if (selected_amount === "winners") {
    header = headers.winner;
    results = sortDict(fishes, fish_names);
  } else if (selected_amount === "all") {
    header = headers.all;
    // If v-select (selected_biggest_fish) not "winners", get fish related results and sort them
    // based on the v-select fish name
    let fish_results = [];
    for (const fish of Object.keys(fishes)) {
      fishes[fish].forEach((result) => {
        result.name = fish;
        fish_results.push(result);
      });
    }

    if (fish_results.length) {
      fish_results.sort((a, b) => {
        return parseInt(b.weight) - parseInt(a.weight);
      });
    }

    let last_weight = -1;
    let last_placement = -1;
    results = fish_results;
    results.forEach((result) => {
      if (last_weight === result.weight) {
        result.placement = last_placement;
      } else {
        result.placement = placement;
        last_weight = result.weight;
        last_placement = placement;
      }
      placement++;
    });
  } else {
    header = headers.fish;
    let fish_results = [];
    if (fishes[selected_amount]) {
      fish_results = fishes[selected_amount].sort((a, b) => {
        return parseInt(b.weight) - parseInt(a.weight);
      });
      fish_results = fish_results.filter(
        (result) => parseInt(result.weight) > 0,
      );
    }
    let last_weight = -1;
    let last_placement = -1;
    results = fish_results;
    results.forEach((result) => {
      if (last_weight === result.weight) {
        result.placement = last_placement;
      } else {
        result.placement = last_placement = placement;
        last_weight = result.weight;
      }
      placement++;
    });
  }
  return { results, header, selected_amount };
}
