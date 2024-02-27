import axios from 'axios';
const API_KEY = '42539657-384ed4c43443bb2978e732447';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiPixaby {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0;
  }

  async fechPosts() {
    const OPTIONS = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });

    try {
      const resp = await axios.get(`${BASE_URL}?${OPTIONS.toString()}`);

      this.incrementPage();
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newHits) {
    this.totalHits = newHits;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
