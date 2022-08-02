const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results')

const onInput = async event => {
    const movies = await fetchData(event.target.value);
    console.log(movies);
    dropdown.classList.add('is-active');
    resultsWrapper.innerHTML = '';
    if (movies) {
        render(movies);
    } else {
        resultsWrapper.innerHTML = 'Search returned no result';
    }
};
input.addEventListener('input', debounce(onInput, 500));
document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
})

const fetchData = async (searchCriteria) => {
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

const getMovieData = async (movie) => {
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
    document.querySelector(".summary").innerHTML = movieTemplate(response.data);
}


const render = (movies) => {
    for (const movie of movies) {
        const option = document.createElement("a");
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        option.classList.add("dropdown-item");
        option.innerHTML = `
        <img src="${imgSrc}"/>
        <h1>${movie.Title}</h1>
        `;
        option.addEventListener('click', event => {
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            getMovieData(movie)
        });
        resultsWrapper.appendChild(option);
    }
}

const movieTemplate = (movieDetail) => {
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
    <article class="notification is-primary">
        <p class="tite">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
        <p class="tite">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
        <p class="tite">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
        <p class="tite">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
        <p class="tite">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `
}

createAutoComplete(
    {
        root: document.querySelector(".autocomplete"),
        renderOption: (movie) => {
            const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
            return `
        <img src="${imgSrc}"/>
        <h1>${movie.Title}</h1>
        `;
        },
        onOptionSelect: getMovieData(movie),
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
)