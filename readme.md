# 爬取百度翻译
1. `post`请求`https://fanyi.baidu.com/sug`
2. 请求文本（非json）里添加`kw:翻译文本`
3. 请求头里添加`'content-type':'application/x-www-form-urlencoded'`
4. 请求成功后返回的是json数据

# 云开发 数据库 索引管理
### 添加索引好处
添加单词的索引
### 添加索引好处
- 加快检索速度
- 做一些额外的限制(比如唯一索引，将学号 no 设置为唯一索引，在数据存储时数据库就会校验是否和现有的学号重复)