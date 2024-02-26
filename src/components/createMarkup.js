// render markup function
import { refs } from './refs';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default function createMarkup(data) {
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
