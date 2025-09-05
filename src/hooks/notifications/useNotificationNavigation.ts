import { useCallback } from "react";
import { Notification } from "@/types/notifications";
import { slugify } from "@/utils/normalization";

export function useNotificationNavigation() {
  const navigateToNotification = useCallback((notification: Notification) => {
    switch (notification.type) {
      case "comment_reply":
        if (notification.comment?.article.id) {
          window.location.href = `/news/${notification.comment.article.id}`;
        }
        break;
      case "new_follower":
        if (notification.follower?.username) {
          window.location.href = `/users/${notification.follower.username}`;
        }
        break;
      case "review_upvote":
        if (notification.review?.item) {
          const item = notification.review.item;

          switch (item.item_type) {
            case "artist":
              if (item.artist && item.artist.length > 0) {
                const artistName = item.artist[0].name;
                window.location.href = `/artists/${slugify(artistName)}`;
              }
              break;

            case "album":
              if (item.album && item.album.length > 0) {
                const album = item.album[0];
                const albumName = album.name;
                const artistName =
                  album.album_artist.length > 0
                    ? album.album_artist[0].artist.name
                    : "";
                if (artistName && albumName) {
                  window.location.href = `/albums/${slugify(
                    artistName
                  )}/${slugify(albumName)}`;
                }
              }
              break;

            case "track":
              if (item.track && item.track.length > 0) {
                const track = item.track[0];
                const songTitle = track.title;
                const artistName =
                  track.track_artist.length > 0
                    ? track.track_artist[0].artist.name
                    : "";
                const albumName =
                  track.track_album.length > 0
                    ? track.track_album[0].album.name
                    : "";
                if (artistName && albumName && songTitle) {
                  window.location.href = `/songs/${slugify(
                    artistName
                  )}/${slugify(albumName)}/${slugify(songTitle)}`;
                }
              }
              break;
          }
        }
        break;
    }
  }, []);

  return { navigateToNotification };
}
