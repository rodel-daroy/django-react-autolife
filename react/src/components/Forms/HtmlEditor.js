import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import useDebounceCallback from "use-debounce/lib/callback";
import './HtmlEditor.scss';

const DEBOUNCE_MS = 500;

const TOOLBAR = {
  options: [
    "inline",
    "blockType",
    "list",
    "link",
    "emoji"
  ],
  inline: {
    options: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'superscript',
      'subscript'
    ]
  },
  blockType: {
    options: ["Normal", "H2", "H3"]
  },
  list: {
    options: [
      'unordered',
      'ordered'
    ]
  }
};

const htmlToEditorState = html => {
  if(html) {
    const contentBlock = htmlToDraft(html);
    if(contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);

      return editorState;
    }
  }

  return null;
};

const editorStateToHtml = editorState => {
  if(editorState) {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    return (html || "").trim();
  }

  return null;
};

const HtmlEditor = ({ value, onChange, ...otherProps }) => {
  const getState = value => {
    const editorState = htmlToEditorState(value);

    return {
      html: editorStateToHtml(editorState),
      editorState
    };
  };

  const initialState = useMemo(() => getState(value), []);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const newState = getState(value);

    if(newState.html !== state.html)
      setState(newState);
  }, [value]);

  const [updateValue] = useDebounceCallback((state, onChange) => {
    const html = editorStateToHtml(state.editorState);

    if(state.html !== html) {
      setState({
        ...state,
        html
      });

      if(onChange)
        onChange(html);
    }
  }, DEBOUNCE_MS);

  useEffect(() => {
    updateValue(state, onChange);
  }, [state]);

  return (
    <div className="html-editor form-control">
      <Editor 
        {...otherProps}

        editorState={state.editorState}
        onEditorStateChange={editorState => setState({ ...state, editorState })}
        toolbar={TOOLBAR}
        editorClassName="html-editor-text"
        toolbarClassName="html-editor-toolbar"
        stripPastedStyles />
    </div>
  );
};

HtmlEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default HtmlEditor;