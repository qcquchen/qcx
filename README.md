# wechat-quchuxing
趣出行小程序
# https://github.com/qcquchen/qcx.git
# 执行命令
# npm i 
# npm i gulp -g

# 编译文件 cmd 项目根目录下 执行 编译：gulp build； 检查：gulp dev；

# 项目路径 src/src/...
# 项目公共配置 src/js/...
# 项目图片文件 src/images/...

# 项目结构
# src
#  |
#  app.js 初始化文件
#  app.json 项目配置文件
#  app.scss 公共样式文件
# 	src 
# 	 |                  WaitCarowner  乘客等待车主接单
					    CarOwnerReleased  车主发布---->设置行驶线路页面


# 	 auditTheOwner ---> auditTheOwner 车主审核列表
# 	 |                       |
# 	 |                  auditInfo  审核车主详情页
# 	 authorized  -----> authorized 微信授权页面
# 	 |
# 	 findTravel  -----> findTravel 首页（非必选首页）
# 	 |
# 	 groupList   -----> groupList  群列表
# 	 | 
# 	 lineInfo    -----> lineInfo 群详情
# 	 |				       |
#    |			 -----> linePeopleList 我的行程
#    |
#    login       -----> login  登录
#    |                    |
#    |           -----> setLocation 设置家庭公司地址
#    |     
#    matchTravel -----> matchTravel 匹配行程
#    |
#    ownersCertification   ------> 车主认证
#    | 
#    ownerSelectLine   ------> 选择路线
#    |
#    search      -----> search 搜索行程/路线
#    |
#    submitorder -----> submitorder 确认提交订单/可调起支付
# 	 |				       |
#    |			 -----> confirmOrder 支付页
#    |
#    travelInfo  -----> travelInfo 行程详情
#    |
#    travelList  -----> travelList 我的页面下 行程列表
#    |                      |
#    |           -----> myTravelInfo 我的行程详情
#    index 发布页 （可变为项目主题首页） 


## js文件
#  driver_api.js 车主端API
#  passenger_api.js 乘客端API
#  moment.js 格式化时间文件
#  apiUtils.js 封装request请求文件
#  constants.js 全局状态文件
#  utils.js 全局封装包
#  amap-wx.js 高德SDK