<template>
  <div class="container">
    <div class="row center-xs">
      <h1>goTenna Photo Viewer</h1>
    </div>
    <div class="row center-xs">
      <p>Click on the images to toggle grayscale</p>
    </div>
    <div class="row filter end-xs">
      <div class="col-md-1 col-xs-2">
        <label for="width"
          >Width
          <select name="width" id="width" @change="didUpdateWidth($event)">
            <option selected value=""></option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="300">300</option>
            <option value="400">400</option>
          </select>
        </label>
      </div>
      <div class="col-md-1 col-xs-2">
        <label for="height"
          >Height
          <select name="width" id="width" @change="didUpdateHeight($event)">
            <option selected value=""></option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="300">300</option>
            <option value="400">400</option>
          </select>
        </label>
      </div>
    </div>
    <div class="row center-xs middle-xs">
      <div class="error col-xs-12" v-if="images.length === 0">
        There are no images to display
      </div>
      <div
        class="photo col-xs"
        v-for="(image, index) in images"
        :key="index"
        @click="toggleGrayscale(index)"
      >
        <img :src="image" alt="" />
      </div>
    </div>
    <div class="row pagination end-md center-xs">
      <button @click="didChangePage(1)">First</button>
      <button
        v-for="page in pagination.last_page"
        :key="page"
        @click="didChangePage(page)"
      >
        {{ page }}
      </button>
      <button @click="didChangePage(pagination.last_page)">Last</button>

      <select name="limit" id="limit" @change="didChangeLimit($event)">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15" selected>15</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "PhotoViewer",
  data() {
    return {
      grayscaleList: []
    };
  },
  computed: {
    ...mapState({
      photos: state => state.photos,
      images: state => state.images,
      pagination: state => state.pagination,
      url: state => state.url
    })
  },

  async mounted() {
    await this.getPhotos();
  },
  methods: {
    ...mapMutations({
      resetImages: "resetImages",
      setUrlPart: "SET_URL_PART"
    }),
    ...mapActions(["getPhotos", "toggleImage"]),

    async didChangeLimit(e) {
      this.setUrlPart({ key: "limit", value: e.target.value });
      await this.getPhotos();
    },
    async didChangePage(page) {
      this.setUrlPart({ key: "page", value: page });
      await this.getPhotos();
    },
    async didUpdateWidth(e) {
      if (e.target.value === "") {
        // return;
      }
      this.setUrlPart({ key: "width", value: e.target.value });
      await this.getPhotos();
    },
    async didUpdateHeight(e) {
      if (e.target.value === "") {
        // return;
      }
      this.setUrlPart({ key: "height", value: e.target.value });
      await this.getPhotos();
    },
    toggleGrayscale(index) {
      let grayscale = !this.grayscaleList.includes(index);
      this.toggleImage({ index, grayscale });

      if (grayscale) {
        this.grayscaleList.push(index);
      } else {
        this.grayscaleList.splice(this.grayscaleList.indexOf(index), 1);
      }
      //   console.log(this.grayscaleList, grayscale);
    },
    async getImage(url) {
      let image = await axios.get(url).then(response => {
        console.log(response.data);
        return response.data;
      });
      return image;
    }
  }
};
</script>
