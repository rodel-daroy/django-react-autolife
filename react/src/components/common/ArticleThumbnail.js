import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { resizeImageUrl } from "utils";
import ObjectFit from "components/common/ObjectFit";
import defaultImage from "styles/img/a1.png";

const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 195;

const cancelDrag = e => e.preventDefault();

const ArticleThumbnail = React.forwardRef(
  (
    {
      title,
      content,
      image,
      link,
      href,
      thumbnail,
      target,
      assetType,
      maxTextLength,
      maxTitleLength,
      truncate,
      className,
      loading
    },
    ref
  ) => {
    let LinkComponent = ({ children }) => (
      <Link
        className="article-thumbnail"
        to={typeof link === "object" ? link : { pathname: link }}
        target={target}
      >
        {children}
      </Link>
    );

    if (href)
      LinkComponent = ({ children }) => (
        <a className="article-thumbnail" href={href} target={target}>
          {children}
        </a>
      );

    let imageSrc;
    if (!loading) {
      if (assetType === "video") {
        if (thumbnail) {
          imageSrc = resizeImageUrl(
            thumbnail,
            THUMBNAIL_WIDTH,
            THUMBNAIL_HEIGHT
          );
        }
      } else {
        if (image) {
          const imageUrl =
            image && typeof image === "object" ? image.url : image;

          imageSrc = resizeImageUrl(
            imageUrl,
            THUMBNAIL_WIDTH,
            THUMBNAIL_HEIGHT
          );
        } else imageSrc = defaultImage;
      }
    }

    let actualTitle = title;
    if (typeof title === "string")
      actualTitle =
        title.length >= maxTextLength
          ? `${title.substr(0, maxTitleLength - 3)}...`
          : title;

    let actualContent = content;
    if (typeof content === "string")
      actualContent = (
        <p>
          {content.length >= maxTextLength
            ? `${content.substr(0, maxTextLength - 3)}...`
            : content}
        </p>
      );

    return (
      <div
        ref={ref}
        className={`article-thumb ${!truncate ? "no-truncate" : ""} ${
          loading ? "loading" : ""
        } ${className || ""}`}
        onDragStart={cancelDrag}
      >
        <LinkComponent>
          <div className="img-wrap">
            {imageSrc && (
              <ObjectFit>
                <img alt={title || ""} src={imageSrc} />
              </ObjectFit>
            )}
          </div>
          <div className="article-thumbnail-content">
            {actualTitle && <h3>{actualTitle}</h3>}
            {actualContent}
          </div>
        </LinkComponent>
      </div>
    );
  }
);

ArticleThumbnail.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ url: PropTypes.string })
  ]),
  link: PropTypes.any,
  href: PropTypes.string,
  thumbnail: PropTypes.string,
  target: PropTypes.string,
  assetType: PropTypes.string,
  maxTextLength: PropTypes.number,
  maxTitleLength: PropTypes.number,
  truncate: PropTypes.bool,
  className: PropTypes.string,
  loading: PropTypes.bool
};

ArticleThumbnail.defaultProps = {
  maxTextLength: 100,
  maxTitleLength: 40,
  truncate: true
};

ArticleThumbnail.displayName = "ArticleThumbnail";

export default ArticleThumbnail;
