import React from "react";
import PropTypes from "prop-types";
import GroupPanel from "../common/GroupPanel";
import Media from "react-media";
import { mediaQuery, mediaQueryString } from "../../utils/style";
import RegisterChoicesList, { registerPropsList } from "./RegisterChoicesList";
import pick from "lodash/pick";

const SCREEN_MOBILE_MAX = 900;

const RegisterChoicesPanel = props => {
  const renderList = (columnSize, visibleColumns, navStyle) => {
    return (
      <RegisterChoicesList
        dark
        {...pick(props, Object.keys(registerPropsList))}
        columnSize={columnSize}
        visibleColumns={visibleColumns}
        navStyle={navStyle}
      />
    );
  };

  const renderLarge = () => {
    const { title, subtitle, image, last, large } = props;

    let columnSize = 3;
    let visibleColumns = large ? 2 : 3;

    return (
      <GroupPanel
        subtitle={subtitle}
        headerImage={image}
        className={last ? "last" : ""}
      >
        {renderList(columnSize, visibleColumns, "paginator")}
      </GroupPanel>
    );
  };

  const renderMobile = () => {
    const { title, subtitle, image, last, large } = props;

    let columnSize = 5;
    let visibleColumns = large ? 1 : 2;

    return (
      <section className={`page-section ${last ? "last" : ""}`}>
        <header className="page-section-header">
          <h3>{title}</h3>
        </header>

        <div className="page-section-content">
          {renderList(columnSize, visibleColumns, "stepper")}
        </div>
      </section>
    );
  };

  return (
    <Media query={{ minWidth: SCREEN_MOBILE_MAX + 1 }}>
      {matches => (matches ? renderLarge() : renderMobile())}
    </Media>
  );
};

RegisterChoicesPanel.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  subHeading: PropTypes.string,
  image: PropTypes.string,
  last: PropTypes.bool,
  large: PropTypes.bool,

  ...RegisterChoicesList.propTypes
};

RegisterChoicesPanel.defaultProps = {
  ...RegisterChoicesList.defaultProps
};

export default RegisterChoicesPanel;
