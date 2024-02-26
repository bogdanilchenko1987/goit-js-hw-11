import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ApiPixaby from './components/pixaby-api';

// DOM elements
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  target: document.querySelector('.js-guard'),
};

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

refs.searchForm.addEventListener('submit', onFormSubmit);

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
      console.log(data.totalHits);
      // if (!data.totalHits) {
      //   return Notify.failure('No images found. Try again', {
      //     position: 'right-top',
      //     timeout: 1500,
      //   });
      // }
      // if (!data.hits.length) {
      //   return;
      // }

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
        return `<a class = 'gallery__item' href="${largeImageURL}" >
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
</a>`;
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

function onInfinitLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // apiPixaby.incrementPage();
      getPosts();
      observer.unobserve(refs.target);
    }
  });
}
