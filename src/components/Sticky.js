import { refs } from './refs';

// When the user scrolls the page, execute myFunction
// window.onscroll = function () {
//   myFunction();
// };

// Get the navbar
const searchFormWrapper = document.querySelector('.wrapper');

// Get the offset position of the navbar
const sticky = searchFormWrapper.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
export default function menuSticky() {
  if (window.scrollY >= sticky) {
    searchFormWrapper.classList.add('sticky');
    refs.gallery.style.paddingTop = `72px`;
  } else {
    searchFormWrapper.classList.remove('sticky');
    refs.gallery.style.paddingTop = `24px`;
  }
}
