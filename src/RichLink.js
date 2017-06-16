import React from 'react'
import './RichLink.css'

class RichLink extends React.Component{
  state = { page: {href:null}}
  data = {}

  constructor(props) {
    super(props);
    const { data } = props.node;
    this.data = data;
  }

  componentDidMount = () => {
    this.getPageInfo(this.data.get('href'));
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

  getPageInfo = (href) => {
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
      this.setState({ page: {"href": href, img: meta_img, desc: meta_desc, title: el.getElementsByTagName( 'title' )[0].text}});
    });
  }

  // const { data } = props.node;
  // const href = data.get('href');
  // const title = data.get('title');
  // const desc = data.get('desc');
  // const img = data.get('img');

  render = () => {
    console.log(this.state.page);

    if(this.state.page.href)
      return (
        <div className="rich-link">
          <div className="title">{this.state.page.title}</div>
          <img width="50" height="50" src={this.state.page.img} alt=""/>
          <a href={this.state.href}>{this.state.page.href}</a>
          <div className="desc">{this.state.page.desc}</div>
        </div>
      );
    return (
      <div className="rich-link">
        <div className="title">Loading ...</div>
      </div>
    );
  }
}

export default RichLink
