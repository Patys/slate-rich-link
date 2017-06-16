import { Editor, Raw } from 'slate'
import React from 'react'
import state from './State'

/**
 * The plain text example.
 *
 * @type {Component}
 */

class MyEditor extends React.Component {
  state = {
    state: Raw.deserialize(state, { terse: true })
  };

  onChange = (state) => {
    this.setState({ state })
  }

  render = () => {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}

export default MyEditor
