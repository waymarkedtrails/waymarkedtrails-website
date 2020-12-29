export function make_route_title(route) {
    if (route.name)
      return route.name;
    if (route.itinerary)
      return route.itinerary.join(' - ');
    if (route.symbol_description)
      return route.symbol_description;
    if (route.ref)
      return '[' + route.ref + ']';
    return '(' + route.id + ')';
};

export function make_route_subtitle(route) {
    if (route.local_name)
        return route.local_name;
    if (route.name && route.itinerary)
        return route.itinerary.join(' - ');
    return '';
};
