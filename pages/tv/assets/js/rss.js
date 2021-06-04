var convert = require('xml-js');

module.exports = {
  getParams(obj) {
    let query = {};
    query['ac'] = obj.ac || 'list';
    query['p'] = obj.p || 1;
    obj.ids = Array.isArray(obj.ids) ? obj.ids.join(',') : obj.ids;
    if (obj.ids) {
      query['ids'] = obj.ids;
    } else {
      query['wd'] = obj.wd || '';
    }
    return Object.keys(query).map((k) => `${k}=${encodeURIComponent(query[k])}`).join("&")
  },
  send(url) {
    return new Promise(resolve => {
      uni.request({
        url: url,
        header: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
        },
        timeout: 5000,
        success(res) {
          resolve(res.statusCode == 200 ? res : {});
        },
        fail() {
          resolve({});
        }
      })
    })
  },
  parseJson(json) {
    /** 返回已经是JSON数据 */
  },
  parseXml(xml) {
    let doc = JSON.parse(convert.xml2json(xml, {
      compact: true
    }));
    const list = doc["rss"]["list"];
    const $class = doc["rss"]["class"];
    const pInfo = list["_attributes"];
    let vList = list["video"];
    /** 如果是数组、含有des的对象、undefined，则是搜索列表 */
    if (!vList || Array.isArray(vList) || !vList['des']) {
      vList = [].concat(vList || []).map(o => {
        return {
          id: o.id._text,
          name: o.name._cdata,
          last: o.last._text,
          note: o.note._cdata
        };
      });
    } else {
      const o = vList;
      let videolist = o.dl.dd._cdata.split("#").map(s => {
        s = s.split("$");
        return {
          label: s[0],
          src: s[1]
        };
      });
      vList = {
        id: o.id._text,
        name: o.name._cdata,
        last: o.last._text,
        note: o.note._cdata,
        pic: o.pic._text,
        actor: o.actor._cdata,
        director: o.director._cdata,
        des: o.des._cdata,
        list: videolist
      };
    }
    return {
      page: pInfo["page"],
      pageCount: pInfo["pagecount"],
      recordCount: pInfo["recordcount"],
      vList: vList
    };
  }
};
