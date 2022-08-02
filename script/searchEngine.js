const autocompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}"/>
        <h1>${movie.Title}</h1>
        `;
    },
    inputValue: (movie) => {
        return movie.Title;
    },
    async fetchData(searchCriteria) {
        const response = await axios.get('http://www.omdbapi.com/',
            {
                params: {
                    apikey: 'd448a1f3',
                    s: searchCriteria
                }
            })
        if (response.Error) {
            return [];
        }
        return response.data.Search;
    }
}
let leftMovie;
let rightMovie;
//Left
createAutoComplete(
    {
        ...autocompleteConfig,
        root: document.querySelector("#left-autocomplete"),
        onOptionSelect(movie) {
            optionSelect(movie, document.querySelector("#left-summary"), "left")
        }
    }
)


//Right
createAutoComplete(
    {
        ...autocompleteConfig,
        root: document.querySelector("#right-autocomplete"),
        onOptionSelect(movie) {
            optionSelect(movie, document.querySelector("#right-summary"), "right")
        }
    }
)


function runComparison() {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat, index) =>{
        const rightStat = rightSideStats[index];

        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);
        if(leftSideValue>rightSideValue){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        } else{
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
    })
}

async function optionSelect(movie, element, side) {
        const movieId = movie.imdbID;
        const response = await axios.get('http://www.omdbapi.com/',
            {
                params: {
                    apikey: 'd448a1f3',
                    i: movieId
                }
            }
        );
        if (response.Error) {
            return [];
        }
        if(side === "left"){
            leftMovie = movie;
        } else {
            rightMovie = movie;
        }
        document.querySelector('.tutorial').classList.add('is-hidden');
        element.innerHTML = movieTemplate(response.data);

        if(leftMovie && rightMovie){
            runComparison();
        }
}

const movieTemplate = (movieDetail) => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) =>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        } else{
            return prev + value;
        }
    }, 0);
    console.log(awards);
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                 <h1>${movieDetail.Title}</h1>
                 <h4>${movieDetail.Genre}</h4>
                 <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
        <p class="tite">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="tite">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
        <p class="tite">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="tite">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="tite">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `
}