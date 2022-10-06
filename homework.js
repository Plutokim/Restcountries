function setListeners(countries) {
    let sortableHeadings = document.querySelectorAll('[data-sort]');
    for(let item of sortableHeadings){
        item.onclick = event =>{
            let atrributeStr = event.currentTarget.getAttribute('data-sort');
            const filtered = countries.sort((a,b) =>{
                if (a[atrributeStr] > b[atrributeStr]) return 1;
                else if (a[atrributeStr] == b[atrributeStr]) return 0; 
                else return -1;
            });
            for(let element of sortableHeadings){
                element.firstElementChild.classList.add('hidden');
                element.lastElementChild.classList.add('hidden');
            }
            if(!event.currentTarget.classList.contains('sorted')){
                renderCountries(filtered);
                 for (let element of sortableHeadings){
                     element.classList.remove('sorted');
                 }
                event.currentTarget.classList.add('sorted');
                event.currentTarget.firstElementChild.classList.remove('hidden');
                }
            else{
                event.currentTarget.classList.remove('sorted');
                renderCountries(filtered.reverse());
                event.currentTarget.lastElementChild.classList.remove('hidden');
                sortUp=true;
            }
            
        
        };

    }
}

function tableHeaders(){
    if(document.querySelector('.countries-table')) {
        document.querySelector('.countries-table').remove();
    }
    let table = document.createElement('table');
    table.className = 'table table-striped table-bordered countries-table';
    document.querySelector('.container').append(table);
    table.innerHTML = `<thead>
                <tr>
                    <th>#</th>
                    <th class="bg-warning" data-sort="name">Name <span class ="up hidden">&uArr;</span> <span class ="down hidden">&dArr;</span></th>
                    <th class="bg-warning" data-sort="capital">Capital <span class ="up hidden">&uArr;</span> <span class ="down hidden">&dArr;</span></th>
                    <th class="bg-warning" data-sort="region">Region <span class ="up hidden">&uArr;</span> <span class ="down hidden">&dArr;</span></th>
                    <th class="bg-warning" data-sort="population">Population <span class ="up hidden">&uArr;</span> <span class ="down hidden">&dArr;</span></th>
                    <th>Flag</th>
                </tr>
            </thead>
            <tbody></tbody>`;
}
function renderCountries(countries) {
    let htmlTable = countries.reduce((acc, country, index) => acc + `<tr>
            <td>${index + 1}</td>
            <td>${country.name}</td>
            <td>${country.capital}</td>
            <td>${country.region}</td>
            <td>${country.population}</td>
            <td><img src="" width="50px"></td>
        </tr>`, '');
    document.querySelector('.countries-table tbody').innerHTML = htmlTable;
    b = new Date().getTime();
    console.log(b - a);
    setListeners(countries);
}

function prepareCountries(countries) {
    let preparedCountries = countries.map(country => ({
        name: country.name,
        capital: country.capital || '',
        flag: country.flag,
        alpha3Code: country.alpha3Code,
        area: country.area || 0,
        population: country.population || 0,
        region: country.region
    }));
    localStorage.setItem('countries', JSON.stringify(preparedCountries))
    return preparedCountries;
}

function buildRegionsSelect(countries) {
    if(document.getElementById('regions')) {
        document.getElementById('regions').remove();
    }

    let regions = countries.reduce((acc, country) => {
        if(!acc.includes(country.region)) {
            acc.push(country.region);
        }
        return acc;
    }, []);
    let regionsOptionsHtml = regions.reduce((acc, region) => acc + `<option>${region}</option>`, `<option value="">Not Selected</option>`);
    let regionsSelect = document.createElement('select');
    regionsSelect.id = 'regions';
    regionsSelect.className = "form-control mt-2";
    regionsSelect.innerHTML = regionsOptionsHtml;
    document.getElementById('search').before(regionsSelect);
    document.getElementById('regions').innerHTML = regionsOptionsHtml;
    document.getElementById('regions').onchange = e => {
        let savedCountries = localStorage.getItem('countries')
        const filteredCountries = JSON.parse(savedCountries).filter(country => country.region === e.target.value);
        renderCountries(filteredCountries);
        document.getElementById('search').value = '';
    }
}
let a;
let b;
document.getElementById('load-countries').onclick = e => {
    tableHeaders();
    a = new Date().getTime();
    let savedCountries = localStorage.getItem('countries');
    if(savedCountries) {
        savedCountries = JSON.parse(savedCountries);
        renderCountries(savedCountries);
        buildRegionsSelect(savedCountries);
        return;
    }
    document.querySelector('.countries-spinner').classList.remove('hidden');
    e.currentTarget.setAttribute('disabled', "disabled");
    fetch('https://restcountries.com/v2/all')
        .then(data => data.json())
        .then(data => {
            document.querySelector('.countries-spinner').classList.add('hidden');
            document.getElementById('load-countries').removeAttribute('disabled');
            let countries = prepareCountries(data);
            renderCountries(countries);
            buildRegionsSelect(countries);
            

        }).catch(() => {
            document.querySelector('.countries-spinner').classList.add('hidden');
            document.getElementById('load-countries').removeAttribute('disabled');
        });
}

document.getElementById('search').onkeyup = e => {
    let value = e.currentTarget.value.trim().toLowerCase();
    let savedCountries = localStorage.getItem('countries')
    const filteredCountries = JSON.parse(savedCountries).filter(country => {
        return country.name.toLowerCase().indexOf(value) > -1
            || country.capital.toLowerCase().indexOf(value) > -1
            || country.region.toLowerCase().indexOf(value) > -1
    });
    renderCountries(filteredCountries);
    document.getElementById('regions').value = '';
}

function prepareAccordion() {
    let accordionContents = document.querySelectorAll('#accordion > div');
    accordionContents.forEach(div => div.classList.add('hidden'));
    if(accordionContents.length) {
        accordionContents[0].classList.remove('hidden');
    }
    let accordionTitles = document.querySelectorAll('#accordion > h3');
    for(let title of accordionTitles) {
        title.onclick = e => {
            accordionContents.forEach(div => div.classList.add('hidden'));
            e.currentTarget.nextElementSibling.classList.remove('hidden');
        }
    }
}

document.getElementById('theme').onchange = e => {
    console.log(e.currentTarget.checked);
    let container = document.querySelector('.container');
    if(e.currentTarget.checked) {
        container.classList.remove('bg-light');
        container.classList.add('bg-dark', 'text-light');
    } else {
        container.classList.remove('bg-dark', 'text-light');
        container.classList.add('bg-light');
    }
}

window.onload = () => {
    prepareAccordion();
}


