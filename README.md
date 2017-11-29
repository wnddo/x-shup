# someet-shop
vue2.0商城项目

开发步骤

- 1.在github上面新建git项目，克隆到本地

`git clone git@github.com:maxwelldu/someet-shop.git`

- 2.新建dev分支，新建api分支
```
master分支是线上稳定版本，可以随时发布
dev分支是开发分支，是指可以随时运行进行测试的较稳定的版本
功能分支：开发一个功能从dev切出一个分支
```
`cd someet-shop`
`git checkout -b dev`
`git checkout -b api`

-3. 新建api目录（API项目）
`mkdir api`

- 将之前写的API项目拷贝过来(连node_modules一起拷贝，如果没拷贝过来yarn或者npm i)

<------------------数据库------------------->
- 启动mongodb数据库(确保C:\data\db有此目录, 如果没有这个目录，自己新建一下；或者用--dbpath去指定)
`mongod`

- 导入测试数据(将resource目录拷贝到项目的根目录，为了方便导入的时候写相对路径)
`mongoimport -d=xshop -c=users ./resource/dumall-users`
`mongoimport -d=xshop -c=goods ./resource/dumall-goods`
进行mongo命令行查看
`mongo`
使用 xshop这个数据库
`use xshop`
查看用户数据
`db.users.find()`
查看商品数据
`db.goods.find()`


- 配置package.json中的script,让其用pm2启动API项目
`"dev": 'pm2 start ./bin/www'`
`npm run dev`

- postman导入测试json

- 开始测试API是否OK

- 提交代码，并合并到dev分支
`git status`
`git add .`
`git commit -am '完成api项目的搭建'`
`git checkout dev`
`git merge api`

## 继续从dev分支检出client_init分支
`git checkout -b client_init`

## 新建client目录（制作前端）
`mkdir client`

## 初始化项目
`cd client && vue init webpack .`

## 安装项目依赖
`npm i -S axios vue-axios vuex vue-lazyload vue-infinite-scroll`

## 安装项目所需要的所有依赖
`yarn` or `npm i`

## 修改proxyTable

## 关闭eslint检查工具
config/index.js
`  useEslint: false,`

## 测试API是否可用

## 提交并合并到dev分支
`git status`
`git add .`
`git commit -am '项目初始化'`
`git checkout dev`
`git merge client_init`

 删除helloworld.vue
 新建pages, 里面新建一个GoodsList.vue、 Cart.vue、 Address.vue、 OrderConfirm.vue、 OrderSuccess.vue

```vue里面写的东西
<template lang="html">

</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
```

1、配置路由：
  import GoodsList from '@/pages/GoodsList'
  import Cart from '@/pages/Cart'
  import Address from '@/pages/Address'
  import OrderConfirm from '@/pages/OrderConfirm'
  import OrderSuccess from '@/pages/OrderSuccess'

  {
        path: '/',
        name: 'GoodsList',
        component: GoodsList
      },
      {
        path: '/cart',
        name: 'Cart',
        component: Cart
      },
      {
        path: '/address',
        name: 'Address',
        component: Address
      },
      {
        path: '/orderConfirm',
        name: 'OrderConfirm',
        component: OrderConfirm
      },
      {
        path: '/orderSuccess',
        name: 'OrderSuccess',
        component: OrderSuccess
      }

2、修改App.vue
  保留以下内容：
  ```
  <template>
    <div id="app">
      <!-- 使用头部组件 -->
    <nav-header></nav-header>
    <!-- 路由的出口 -->
    <router-view></router-view>
    <!-- 使用底部组件 -->
    <nav-footer></nav-footer>
    </div>
  </template>

  <script>
  export default {
    name: 'app'
  }
  </script>
  ```

  在src下新建store/index.js
  ```
  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex)

  export default new Vuex.Store({
    state: {
      nickName: '',
      cartCount: 0
    },
    mutations: {
      updateUserInfo (state, nickName) {
        state.nickName = nickName
      },
      updateCartCount (state, cartCount) {
        state.cartCount += cartCount
      },
      clearCartCount(state) {
        state.cartCount = 0
      }
    }
  })

```
  解压assets.tar放入src/assets中
  解压static.tar放入static中
  在main.js当中引入css
```
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css
```
在main.js中引入vue-lazyload(懒加载) vue-infinite-scrollg(滚动)
```

import VueLazyload from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'
Vue.use(VueInfiniteScroll);
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3
})
```

在main.js当中去请求api,存储用户名
```
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.use(VueInfiniteScroll)
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3
})
Vue.use(VueAxios, Axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted () {
    this.checkLogin()
    this.getCartCount()
  },
  methods: {
    checkLogin () {
      this.$http.get('/user/checkLogin')
      .then(res => {
        res = res.data
        if (res.status === 0) {
          this.$store.commit('updateUserInfo', res.result)
        } else {
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        }
      })
    },
    getCartCount () {
      this.$http.get('/user/getCartCount')
      .then(res => {
        res = res.data
        if (res.status === 0) {
          this.$store.commit('updateCartCount', res.result)
        }
      })
    }
  }
})
```

拷贝基础组件
在GoodsList中使用NavHeader, NavBread

在根目录下新建Public.js 公共的可以放入APP.vue中
```
import NavBread from './components/NavBread'

export default {
  components: {
    NavBread,
  }
}
```

在goodslist中放入模板内容
```
<template>
    <div>
      <!-- <nav-header></nav-header> -->
      <nav-bread>
        <span>热门商品</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">所有</a></dd>
                <dd v-for="(item,index) in priceFilter">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice | currency('￥')}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
      </modal>
      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink

" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
      <!-- <nav-footer></nav-footer> -->
    </div>
</template>
```

GoodsList.vue中的js
```
import Public from '../Public'
import Modal from '../components/Modal'
export default {
  mixins: [Public],
  components: {
    Modal
  },
  data () {
    return {
      goodsList: [],        // 商品列表
      sortFlag: true,       // 排序标记，true是升序，false降序
      page: 1,              // 当前第一页
      pageSize: 8,          // 一页8条
      busy: true,           // 是否可以继续加载，false表示可以，true表示不行
      loading: false,       // 是否正在加载
      mdShow: false,        // 登录模态框是否显示
      mdShowCart: false,    // 购物车模态框是否显示
      priceFilter: [        // 价格过滤条件
        {
          startPrice: '0.00',
          endPrice: '100.00'
        },
        {
          startPrice: '100.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '5000.00'
        }
      ],
      priceChecked: 'all',        // 选中的价格过滤值
      filterBy: false,
      overLayFlag: false
    }
  },
  methods: {
    loadMore () {

    },
    closeModal () {
    }
  }
}
```
<---------------------------------------------------------->

