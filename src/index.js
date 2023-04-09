import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-notify-aio-3.2.6.min.js';

import { fetchPixaBayImages } from './js/fetchPixaBay';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    BtnLoad: document.querySelector('.load-more'),
}   

const observer = new IntersectionObserver(intersectingHandler);
observer.observe(refs.BtnLoad);

refs.searchForm.addEventListener('submit', onSubmitForm);

const fetchImagesPB = new fetchPixaBayImages();

const lightbox = new SimpleLightbox('.gallery a', {
    // captionsData: 'alt',
    captionDelay: 250,
});

function onSubmitForm(e) {
  e.preventDefault();
  fetchImages();
}

async function fetchImages() {
  const query = refs.searchForm.elements.searchQuery.value.trim();
  if (query === '') {
    return;
    }

  await fetchImagesPB
    .getImages(query)
    .then(({ data }) => {
      if (data.hits.length === 0) {
        refs.gallery.innerHTML = '';
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (fetchImagesPB.page === 1) {
        refs.gallery.innerHTML = renderGallery(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      } else {
        refs.gallery.insertAdjacentHTML('beforeend', renderGallery(data.hits));
        scrollPage();
      }
    })
    .catch(error => {
      if (error.response.status === 400) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        Notify.failure('Something went wrong. Try again!');
      }
    });
  lightbox.refresh();
}


function renderGallery(images) {
  return images
    .map(
      ({
        webformatURL: preview,
        largeImageURL: original,
        tags: description,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                    <a class="gallery__link" href="${original}">
                        <img src="${preview}" alt="${description}" loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                            <b>Likes</b>
                            ${likes}
                            </p>
                            <p class="info-item">
                            <b>Views</b>
                            ${views}
                            </p>
                            <p class="info-item">
                            <b>Comments</b>
                            ${comments}
                            </p>
                            <p class="info-item">
                            <b>Downloads</b>
                            ${downloads}
                            </p>
                        </div>
                    </a>
                 </div>`;
      }
    )
    .join('');
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}


function intersectingHandler(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchImages();
    }
  });
}


