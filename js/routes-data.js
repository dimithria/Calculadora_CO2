// RoutesDB: Global object containing Brazilian routes data and utility methods
// This object provides a database of popular Brazilian routes with distances,
// along with methods to query cities and find distances between them.

var RoutesDB = {
    // routes: Array of route objects
    // Each route has:
    // - origin: string (city name with state, e.g., "São Paulo, SP")
    // - destination: string (city name with state)
    // - distanceKm: number (approximate distance in kilometers)
    routes: [
        { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },

        { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },

        { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },

        { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },

        { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },

        { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },

        { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },

        { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 434 },

        { origin: "Brasília, DF", destination: "Belo Horizonte, MG", distanceKm: 716 },

        { origin: "São Paulo, SP", destination: "Salvador, BA", distanceKm: 1962 },

        { origin: "Rio de Janeiro, RJ", destination: "Salvador, BA", distanceKm: 1649 },

        { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1446 },

        { origin: "Belo Horizonte, MG", destination: "Salvador, BA", distanceKm: 1372 },

        { origin: "São Paulo, SP", destination: "Recife, PE", distanceKm: 2653 },

        { origin: "Rio de Janeiro, RJ", destination: "Recife, PE", distanceKm: 2340 },

        { origin: "Brasília, DF", destination: "Recife, PE", distanceKm: 2208 },

        { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 827 },

        { origin: "São Paulo, SP", destination: "Fortaleza, CE", distanceKm: 3120 },

        { origin: "Rio de Janeiro, RJ", destination: "Fortaleza, CE", distanceKm: 2807 },

        { origin: "Brasília, DF", destination: "Fortaleza, CE", distanceKm: 2200 },

        { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKm: 800 },

        { origin: "São Paulo, SP", destination: "Manaus, AM", distanceKm: 3953 },

        { origin: "Rio de Janeiro, RJ", destination: "Manaus, AM", distanceKm: 3640 },

        { origin: "Brasília, DF", destination: "Manaus, AM", distanceKm: 1933 },

        { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1111 },

        { origin: "Rio de Janeiro, RJ", destination: "Porto Alegre, RS", distanceKm: 1554 },

        { origin: "Brasília, DF", destination: "Porto Alegre, RS", distanceKm: 2020 },

        { origin: "Porto Alegre, RS", destination: "Curitiba, PR", distanceKm: 540 },

        { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },

        { origin: "Rio de Janeiro, RJ", destination: "Curitiba, PR", distanceKm: 851 },

        { origin: "Belo Horizonte, MG", destination: "Curitiba, PR", distanceKm: 1004 },

        { origin: "Brasília, DF", destination: "Curitiba, PR", distanceKm: 1367 },

        { origin: "São Paulo, SP", destination: "Florianópolis, SC", distanceKm: 704 },

        { origin: "Rio de Janeiro, RJ", destination: "Florianópolis, SC", distanceKm: 1147 },

        { origin: "Porto Alegre, RS", destination: "Florianópolis, SC", distanceKm: 476 },

        { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },

        { origin: "São Paulo, SP", destination: "Goiânia, GO", distanceKm: 926 },

        { origin: "Rio de Janeiro, RJ", destination: "Goiânia, GO", distanceKm: 1339 },

        { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
        
        { origin: "Belo Horizonte, MG", destination: "Goiânia, GO", distanceKm: 906 }
    ],

    // getAllCities: Returns a unique sorted array of all city names from routes
    // Extracts from both origin and destination, removes duplicates, sorts alphabetically
    getAllCities: function () {
        var cities = [];
        this.routes.forEach(function (route) {
            if (cities.indexOf(route.origin) === -1) cities.push(route.origin);
            if (cities.indexOf(route.destination) === -1) cities.push(route.destination);
        });
        return cities.sort();
    },

    // findDistance: Finds route distance between two cities
    // Searches in both directions (origin-destination and destination-origin)
    // Normalizes input: trims whitespace and converts to lowercase for comparison
    // Returns distance in km if found, null if not found
    findDistance: function (origin, destination) {
        var orig = origin.trim().toLowerCase();
        var dest = destination.trim().toLowerCase();
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            if ((route.origin.toLowerCase() === orig && route.destination.toLowerCase() === dest) ||
                (route.origin.toLowerCase() === dest && route.destination.toLowerCase() === orig)) {
                return route.distanceKm;
            }
        }
        return null;
    }
};