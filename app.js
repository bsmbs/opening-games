const express = require('express');
const Parser = require('animethemes-parser');

const port = 8400;

const server = async () => {
    const a = await new Parser().all();

    const app = express();
    
    app.get('/', (req, res) => {
        res.send("siema");
    })

    app.get('/api/anime', async (req, res) => {
        try {
            const id = req.query.id

            // animethemes find
            let themes = a.find(anime => anime.id == id);

            if(!themes) return res.status(404).send("Not found");
            
            res.send({
                id: themes.id,
                title: themes.title,
                themes: themes.themes
            })
        } catch(e) {
            res.status(500);
            res.send(e);
        }
    })

    console.log("Listening at :"+port);
    app.listen(port);
}

server();