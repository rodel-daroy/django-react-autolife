import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TOOLBAR = {
  options: [
    "inline",
    "blockType",
    "list",
    "link",
    "embedded",
    "emoji",
    "image"
  ],
  blockType: {
    options: ["Normal", "H2", "H3"]
  }
};

export default class HtmlEditor extends React.Component {
  constructor(props) {
    super(props);
    const html = props.input.value;
    const contentBlock = htmlToDraft(html);
    this.loadSuccess = true;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState
      };
    }
  }
  updateRender = () => {
    if (this.loadSuccess && this.props.rawHtml) {
      const html = this.props.input.value;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState
        });
      }
      this.loadSuccess = false;
    }
  };

  componentDidUpdate() {
    this.updateRender();
  }

  onEditorStateChange = editorState => {
    const rawHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.input.onChange(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState
    });
    this.props.getRawHtmlCallback(rawHtml);
  };

  render() {
    const { editorState } = this.state;
    const {
      input,
      id,
      meta: { touched, error, warning }
    } = this.props;
    return (
      <div>
        <div className="resizable-editor">
          <Editor
            {...input}
            id={id}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            value={this.state.editorState}
            placeholder="Start typing here"
            toolbar={TOOLBAR}
            stripPastedStyles
          />
        </div>
        {touched &&
          ((error && <span className="error error-container">{error}</span>) ||
            (warning && <span className="error">{warning}</span>))}
      </div>
    );
  }
}
