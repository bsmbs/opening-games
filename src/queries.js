export const anilist =`query($username: String) {
  MediaListCollection(userName: $username, type: ANIME) {
    lists {
      name
      isCustomList
      entries {
        id
        status
        media {
          id
          idMal
          coverImage {
            large
          }
          title {
            romaji
            english
            native
          }
          format
        }
      }
    }
  }
}`

export const alAnime = `query`