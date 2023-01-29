// let productModal = new bootstrap.Modal(document.getElementById('productModal'))
import pagination from './pagination.js'

const app = Vue.createApp({
  components: {
    pagination
  },
  data() {
    return {
      baseUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'hsiaoi-2023',
      tempProduct: {},
      products: [],
      pagination: {}
    }
  },
  methods: {
    productDetail(product) {
      this.tempProduct = product
    },

    checkAdmin() {
      const url = `${this.baseUrl}/api/user/check`

        axios.post(url)
        .then((res) => {
          console.log(res);
          this.getProducts()
          console.log(this.products);
        })
        .catch((err) => {
          console.log(err);
          window.location('index.html')
        })
    },

    getProducts(page = 1) {
      const url = `${this.baseUrl}/api/${this.apiPath}/admin/products?page=${ page }`

      axios.get(url)
      .then((res) => {
        console.log(res);
        this.products = res.data.products
        this.pagination = res.data.pagination
      })
      .catch((err) => {
        console.log(err);
      })
    },
    openModal() {
      productModal.show()
      console.log('click');
    },
    closeModal() {
      productModal.hide()
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
      
    axios.defaults.headers.common['Authorization'] = token

    this.checkAdmin()
    
    // this.getProducts()
  }
})
app.mount('#app')

