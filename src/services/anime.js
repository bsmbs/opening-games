export const getAnime = async (id) => {
    return getAnimeMAL(id);
};

const getAnimeMAL = async (id) => {
    const resp = await fetch('https://api.jikan.moe/v3/anime/'+id);
    const data = await resp.json();

    if(data.error || !resp.ok) throw 'Jikan error';
    
    return {
        id: data.mal_id,
        titles: [data.title, data.title_english, data.title_japanese, data.title_synonyms].flat(1),
        studio: data.studios[0].name,
        image: data.image_url
    }
}