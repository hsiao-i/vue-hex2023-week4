let productModal = ''
let delProductModal = ''

import pagination from "./pagination.js"

const app = Vue.createApp({
  components: {
    pagination,
    productModal,
    delProductModal
    
  },
  data() {
    return {
      baseUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'hsiaoi-2023',
      // tempProduct: {},
      products: [],
      isNew: false,
      productData: {
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        starScore: 0,
        is_enabled: 1,  
        imageUrl: "",
        imagesUrl: []
      },
      pagination: {}
      
    }
  },
  methods: {
    checkAdmin() {
      const url = `${this.baseUrl}/api/user/check`

        axios.post(url)
        .then(() => {

          this.getProducts()
          console.log(this.products);
        })
        .catch(() => {
          alert('請重新登入')
          window.location = 'index.html'
        })
    },

    getProducts(page = 1) {
      const url = `${this.baseUrl}/api/${this.apiPath}/admin/products?page=${ page }`

      axios.get(url)
      .then((res) => {
        this.products = res.data.products
        this.pagination = res.data.pagination
        
      })
      .catch(() => {
        alert('發生錯誤，產品資訊無法顯示')
      })
    },
    
    openModal(state, product) {
      if (state === 'new') {
        this.isNew = true
        this.productData = {}
        productModal.show()
      } else if (state === 'edit') {
        this.isNew = false
        this.productData = product
        productModal.show()
      } else if (state === 'delete') {
        this.productData = product
        delProductModal.show()
      }
    },
    
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
      
    axios.defaults.headers.common['Authorization'] = token
    this.checkAdmin()
  }
})

app.component('product-modal', {
  props: ['product-data', 'is-new'],
  template: '#productModalTemplate',
  data() {
    return {
      baseUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'hsiaoi-2023',
      // updateProduct: '',
      upload: '',
      starList: [
        { id: 1, isTarget: false },
        { id: 2, isTarget: false },
        { id: 3, isTarget: false },
        { id: 4, isTarget: false },
        { id: 5, isTarget: false },
      ],
      // starScore: ''
    }
    
  },
  methods: {
    updateProduct() {
      let url = `${this.baseUrl}/api/${this.apiPath}/admin/product`
  
      let httpRequest = 'post'
  
      if (this.isNew === false) {
        url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${this.productData.id}`
        httpRequest = 'put'
      }
  
      axios[httpRequest](url, { data: this.productData })
      .then(() => {
        if (httpRequest === 'post') {
          alert('成功新增商品')
        } else if (httpRequest === 'put') {
          alert('成功更新商品內容')
        }
        this.closeModal()
        this.$emit('get-products')
      })
      .catch(() => {
        alert('請注意是否有未填資訊')
      })
    },
    closeModal() {
      productModal.hide()
    },
    uploadPicture(e) {
      console.log(this.uploadPicture);
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', file)
      console.log(file);

      const url = `${this.baseUrl}/api/${this.apiPath}/admin/upload`
      axios.post(url, formData)
      .then((res) => {
        console.log(res);
        this.upload = res.data.imageUrl
      })
      .catch((err) => {
        console.log(err);
      })
    },
    starScore(id) {
      console.log(id);
      this.starList.forEach((star) => {
        if (star.id <= id) {
          star.isTarget = true
        } else {
          star.isTarget = false
        }
      })
      // this.productData.starScore = id
    }
    
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'))
  }
})

app.component('delProductModal', {
  props: ['product-data'],
  template: '#delProductModalTemplate',
  data() {
    return {
      baseUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'hsiaoi-2023',
    }
  },
  methods: {
    deleteProduct() {
      const url = `${this.baseUrl}/api/${this.apiPath}/admin/product/${this.productData.id}`

      axios.delete(url)
      .then((res) => {
        alert(res.data.message)
        this.closeModal()
        this.$emit('get-products')
      })
      .catch(() => {
        alert('尚未刪除此項商品')
      })
    },
    closeModal() {
      delProductModal.hide()
    }
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'))
  }
})

app.mount('#app')


