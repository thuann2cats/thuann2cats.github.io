const tmdbKey = '3a13f3a872de8c1bb28d34a9de8ceeef';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
// let response;
// let jsonResponse;
// let genres;


async function getGenres() {
    let genreRequestEndpoint = '/genre/movie/list';
    let requestParams = `?api_key=${tmdbKey}`;
    let urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
    console.log(urlToFetch); // debugging line

    try {
        response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            let genres = jsonResponse.genres;
            console.log(genres); // DEBUG
            populateGenreDropdown(genres);
            // getMovies(); // DEBUG
            return genres;
        } else {
            throw new Error(`ERROR inside response.ok check: ${response.status}`);
        }
    } catch(err) {
        console.log(`ERROR: ${err}`);
    }
}

function populateGenreDropdown(genres) {
    const dropdown = document.getElementById('genre-selection');
    // console.log(genres);
    for (const genre of genres) {
        let option = document.createElement('option');
        // console.log(genre.name);
        option.value = genre.id;
        option.text = genre.name;
        // console.log(option);
        dropdown.appendChild(option);
    }

}

getGenres(); // DEBUG

async function getMovies() {
    // get selected genre
    const dropdown = document.getElementById('genre-selection');
    let selectedGenre = dropdown.value;

    let discoverMovieEndpoint = '/discover/movie';
    let requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
    let urlToFetch = tmdbBaseUrl+discoverMovieEndpoint+requestParams;

    // fetch to get a discovered movie
    try {
        response = await fetch(urlToFetch);
        if (response.ok) {
            jsonResponse = await response.json();
            let movies = jsonResponse.results;
            console.log(movies); // DEBUG
            return movies;
        } else {
            throw new Error(`ERROR inside response.ok check of getMovies(): ${response.status}`);
        }
    } catch(err) {
        console.log(`CATCH STATEMENT IN getMovies(): ${err}`);
    }
}

async function getMovieInfo(movie) {
    let movieId = movie.id;
    let movieEndpoint = `/movie/${movieId}`;
    let requestParams = `?api_key=${tmdbKey}`;
    let urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            // console.log(jsonResponse);
            return jsonResponse;

        } else {
            throw new Error(`THROWN inside response.ok check of getMovieInfo(): ${response.status}`);
        }
    } catch(err) {
        console.log(`CATCH STATEMENT IN getMovieInfo(): ${err}`);
    }
}

function getRandomMovie(movies) {
    let index = Math.floor(Math.random() * movies.length);
    console.log(movies[index]);
    return movies[index];
}

function displayMovie(movieInfo) {
    const moviePosterDiv = document.getElementById('moviePoster');
    const movieTextDiv = document.getElementById('movieText');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');

    // create HTML content containing movie info
    const moviePoster = createMoviePoster(movieInfo.poster_path);
    const titleHeader = createMovieTitle(movieInfo.title);
    const overviewText = createMovieOverview(movieInfo.overview);

    function createMoviePoster(posterPath) {
        const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
        const posterImg = document.createElement('img');
        posterImg.setAttribute('src', moviePosterUrl);
        posterImg.setAttribute('id','moviePosterImg');
        return posterImg;
    }

    function createMovieTitle(movieTitle) {
        const titleHeader = document.createElement('h1');
        titleHeader.setAttribute('id', 'movieTitle');
        titleHeader.innerHTML = movieTitle;
        return titleHeader;
    }

    function createMovieOverview(overview) {
        const overviewParagraph = document.createElement('p');
        overviewParagraph.setAttribute('id', 'movieOverview');
        overviewParagraph.innerHTML = overview;
        return overviewParagraph;
    }

    // Append title, poster, and overview to doc
    moviePosterDiv.appendChild(moviePoster);
    movieTextDiv.appendChild(titleHeader);
    movieTextDiv.appendChild(overviewText);

    showBtns();

    function showBtns() {
        const btnDiv = document.getElementById('likeOrDislikeBtns');
        btnDiv.removeAttribute('hidden');
    }

    likeBtn.onclick = likeMovie;
    dislikeBtn.onclick = dislikeMovie;

    

    console.log("the end of displayMovie()");
}

function likeMovie() {
    clearCurrentMovie();
    showRandomMovie();
}

function dislikeMovie() {
    clearCurrentMovie();
    showRandomMovie();
}

function clearCurrentMovie() {
    const moviePosterDiv = document.getElementById('moviePoster');
    const movieTextDiv = document.getElementById('movieText');
    moviePosterDiv.innerHTML = '';
    movieTextDiv.innerHTML = '';
}

async function showRandomMovie() {
    let movies = await getMovies();
    console.log(movies);
    let randomMovie = getRandomMovie(movies);
    console.log(randomMovie);
    let info = await getMovieInfo(randomMovie);
    displayMovie(info);
    console.log("the end of showRandomMovie()");
}

const playBtn = document.getElementById('play-button');
playBtn.addEventListener('click', evt => {
    evt.preventDefault();

    const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };


    showRandomMovie();
});
