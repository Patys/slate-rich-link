import React from 'react'
import './RichLink.css'
function RichLink(props) {
  const { data } = props.node;
  const href = data.get('href');
  const title = data.get('title');

  return (
    <div className="rich-link">
      <div className="title">{title}</div>
      <a href={href}>{href}</a>
    </div>
  );
}

export default RichLink
