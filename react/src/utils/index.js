import React from "react";
import { MEDIA_BUCKETS } from "../config/constants";
import Config from "../config";
import { TweenLite } from "gsap";

export const capitalise = str => str.replace(/\b\w/g, l => l.toUpperCase());

export const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};

export const isAbsoluteUrl = url => {
  if (typeof url !== "string") return false;

  const regex = /^([a-z0-9]*:|.{0})\/\/.*$/gim;
  return regex.test(url);
};

export const trimUrl = url => url.replace(/^(www\.)/, "");

export const getScrollParent = node => {
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

  if (!node) {
    return null;
  } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getScrollParent(node.parentNode) || document.body;
};

export const scrollTo = node => {
  const scrollParent = getScrollParent(node);

  TweenLite.killTweensOf(scrollParent);
  TweenLite.to(scrollParent, 0.5, { scrollTop: node.offsetTop });
};

export const scrollToTop = childNode => {
  const scrollParent = getScrollParent(childNode);

  TweenLite.killTweensOf(scrollParent);
  TweenLite.to(scrollParent, 0.5, { scrollTop: 0 });
};

export const removeTrailingSlash = url => {
  if (url && url.length > 1 && url.substr(-1) === "/") return url.slice(0, -1);
  else return url;
};

export const getFileExtension = url => (url || "").split(".").pop();

export const resizeImageUrl = (url, width, height) => {
  const [match, protocol, domain, path] =
    (url || "").match(/(https|http):\/\/([^\/]*)\/(.*)/) || [];

  if (MEDIA_BUCKETS.includes(domain))
    return `${Config.MEDIA_URL}/${width || ''}x${height || ''}/${path}`;
  else return url;
};

export const cloudFrontImage = (path, width, height) => {
  if (!path) return null;

  if (width || height) return `${Config.MEDIA_URL}/${width || ''}x${height || ''}${path}`;

  return `${Config.MEDIA_URL}${path}`;
};

export const combineFuncs = (...funcs) => (...args) =>
  funcs.forEach(f => f && f(...args));

export const flattenObject = (obj, result = {}, path = null) => {
  if (obj == null) return obj;

  for (const [key, value] of Object.entries(obj)) {
    let combinedPath;
    if (obj instanceof Array) combinedPath = `${path || ""}[${key}]`;
    else combinedPath = path ? `${path}.${key}` : key;

    if (typeof value === "object") flattenObject(value, result, combinedPath);
    else result[combinedPath] = value;
  }

  return result;
};

export const isCrawler = () =>
  window.navigator.userAgent.match(/bot|crawl|spider/i);
export const isPrerender = () => window.navigator.userAgent.match(/prerender/i);
export const isStatic = () => isCrawler() || isPrerender();

export const makeDecorator = (
  Component,
  name
) => defaultProps => WrappedComponent => {
  const WrapperComponent = props => (
    <Component {...defaultProps} {...props}>
      {injectedProps => (
        <WrappedComponent {...defaultProps} {...props} {...injectedProps} />
      )}
    </Component>
  );

  const componentName = name || Component.displayName || Component.name;
  WrapperComponent.displayName = `${componentName}(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return WrapperComponent;
};

export const hasAncestor = (ancestor, descendant) => {
  let element = descendant;
  while(element) {
    if(element === ancestor)
      return true;
    else
      element = element.parentNode;
  }

  return false;
};
