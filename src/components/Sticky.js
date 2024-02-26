import { refs } from './refs';

// Get the navbar
const searchFormWrapper = document.querySelector('.wrapper');

// Get the offset position of the navbar
const sticky = searchFormWrapper.offsetTop;

// Add the sticky class to the menu when you reach its scroll position. Remove "sticky" when you leave the scroll position
export default function menuSticky() {
  if (window.scrollY >= sticky) {
    searchFormWrapper.classList.add('sticky');
    refs.gallery.style.paddingTop = `72px`;
  } else {
    searchFormWrapper.classList.remove('sticky');
    refs.gallery.style.paddingTop = `24px`;
  }
}
