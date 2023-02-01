const app = Vue.createApp({
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      console.log(this.user.username, this.user.password);
      const baseUrl = 'https://vue3-course-api.hexschool.io/v2'
      
      const url = `${baseUrl}/admin/signin`
      

      axios.post(url, this.user)
      .then((res) => {
        const { expired, token } = res.data
        document.cookie = `hexToken=${ token };expires=${ new Date(expired) }`
        window.location = 'products.html'
        
      })
      .catch(() => {
        alert('帳號或密碼錯誤')
      })
    }
  }
})
app.mount('#app')