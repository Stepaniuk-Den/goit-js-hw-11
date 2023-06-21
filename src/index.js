import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';

const PARAMS = new URLSearchParams({
  key: '37592708-0adc1a438205c0fc7ad44213d',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
});

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnSubmit: document.querySelector('.submit'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handlerSubmit);
refs.btnSubmit.addEventListener('click', handlerClick);

refs.btnLoadMore.hidden = true;

function handlerSubmit(evt) {
  evt.preventDefault();
  const query = evt.currentTarget.searchQuery.value;
  console.log(query);
  fetchImages(query)
    .then(data => {
      console.log(data.hits);
      data.hits.forEach(el => {
        console.log(el);
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(el));
      });
    })
    .catch(error => {
      console.log(error);
      Notiflix.Report.failure(
        'Oops!',
        'Something went wrong! Try reloading the page!',
        'Ok'
      );
    })
    .finally(() => {
      refs.btnLoadMore.hidden = false;
    });
}

function createMarkup(obj) {
  console.log(obj.webformatURL);
  return obj
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>${likes}</b>
        </p>
        <p class="info-item">
          <b>${views}</b>
        </p>
        <p class="info-item">
          <b>${comments}</b>
        </p>
        <p class="info-item">
          <b>${downloads}</b>
        </p>
      </div>
    </div>`;
      }
    )
    .join('');
}

function handlerClick() {}

function fetchImages(q) {
  return fetch(`${BASE_URL}?${PARAMS}&q="${q}"`).then(resp => {
    if (!resp.ok) {
      throw new Error('ERROR');
    }
    return resp.json();
  });
}
