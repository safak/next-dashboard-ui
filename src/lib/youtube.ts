// YouTube links and embeds. Kept free of server-only imports so client
// components can use it too.

const ID = /^[A-Za-z0-9_-]{11}$/;

// Accepts the usual shapes of a video link (watch?v=, youtu.be/, /shorts/,
// /embed/, /live/) or a bare video id; null when it isn't one
export const parseYouTubeId = (input: string): string | null => {
  const text = input.trim();
  if (ID.test(text)) return text;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/)?.[1] ??
      null;
  }
  return id && ID.test(id) ? id : null;
};

// The privacy-enhanced player doesn't set tracking cookies until played
export const embedUrl = (youtubeId: string) =>
  `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;

export const thumbnailUrl = (youtubeId: string) =>
  `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;

export const watchUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}`;

export const MAX_PLAYLIST_VIDEOS = 200;
