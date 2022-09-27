import React from "react";
import Spinner from "components/common/Spinner";

const ArticleGroupLoader = React.forwardRef((props, ref) => (
  <div ref={ref} style={{ position: "relative", width: "100%", minHeight: 200 }}>
    <Spinner pulse scale={.5} color="lightgrey" />
  </div>
));

export default ArticleGroupLoader;