### egg 开发思路：
  * mysql 表设计：
    user：用户表(id,userName,passWord,avant,roleId)  关联role  多对一  
    role：权限表(id,roleName)  
    note：留言点赞表(id,content,time,userId,shopId,parentId,toCommendId,like) ：  
      userId是用户的id （多对一）。   
      shopId是对某一个商品的评论。   
      parentId 为null则是顶级评论，不为空则是对之前id的评论做回复。  
      toCommendId则是回复顶级还是回复顶级下的某一个用户的，当为顶级评论的时候也为null。   
    category：商品分类表(id,categoryName)   
    shop: 商品表(id,shopName,price,number,img,description,shopType,categoryId) 关联category 多对一  
    shopDetail: 商品详情表(id,shopID,content,imgList) 关联shop 一对一  
    
  * egg-swagger (RESTful API): 
    > (CRUD其实是数据库基本操作中的Create(创建)、Retrieve(读取)、Update（更新）、Delete（删除）)  
      [swagger 使用](https://www.npmjs.com/package/egg-swagger-doc)  
      
  * swagger 中的接口  
      login:  
        POST  /login 用户登录 (userName & password)  
      user:  
        POST    /api/user       创建用户 (userName & password)  
        GET     /api/user/{id}  获取单个用户 (id)  
        GET     /api/user/all   获取所有用户(分页/模糊) (query:currentPage | pageSize | search | isPaging)  
        PUT     /api/user/add   修改用户 (id & userName & password)  
        DELETE  /api/user/{id}  删除单个用户(id)  
      shop:  
        GET     /api/shop/detail/{shopId} 查询shop  
        GET     /api/shop                 查询所有shop  
        POST    /api/shop                 新增shop  
        PUT     /api/shop/{id}            修改shop  
        DELETE  /api/shop/{id}            删除shop  
        
    ```
      // shop controller
      
      'use strict';
      const Controller = require('egg').Controller;
      /** 
       * @Controller shop 
       */
      class ShopController extends Controller {
          /**
           * @summary 查询shop
           * @description 获取shopDetail信息
           * @router get /api/shop/detail/{shopId}
           * @request path string *shopId  
           * @response 200 baseResponse 
           */
          async getShop() {
              const { ctx, service } = this
              let { shopId } = ctx.params       // ctx.params 动态路由参数获取
              const res = await service.shop.get(shopId)
              ctx.body = {
                  code: 200,
                  msg: 'success',
                  data: res,
              }
          }

          /**
           * @summary 查询所有shop
           * @description 获取所有shop信息
           * @router get /api/shop
           * @request query string id 查看id的数据 
           * @request query string search 搜索关键字 
           * @request query string page 页数 
           * @request query string pageSize 页面条数 应该是一个下拉 默认是10条 
           * @request query string minPrice 最小价格 
           * @request query string maxPrice 最大价格 
           * @request query string type 查询 0 -> 流行 1 -> 热门 2 -> 精选  
           * @response 200 baseResponse 
           */
          async getAll() {
              const { ctx, service } = this
              let id = ctx.query.id || ''
              let search = ctx.query.search || ''
              let page = ctx.query.page || 1
              let pageSize = ctx.query.pageSize || 10
              let type = ctx.query.type || 0
              let minPrice = ctx.query.minPrice || 0
              let maxPrice = ctx.query.maxPrice || 9999999
              let res = {}
              if(id){
                  res = await service.shop.get(id)
              }else{
                  res = await service.shop.getAll(page, pageSize, search, minPrice, maxPrice, type)
              }

              ctx.body = {
                  code: 200,
                  msg: 'success',
                  data: res,
              }
          }
          /**
           * @summary 新增shop
           * @description 新增shop信息
           * @router post /api/shop
           * @request body shopBody *body  
           * @response 200 baseResponse 
           */
          async createShop() {
              const { ctx, service } = this
              let res = await service.shop.createShop(ctx.request.body)
              ctx.body = {
                  code: 200,
                  msg: 'success',
                  data: res,
              }
          }

          /**
           * @summary 修改shop
           * @description 修改shop信息
           * @router put /api/shop/{id}
           * @request path string *id  shopId
           * @request body shopBody *body 
           * @request query string categoryId eg:1,2,3 categoryID 
           * @response 200 baseResponse 
           */
          async updateShop() {
              const { ctx, service } = this
              let res = await service.shop.updateShop(ctx.params.id, ctx.request.body)
              ctx.body = {
                  code: 200,
                  msg: 'success',
                  data: res,
              }
          }

          /**
           * @summary 删除shop
           * @description 删除shop信息
           * @router delete /api/shop/{id}
           * @request path string *id  
           * @response 200 baseResponse 
           */
          async deleteShop() {
              const { ctx, service } = this
              console.log(ctx.query)
              let res = await service.shop.deleteShop(ctx.params.id)
              ctx.body = {
                  code: 200,
                  msg: 'success',
                  data: res,
              }
          }
      }

      module.exports = ShopController;
  
    ```
    ```
    //shop service
    'use strict';
    const Service = require('egg').Service;
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;

    class ShopService extends Service {
        async get(id) {
            const res = await this.ctx.model.Shop.findOne({
                where: { id: id },
                'include': [
                    {
                        'model': this.ctx.model.Category
                        // 这里可以对Category进行where
                    },
                    {
                        'model': this.ctx.model.ShopDetaile
                    }, {
                        'model': this.ctx.model.Note,
                        include: [{ 'model': this.ctx.model.User }]
                    }
                ]
            });
            return res
        }


        async getAll(page, pageSize, search, minPrice, maxPrice, type) {
            let start_limit = (page - 1) * pageSize
            let end_limit = page * pageSize - 1
            const res = await this.ctx.model.Shop.findAll({
                // attributes:{
                //     include: [
                //         [Sequelize.fn('COUNT', Sequelize.col('shopName')), 'count']
                //       ]
                //     },
                where: {
                    shopType: {
                        [Op.eq]: type
                    },
                    shopName: {
                        [Op.like]: `%${search}%`
                    },
                    price: {
                        [Op.gt]: minPrice,
                        [Op.lt]: maxPrice
                    },
                },
                'include': [
                    {
                        'model': this.ctx.model.Category,
                        // through: {
                        //     attributes: ['content']
                        // }
                        // 这里可以对Category进行where
                    },
                    {
                        'model': this.ctx.model.ShopDetaile
                    }, {
                        'model': this.ctx.model.Note
                    }
                ],
                'order': [
                    ['price', 'DESC']
                ],
                offset: start_limit,
                limit: end_limit
            });
            return res
        }

        async createShop(data) {
            const res = await this.ctx.model.Shop.create(data);
            console.log(data)
            const shopDetaile = await res.createShopDetaile({ content: data.shopDetaile.content, imgList: data.imgs, shopId: res.id })
            return res; //将结果集返回
        }
        async updateShop(id, body) {
            const shop = await this.ctx.model.Shop.findOne({ where: { id: id } })
            console.log(body)
            const shopDetaile = await this.ctx.model.ShopDetaile.findOne({ where: { id: body.shopDetaile.id } })
            shopDetaile.update(body.shopDetaile)
            return await shop.update(body)
            // const res = await shop.setCategorys(category)
            // return res
        }

        async deleteShop(id) {
            console.log(id)
            const shop = await this.ctx.model.Shop.findOne({ where: { id: id } })
            await shop.setCategorys([])
            const res = await this.ctx.model.Shop.destroy({ where: { id: id } })
            return res;
        }
    }

    module.exports = ShopService;

    ```
