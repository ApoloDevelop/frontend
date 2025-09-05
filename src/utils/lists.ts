export const getTabLabel = (type: string) => {
  switch (type) {
    case "artist":
      return "Artistas";
    case "album":
      return "Álbumes";
    case "track":
      return "Canciones";
    case "favorites":
      return "Favoritos";
    default:
      return type;
  }
};
