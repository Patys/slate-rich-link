import { Editor, Raw } from 'slate'
import React from 'react'
import state from './State'
import RichLink from './RichLink'

const schema = {
  nodes: {
    // paragraph: props => <p>{props.children}</p>,
    link: RichLink
  }
}

class MyEditor extends React.Component {

  state = {
    state: Raw.deserialize(state, { terse: true }),
    links: [{}]
  }

  getPage = (href, next) => {
    fetch('https://crossorigin.me/' + href)
      .then((response) => {
          return response.text();
        }).then((data) => {
          next(data);
        }).catch((ex) => {
          console.log('parsing failed', ex);
        });
  }

  getPageInfo = (state, href) => {
    this.getPage(href, (data) => {
      let el = document.createElement( 'html' );
      el.innerHTML = data;

      let meta_desc = "";
      let meta_img = "";

      let metas = el.getElementsByTagName('meta');
      for (var i=0; i<metas.length; i++) {
        if (metas[i].getAttribute("property") == "og:description") {
          meta_desc = metas[i].getAttribute("content");
          // return metas[i].getAttribute("content") ? metas[i].getAttribute("content") : "Some pages";
        }
        if (metas[i].getAttribute("property") == "og:image") {
          meta_img = metas[i].getAttribute("content");
          // return metas[i].getAttribute("content") ? metas[i].getAttribute("content") : "Some pages";
        }
      }
      this.setState({ links: this.state.links.concat([{"href": href, img: meta_img, desc: meta_desc, title: el.getElementsByTagName( 'title' )[0].text}])});
    });

    return state.transform().insertBlock({
      type: 'link',
      data: {
        href: href,
        title: this.getLink(href).title,
        img: this.getLink(href).img,
        desc: this.getLink(href).desc
      }
    }).focus().apply();
  }

  getLink = (href) => {
    for(var i = 0; i < this.state.links.length; i++) {
      if(this.state.links[i].href==href) {
        console.log(this.state.links);
        return this.state.links[i];
      }
    }
    console.log(this.state.links);
    return {title: "Page", img: "null", desc: "Default page description", href: href}
  }

  onChange = (state) => {
    this.setState({ state })
  }

  onPaste = (e, data, state) => {
    // if (state.isCollapsed) return
    if (data.type != 'text' && data.type != 'html') return
    if (!this.isUrl(data.text)) return
    this.setState({ state });

    return this.getPageInfo(state, data.text);
  }

  isUrl = (url) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url);
  }

  render = () => {
    return (
      <Editor
        schema={schema}
        state={this.state.state}
        onChange={this.onChange}
        onPaste={this.onPaste}
      />
    )
  }

}

export default MyEditor
