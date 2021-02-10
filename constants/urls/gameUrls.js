let urls = {
  GAME_ROUTE_PREFIX: "/game",
  JOIN_GAME_URL: "/join",
  CREATE_GAME_URL: "/create",
  GAME_PAGE_URL: "/live"
};

function fullUrlWithPrefix(url) {
  return urls.GAME_ROUTE_PREFIX + url;
}

module.exports = {
  urls, fullUrlWithPrefix
}