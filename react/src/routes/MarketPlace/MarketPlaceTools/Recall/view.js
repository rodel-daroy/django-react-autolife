import React from 'react';
import PropTypes from 'prop-types';
import ToolsASpot from '../components/ToolsASpot';
import Breadcrumbs from 'components/Navigation/Breadcrumbs';
import ToolsRow from '../components/ToolsRow';
import ToolsCarSelectorForm from '../components/ToolsCarSelectorForm';
import OtherTools from '../components/OtherTools';
import { CBBTOOLS } from 'config/constants';
import { withRouter } from "react-router";
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import aSpot from "./img/a-spot.jpg";
import "../style.scss";

const RecallView = ({ history }) => {
  const handleSearch = ({ year, make, model }) => {
    history.push(`/market-place/tools/recall/${year}/${make}/${model}`);
  };

  return (
    <article className="recall-view">
      <ArticleMetaTags title="Recall Check" />

      <div className="page-width">
        <ToolsASpot title="Recall Check" image={aSpot} sponsor={null} />
        
        <div className="content-container">
          <div className="text-container">
            <Breadcrumbs>
                <Breadcrumbs.Crumb link="/market-place" name="Marketplace" />
                <Breadcrumbs.Crumb name="Recall Check" />
            </Breadcrumbs>
          </div>

          <ToolsRow title="Recall Check" textContent="Why wait to be notified by the manufacturer if your vehicle has a safety concern or a recall? You can search yourself in 3 easy steps." style={{ marginTop: 50 }}>
            <ToolsCarSelectorForm form="recall" onSubmit={handleSearch} submitText="Search" />
          </ToolsRow>

          <div className="text-container">
            <OtherTools currentTool={CBBTOOLS.RECALL} />
          </div>
        </div>
      </div>
    </article>
  );
};

RecallView.propTypes = {
  history: PropTypes.object.isRequired
};
 
export default withRouter(RecallView);