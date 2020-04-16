import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    photos: [],
    images: [],

    url: {
      base: "http://localhost:8000/api/photos",
      page: 1,
      limit: 15,
      width: "",
      height: ""
    },
    pagination: {}
  },
  mutations: {
    SET_PHOTOS(state, photos) {
      state.photos = photos;
    },
    SET_IMAGE(state, image) {
      state.images.push(image);
    },
    REPLACE_IMAGE_AT_INDEX(state, { index, image }) {
      //use Vue.set to make reactive, so images swap on the fly
      Vue.set(state.images, index, image);
    },
    SET_URL_PART(state, { key, value }) {
      state.url[key] = value;
    },
    SET_PAGINATION(state, data) {
      state.pagination = data;
    },
    SET_PAGE(state, page) {
      state.params.page = page;
    },
    RESET_IMAGES(state) {
      state.images = [];
    },
    RESET_PHOTOS(state) {
      state.photos = [];
    },
    RESET_PAGINATION(state) {
      state.pagination = {};
    }
  },
  actions: {
    async getPhotos({ state, commit, dispatch }) {
      await axios({
        url: `${state.url.base}?page=${state.url.page}&limit=${state.url.limit}&width=${state.url.width}&height=${state.url.height}`,
        params: state.params
      }).then(response => {
        commit("SET_PHOTOS", response.data.data);
        let data = response.data;
        delete data.data;
        commit("SET_PAGINATION", data);
        dispatch("downloadImages");
      });
    },

    toggleImage({ state, commit }, { index, grayscale }) {
      let gs = grayscale ? "grayscale" : "";
      axios
        .get(
          `http://localhost:8000/api/image/${state.photos[index].name}?${gs}`
        )
        .then(image => {
          commit("REPLACE_IMAGE_AT_INDEX", { index: index, image: image.data });
        });
    },
    downloadImages({ state, commit }) {
      commit("RESET_IMAGES");
      let promises = [];
      state.photos.map(photo => {
        promises.push(
          axios.get(`http://localhost:8000/api/image/${photo.name}`)
        );
      });
      axios.all(promises).then(
        axios.spread((...responses) => {
          responses.map(image => commit("SET_IMAGE", image.data));
        })
      );
    }
  },
  modules: {}
});
