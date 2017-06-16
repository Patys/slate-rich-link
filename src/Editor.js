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
    state: Raw.deserialize(state, { terse: true })
  }


  onChange = (state) => {
    this.setState({ state })
  }

  onPaste = (e, data, state) => {
    // if (state.isCollapsed) return
    if (data.type != 'text' && data.type != 'html') return
    if (!this.isUrl(data.text)) return

    return state.transform().insertBlock({
      type: 'link',
      data: {
        href: data.text
      }
    }).focus().apply();
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
