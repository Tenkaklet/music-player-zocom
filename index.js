/*
    Musikspelare

    1. Hämta token från https://blooming-reef-63913.herokuapp.com/api/token och
    spara i en variabel
    2. Lägg till inputfält för att söka efter låtar och knapp.
    3. Gör anrop till Spotify API med söksträng och token.
    4. För varje låt i svaret
        1. Skapa ett element
        2. Lägg till titel i element som text som ska visas
        3. Lägg till elementet i HTML:en
        4. Lägg till en eventlistener på elementet
    5. När jag klickar på en låt
        1. Hämta preview url från den låten
        2. Lägg till preview url som src i audio-taggen
        3. Spela upp låten.
*/

const audio = document.getElementById('audio-player');
const queryInput = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const lista = document.getElementById('lista');

let token = '';

function playSong(song) {
    console.log('Selected song: ', song);
    audio.src = song.preview_url;
    if(song === 'null') {
        audio.src = "https://p.scdn.co/mp3-preview/57eadd30537c7e457859ed589a67c304639a15ba?cid=4ba5c93a868a409599b12252bfad3d7e";
        audio.play();
    }
    
    if(song) {
        audio.src = song;
        audio.play();
    }
}

async function getToken() {
    const response = await fetch('https://blooming-reef-63913.herokuapp.com/api/token');
    const data = await response.json();
    token = data.token;
    console.log(token);
}

//https://api.spotify.com/v1/search?q=spirit%20of%20the%20season&type=track
async function getSongs(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}`+
    '&type=track', {
        headers: {
            'authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    console.log(data);
    for( let i = 0; i < data.tracks.items.length; i++) {
        const songItem = document.createElement('li');
        songItem.innerHTML = `${data.tracks.items[i].name} <button class="play" data-song="${data.tracks.items[i].preview_url}">Play</button>`;
        lista.appendChild(songItem);
    }

    const playButtons = document.getElementsByClassName('play');
    for(let i = 0; i < playButtons.length; i++) {
        playButtons[i].addEventListener('click', event => {
            console.log(event.target.dataset.song);
            playSong(event.target.dataset.song);
        });
    }


    
}

searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    getSongs(query);
});

getToken();