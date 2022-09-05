import 'notiflix/dist/notiflix-3.2.5.min.css';
import './css/styles.css';
import _debounce from 'debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refSearchBox = document.querySelector('#search-box');
const refCountryList = document.querySelector('.country-list');
const refCountryInfo = document.querySelector('.country-info');

Notify.init({
  position: 'center-top',
});

refSearchBox.addEventListener('input', _debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox(event) {
  const name = event.target.value.trim();
  fetchCountries(name).then(renderFoundCoutries).catch(notifyError);
}

function renderFoundCoutries(countries) {
  const countriesNumber = countries.length;
  resetMarkUp();

  if (!countriesNumber) {
    Notify.failure('Oops, there is no country with that name');
    return;
  }

  if (countriesNumber > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countriesNumber === 1) {
    refCountryInfo.innerHTML = makeInformationMarkup(countries[0]);
    return;
  }

  if (countriesNumber < 11 && countriesNumber > 1) {
    refCountryList.innerHTML = makeListMarkup(countries);
    return;
  }
}

function resetMarkUp() {
  refCountryList.innerHTML = '';
  refCountryInfo.innerHTML = '';
}

function makeInformationMarkup(country) {
  const { name, capital, population, flags, languages } = country;
  const markup = `
  <img src = ${flags.svg} width = 80 />
  <span class="info__name">${name.official}</span>
  <p>Capital: <span>${capital[0]}</span></p>
  <p>Population: <span>${population}</span></p>
  <p>Languages: <span>${Object.values(languages).join(',')}</span></p>
  `;
  return markup;
}

function makeListMarkup(countries) {
  const markUp = [];
  countries.forEach(({ name, flags }) => {
    markUp.push(`
    <li>
    <img src = ${flags.svg} width = 40 />
    <span class="list__name"> ${name.official}<span>
    </li>
    `);
  });
  return markUp.join('');
}

function notifyError(error) {
  Notify.failure('Error !!!');
  console.log(error);
}
