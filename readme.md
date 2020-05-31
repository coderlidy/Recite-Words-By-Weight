# 爬取百度翻译
1. `post`请求`https://fanyi.baidu.com/sug`
2. 请求文本（非json）里添加`kw:翻译文本`
3. 请求头里添加`'content-type':'application/x-www-form-urlencoded'`
4. 请求成功后返回的是json数据