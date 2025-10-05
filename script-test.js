const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('skip');
const back = document.getElementById('restart');
const currentProgress = document.getElementById('current-progress');
const progressConteiner = document.getElementById('progress-conteiner');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const likeButton = document.getElementById('like');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

const prettyWoman = {
    songName : 'Oh, pretty woman',
    artist : 'Roy Orbisson',
    file: 'pretty_woman',
    liked: false,
};

const jailHouseRock = {
    songName : 'Jailhouse Rock',
    artist : 'Elvis Presley',
    file: 'jailhouse_rock',
    liked: false,
};

const swayMeNow = {
    songName : 'Sway me Now',
    artist : 'Michael Bublé',
    file: 'sway_me_now',
    liked: false,
};

const abc = {
    songName : 'ABC',
    artist : 'Jackson 5',
    file: 'abc',
    liked: false,
}

const ben = {
    songName : 'Ben',
    artist : 'Jackson 5',
    file: 'ben',
    liked: false,
}

const sh_boom = {
    songName : 'Sh-boom',
    artist : 'The chords',
    file: 'sh-boom',
    liked: false,
}

const nao_quero = {
    songName : 'Não quero dinheiro',
    artist : 'Tim Maia',
    file: 'nao_quero_dinheiro',
    liked: false,
}

const wonderful = {
    songName : 'What a Wonderful World',
    artist : 'Louis Armstrong',
    file: 'wonderful_world',
    liked: false,
}

let isplaying = false;
let isshuffle = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [prettyWoman, jailHouseRock, swayMeNow, abc, ben, sh_boom, nao_quero, wonderful];
let sortedPlaylist = [...originalPlaylist]
let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isplaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    song.pause();
    isplaying = false;
}

function playPauseDecider(){
    if(isplaying === false){
        playSong();
    }
    else{
        pauseSong();
    }
}

function likeButtonRender(){
   if(sortedPlaylist[index].liked === true){
    likeButton.querySelector('.bi').classList.remove('bi-hand-thumbs-up');
    likeButton.querySelector('.bi').classList.add('bi-hand-thumbs-up-fill');
    likeButton.classList.add('button-active');
   }
   else{
    likeButton.querySelector('.bi').classList.add('bi-hand-thumbs-up');
    likeButton.querySelector('.bi').classList.remove('bi-hand-thumbs-up-fill');
    likeButton.classList.remove('button-active');
   }
}

function loadSong(){
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function restartSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else{
        index -=1;
    }
    loadSong();
    playSong();
}

function skipSong(){
    if(index === sortedPlaylist.length -1){
        index = 0;
    }
    else{
        index +=1;
    }
    loadSong();
    playSong();
}

function updateProgress(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressConteiner.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
       let randomIndex = Math.floor(Math.random()* size);
       let aux = preShuffleArray[currentIndex];
       preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
       preShuffleArray[randomIndex] = aux;
       currentIndex -= 1;
    }
}

function clickedShuffleButtton(){
    if(isshuffle === false){
        isshuffle = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else {
        isshuffle = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function clickedRepeatButtton(){
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else{
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function playOrRepeat(){
    if(repeatOn === false){
        skipSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/ 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return(`${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
} 

function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonliked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }
    else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

loadSong();

play.addEventListener('click', playPauseDecider);
back.addEventListener('click', restartSong);
next.addEventListener('click', skipSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', playOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressConteiner.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', clickedShuffleButtton);
repeatButton.addEventListener('click', clickedRepeatButtton);
likeButton.addEventListener('click', likeButtonliked);