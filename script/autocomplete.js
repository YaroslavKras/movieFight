const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
    root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    const onInput = async event => {
        const results = await fetchData(event.target.value);
        console.log(results);
        dropdown.classList.add('is-active');
        resultsWrapper.innerHTML = '';
        if (results) {
            for (const item of results) {
                const option = document.createElement("a");
                option.classList.add("dropdown-item");
                option.innerHTML = renderOption(item)
                option.addEventListener('click', event => {
                    input.value = inputValue(item);
                    dropdown.classList.remove('is-active');
                    onOptionSelect(item);
                });
                resultsWrapper.appendChild(option);
            }
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
}