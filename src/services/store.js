/* eslint-disable no-useless-catch */
import { anilist } from '../queries';
import { MALStatus } from '../util';

export default {
    debug: true,
    state: {
        fetched: 0,
        username: '',
        list: [],
        
        gamemode: -1,
        settings: {
            choices: 4,
            video: false,
            unlimited: false,
            autoplay: false
        },
        source: {
            choice: -1,
            username: "",
            chosenLists: ['WATCHING', 'COMPLETED']
        }
    },
    setSettings(obj) {
        this.state.settings = obj;
    },
    setSource(obj) {
        this.state.source = obj
    },
    setGamemode(val) {
        this.state.gamemode = val;
    },
    // LIST
    async fetchList(id, username) { // Fetch list from MAL (0) or AniList (1)
        if(id == 0) { // MAL
            const r = await this.fetchMAL(username, 1);

            return r;
        } else if (id == 1) { // AniList
            const r = await this.fetchAnilist(username);

            return r;
        } else if (id == 2) { // MAL Top 100
            const r = await this.fetchMALTop(100);

            return r;
        } else if (id == 3) { // MAL Top 250
            const r = await this.fetchMALTop(250);

            return r;
        }
        /**
         * TODO MAL popularity slider
         */
    },
    fetchMAL(username, page) {
        return new Promise((resolve, reject) => {
            this.fetchMALPage(username, page)
            .then(a => {
                if(a.hasNextPage) { // If it's not the last page
                    this.fetchMAL(username, page+1) // Fetch next page
                    .then(aa => { // It should return all next pages to the first iteration
                        const list = a.list.concat(aa); // Merge next pages with this page
                        resolve(list); // Return complete list
                    })
                } else { // If it's the last page
                    resolve(a.list); // Return this page content
                }
            })
            .catch(e => {
                reject(e);
            });
        })
    },
    async fetchMALPage(username, page) { // mal list is paginated :(
        const url = `https://api.jikan.moe/v3/user/${username}/animelist/all/${page}`;

        try {
            const resp = await fetch(url);
            const data = await resp.json();

            if(data.anime) {
                // Set list
                const list = data.anime.map(x => ({
                    titles: [x.title], // unfortunately, there's only one title on mal list but it's romaji so most popular format i guess
                    id: x.mal_id,
                    format: x.type,
                    cover: x.image_url,
                    list: MALStatus[x.watching_status]
                })).filter(x => (x.format == "TV"));

                return {
                    list,
                    hasNextPage: (data.anime.length == 300)
                };
            }
        } catch(e) {
            throw e;
        }
    },
    async fetchAnilist(username) {
        const vars = {
            username
        }

        try {
            const resp = await fetch('https://graphql.anilist.co', {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    query: anilist,
                    variables: vars
                })
            });

            if(!resp.ok) {
                throw 'Response not ok';
            }

            const data = await resp.json();

            if(data.data.MediaListCollection) {
                // Merge all lists into one
                const r = data.data.MediaListCollection.lists;
                const formatted = [].concat.apply([], r.map(x => (x.isCustomList ? [] : x.entries)));
    
                // Set list
                const list = formatted.map(x => ({
                    titles: [x.media.title.romaji, x.media.title.english, x.media.title.native],
                    id: x.media.idMal,
                    format: x.media.format,
                    cover: x.media.coverImage.large,
                    list: (x.status == "CURRENT" ? "WATCHING" : x.status)
                })).filter(x => x.format == "TV");
                
                return list;
            } else { // something went wrong
                throw 'weird error'
            }
        } catch(e) {
            console.error("Something went wrong when trying to fetch AniList list:", e);
            throw e;
        }
    },
    fetchMALTop(count) {
        return new Promise((resolve, reject) => {
            const pages = parseInt(count/50); // pages count
            let list = [];
    
            for(let i = 1; i <= pages; i++) { // Fetch each page
                fetch(`https://api.jikan.moe/v3/top/anime/${i}/bypopularity`)
                .then(resp => resp.json())
                .then(data => {
                    const top = data.top.map(x => ({
                        titles: [x.title],
                        id: x.mal_id,
                        format: x.type,
                        cover: x.image_url
                    })); // No need to filter, because animethemes.moe should have all the popular OVAs

                    list = list.concat(top);
                    if(i == pages) { // List is complete
                        resolve(list);
                    }
                });
            }
        })
        
    },
}