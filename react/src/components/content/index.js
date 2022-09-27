import PropTypes from "prop-types";
import words from "lodash/words";
import castArray from "lodash/castArray";

export const splitHtml = (bodyHtml, intervals, minChunkLength = 50) => {
  if (typeof bodyHtml !== "string" || bodyHtml.length === 0)
    return {
      chunks: [],
      totalWordCount: 0
    };

  const parser = new DOMParser();
  const doc = parser.parseFromString(bodyHtml, "text/html");
  const nodes = Array.from(doc.body.childNodes);

  let wordCount = 0;
  let totalWordCount = 0;
  let intervalIndex = 0;
  let lastBreak = -1;
  const chunks = [];

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    wordCount += words(node.textContent).length;

    if (node.nodeType === 1 && wordCount >= intervals[intervalIndex]) {
      let chunk = "";
      for (let j = i; j > lastBreak; --j) {
        const content = nodes[j].outerHTML || nodes[j].textContent;
        chunk = content + chunk;
      }

      chunks.push(chunk);

      lastBreak = i;

      totalWordCount += wordCount;
      wordCount = 0;
      ++intervalIndex;

      if (intervalIndex > intervals.length - 1) {
        break;
      }
    }
  }

  if(lastBreak === -1)
    return {
      chunks: [bodyHtml],
      totalWordCount: nodes.map(node => words(node.textContent).length).reduce((prev, cur) => prev + cur, 0)
    };

  if (lastBreak !== nodes.length - 1) {
    let chunk = "";
    let chunkWordCount = 0;
    for (let i = lastBreak + 1; i < nodes.length; ++i) {
      const content = nodes[i].outerHTML || nodes[i].textContent;
      chunk += content;
      chunkWordCount += words(nodes[i].textContent).length;
    }

    if(chunkWordCount < minChunkLength)
      chunks[chunks.length - 1] += chunk;
    else
      chunks.push(chunk);

    totalWordCount += chunkWordCount;
  }

  return {
    chunks: chunks.filter(c => !!c),
    totalWordCount
  };
};

export const Image = PropTypes.shape({
  url: PropTypes.string.isRequired,
  alt: PropTypes.string
});

export const normalizeImages = images =>
  castArray(images).map(image => {
    if (typeof image !== "object")
      return {
        url: image
      };

    return image;
  });
