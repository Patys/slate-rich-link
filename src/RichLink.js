import React from 'react'
import './RichLink.css'

function RichLink(props) {
  const { data } = props.node;
  const href = data.get('href');
  const title = data.get('title');
  const desc = data.get('desc');
  const img = data.get('img');

  return (
    <div className="rich-link">
      <div className="title">{title}</div>
      <img width="50" height="50" src={img} alt=""/>
      <a href={href}>{href}</a>
      <div className="desc">{desc}</div>
    </div>
  );
}

export default RichLink
