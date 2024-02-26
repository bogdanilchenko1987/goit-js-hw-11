import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ApiPixaby from './components/pixaby-api';
import { refs } from './components/refs';
import menuSticky from './components/Sticky';

const obsOptions = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

// example classes

const apiPixaby = new ApiPixaby();
const observer = new IntersectionObserver(onInfinitLoad, obsOptions);
const lightbox = new SimpleLightbox('.gallery__item', {
  captionDelay: 250,
  captionsData: 'alt',
  enableKeyboard: true,
});

// event listeners
refs.searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', menuSticky);

// submit function

function onFormSubmit(evt) {
  evt.preventDefault();

  apiPixaby.query = evt.currentTarget.searchQuery.value;

  if (apiPixaby.query) {
    apiPixaby.resetPage();

    clearGallery();
    getPosts();
  } else {
    Notify.failure('Input is empty', {
      position: 'right-top',
      timeout: 1000,
    });
  }
}

// fetch posts function

function getPosts() {
  apiPixaby
    .fechPosts()
    .then(data => {
      const currentPage = apiPixaby.page - 1;
      apiPixaby.hits = data.totalHits;

      createMarkup(data.hits);
      observer.observe(refs.target);

      if (currentPage === 1) {
        if (!data.totalHits) {
          return Notify.failure('No images found. Try again', {
            position: 'right-top',
            timeout: 1500,
          });
        }
        Notify.success(`Hooray! We found ${apiPixaby.hits} images.`, {
          position: 'right-top',
          timeout: 1000,
        });
      }
    })
    .catch(err => console.log(err));
}

// render markup function

function createMarkup(data) {
  let markup = data
    .map(
      ({
        tags,
        webformatURL,
        largeImageURL,
        downloads,
        comments,
        views,
        likes,
      }) => {
        return `<div class="gallery-wpapper">
        <a class = 'gallery__item' href="${largeImageURL}" >
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}"  loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
          </a>
</div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

// clear gallery function

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// loadmore function

function onInfinitLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      getPosts();
      observer.unobserve(refs.target);
    }
  });
}
