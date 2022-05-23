/*
  A consultant earns an amount K per hour of his time. He has to fly from city A to city B spending the least cost. Every hour that he spends traveling or waiting in an airport for connecting flights, he is losing an amount K. Assume that layover time between connecting flights is always one hour. Given inputs as N - the number of cities, X  – the number of routes between cities (not all cities are necessarily connected), costs and time of flights between two cities for X routes (same in both directions), the source city number S  and the destination city number D , please output the most optimal route S->[any intermediate cities]->D, total time in hours T and total cost C (including opportunity cost of lost earnings).
*/

// const input = {
//   K: 1000,
//   N: 4,
//   X: 7,
//   routes: [
//     "1 2 1 2500",
//     "1 3 1 3000",
//     "1 4 2 7000",
//     "2 4 1 3000",
//     "3 4 1 2000",
//     "1 3 1 3000",
//     "1 4 2 7000",
//   ],
//   S: 1,
//   D: 3,
// };

module.exports = function ({ K, N, X, routes, S, D }) {
  // routes
  // source city, dest city, flight time and flight cost

  // check constraints
  if (X < 1 || X > (N * (N - 1)) / 2) {
    return "Error";
  }

  if (K < 1 || K > 1000) {
    return "Error";
  }

  if (S < 1 || D > N) {
    return "Error";
  }

  const graph = {};
  const table = {};

  // create adjacency list
  routes.forEach((route, i) => {
    const [source, destination, time, cost] = route.split(" ");

    graph[source] = [];
    graph[destination] = [];
  });

  // populate adjancency list and starter Djikstra table
  for (let i = 0; i < routes.length; i++) {
    const [source, destination, time, cost] = routes[i].split(" ");

    // Check if this is a connecting or direct flight (connecting flights are flights that don't go directly to the destination)
    const sourceVertex = {
      dest: destination,
      time,
      cost,
      connecting: destination !== `${D}`,
    };
    const destVertex = {
      dest: source,
      time,
      cost,
      connecting: source !== `${D}`,
    };

    graph[source].push(sourceVertex);
    graph[destination].push(destVertex);

    // Distance of all vertices from start is unknown, therefore Infinity
    table[source] = { distance: Infinity, prevVertex: null };
    table[destination] = { distance: Infinity, prevVertex: null };

    // Distance of start vertex from itself is 0
    table[S] = { distance: 0, time: 0, prevVertex: null };
  }

  // traverse graph to find optimal route
  const visited = [];
  const unvisited = { ...table };

  while (Object.keys(unvisited).length > 0) {
    // Visit unvisited vertex with smallest known distance from start vertex
    const [currentVertex] = Object.entries(unvisited).sort(
      (a, b) => a[1].distance - b[1].distance
    )[0];

    // for each unvisited neighbour of the current vertex
    // if there are unvisited neighbors
    if (graph[currentVertex]) {
      graph[currentVertex]
        .filter((neighbor) => !visited.includes(neighbor.dest))
        .forEach((neighbor) => {
          let { cost, time, dest, connecting } = neighbor;
          cost = Number(cost);
          time = Number(time);

          // calculate the distance from start vertex
          // full cost of trip is: flight cost + time * hourly rate
          let distance = table[currentVertex].distance + cost + time * K;
          let newTime = table[currentVertex].time + time;

          // if the calculated distance of this vertex is less than the known distance
          if (distance < table[dest].distance) {
            // Update shortest distance to this vertex
            table[dest].distance = distance;
            // Update the previous vertex with the current vertex
            table[dest].prevVertex = currentVertex;
            // Record time of flight so we can have the total time later
            table[dest].time = newTime;

            // If connecting flight, add an aditional hour of layover
            if (connecting) {
              table[dest].time += 1;
              table[dest].distance += Number(K);
            }
          }
        });
    }

    // Add the current vertex to the list of visited vertices
    visited.push(currentVertex);
    // Remove current vertex from unvisited list
    delete unvisited[currentVertex];
  }

  // If our destination doesn't have a valid previous vertex, the route is probably impossible
  if (!table[D].prevVertex) {
    return "Error";
  }

  let flightPath = "";

  // construct return string in desired format, starting from the destination and going back to origin
  let currentRoute = table[D];
  let currentCity = D;
  let totalCost = table[D].distance;
  let totalTime = table[D].time;

  while (currentRoute) {
    // We don't need to add the arrow to the left to the first city
    if (currentRoute.prevVertex) {
      flightPath = `->${currentCity}` + flightPath;
    } else {
      flightPath = currentCity + flightPath;
    }

    currentCity = currentRoute.prevVertex;
    currentRoute = table[currentRoute.prevVertex];
  }

  return `${flightPath} ${totalTime} ${totalCost}`;
};
