import axios from 'axios';
const API_KEY = '4139654-a3a72999a2a74a48ca7ba20eb';
const BASE_URL = 'https://pixabay.com/api/';

export class fetchPixaBayImages {
  constructor() {
    this.page = 1;
    this.query = '';
  }

  async getImages(query) {
    if (query !== this.query) {
      this.query = query;
      this.page = 1;
    } else {
      this.page += 1;
    }

    const options = {
      params: {
        key: API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    };
    const response = await axios.get(BASE_URL, options);
    return response;
  }
}