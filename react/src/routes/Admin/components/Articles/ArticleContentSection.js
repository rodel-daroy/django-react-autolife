import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Field, formValueSelector, change } from "redux-form";
import { ReduxTextField } from "components/Forms/TextField";
import { required } from "utils/validations";
import { ReduxTextAreaField } from "components/Forms/TextAreaField";
import { ReduxHtmlEditorField } from "components/Forms/HtmlEditorField";
import FeatureSpot from "components/common/FeatureSpot";
import PrimaryButton from "components/Forms/PrimaryButton";
import RadialButton from "components/Forms/RadialButton";
import { getASpotProps, getBSpotProps } from "routes/EditorialTemplates/components/EditorialTemplates/Default/Section/helpers";
import { connect } from "react-redux";
import SelectAssetModal from "../Assets/SelectAssetModal";
import { ReduxDropdownField } from "components/Forms/DropdownField";
import { lookupSponsors } from "redux/actions/articlesEditActions";
import "./ArticleContentSection.scss";

const parser = new DOMParser();

const requiredHtml = value => {
  if(!value)
    return "Required";

  const doc = parser.parseFromString(value, "text/html");
  if(!doc || doc.documentElement.innerText.trim().length === 0)
      return "Required";

  return undefined;
};

const getAssetIndex = (assets = [], templateLocation) => {
  let index = assets.findIndex(asset => asset.template_location === templateLocation);
  if(index === -1)
    index = assets.length;

  return index;
};

const getSponsorOptions = (sponsors = []) => {
  const result = [{
    label: 'No sponsor',
    value: null
  }];

  result.push(...sponsors.map(sponsor => ({
    label: (
      <img className="article-content-section-sponsor" src={sponsor.logo} alt={sponsor.name} />
    ),
    value: sponsor.id
  })));

  return result;
};

const ArticleContentSection = ({ 
  assets = [], 
  change, 
  form, 
  sponsors, 
  lookupSponsors 
}) => {
  const [selectAssetOpen, setSelectAssetOpen] = useState(false);

  useEffect(() => {
    lookupSponsors();
  }, [lookupSponsors]);

  const aSpot = getASpotProps(assets);
  const bSpot = getBSpotProps(assets);

  const handleAssetSubmit = asset => {
    const index = getAssetIndex(assets, selectAssetOpen);

    let newAssets = assets.slice();
    newAssets[index] = {
      ...asset,

      asset_id: asset.id,
      template_location: selectAssetOpen
    };
    change(form, "assets", newAssets);
    change(form, `template_configuration.${selectAssetOpen}`, true);

    setSelectAssetOpen(false);
  };

  const handleRemoveAsset = templateLocation => () => {
    const index = getAssetIndex(assets, templateLocation);

    const newAssets = assets.slice();
    newAssets.splice(index, 1);
    change(form, "assets", newAssets);
    change(form, `template_configuration.${templateLocation}`, false);
  };

  const sponsorsOptions = useMemo(() => {
    return getSponsorOptions(sponsors.result);
  }, [sponsors]);

  return (
    <section className="article-content-section">
      <FeatureSpot 
        kind="image"
        {...aSpot}
        frameContent={(
          <div className="article-content-section-a-spot">
            <RadialButton size="large" onClick={() => setSelectAssetOpen("spot_A")}>
              <span className="icon icon-picture"></span>
            </RadialButton>

            <Field
              label="Sponsor"
              name="sponsor"
              component={ReduxDropdownField}
              options={sponsorsOptions}
              searchable={false}
              placeholder="No sponsor"
              parse={value => (value && typeof value === "object") ? value.value : value}
              format={value => (value && typeof value === 'object') ? value.id : value} />
          </div>
        )}>

        <div className="text-width">
          <Field
            name="headline"
            label="Heading"
            hideLabel
            component={ReduxTextAreaField}
            rows={2}
            validate={[required]}
            className="article-content-section-head"
            dark
            placeholder="Heading" />

          <Field
            name="subheading"
            label="Subheading"
            hideLabel
            component={ReduxTextAreaField}
            rows={2}
            className="article-content-section-subhead"
            dark
            placeholder="Subheading" />
        </div>
      </FeatureSpot>

      <div className="content-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <aside className="article-content-section-sidebar">
                <Field
                  name="byline"
                  label="Byline"
                  component={ReduxTextField}
                  placeholder="e.g. John Smith" />

                <Field
                  name="byline_link"
                  label="Byline link"
                  component={ReduxTextField}
                  placeholder="e.g. https://johnsmith.com" />
              </aside>
            </div>
            <div className="col-md-9">
              <div className="article-content-section-main">
                <Field
                  className="article-content-section-body"
                  name="body"
                  label="Article body"
                  hideLabel
                  component={ReduxHtmlEditorField}
                  validate={[required, requiredHtml]}
                  placeholder="Article body" />

                <Field
                  name="synopsis"
                  label="Synopsis"
                  component={ReduxTextAreaField}
                  validate={[required]}
                  rows={6} />

                <div className="article-content-section-b-controls">
                  <PrimaryButton size="medium" type="button" onClick={() => setSelectAssetOpen("spot_B")}>
                    Select B-spot...
                  </PrimaryButton>

                  {bSpot && (
                    <button 
                      className="btn btn-link" 
                      type="button" 
                      onClick={handleRemoveAsset("spot_B")}>

                      <span className="icon icon-x"></span> Remove B-spot
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        
          {bSpot && (
            <div className="row">
              <FeatureSpot spot="B" scrim={null} {...bSpot} />
            </div>
          )}
        </div>
      </div>

      {selectAssetOpen && (
        <SelectAssetModal 
          onSubmit={handleAssetSubmit}
          onClose={() => setSelectAssetOpen(false)} />
      )}
    </section>
  );
};

ArticleContentSection.propTypes = {
  form: PropTypes.string.isRequired,

  assets: PropTypes.array,
  change: PropTypes.func.isRequired,
  lookupSponsors: PropTypes.func.isRequired,
  sponsors: PropTypes.object.isRequired
};

const mapStateToProps = (state, { form }) => ({
  assets: formValueSelector(form)(state, "assets"),
  sponsors: state.articlesEdit.sponsors
});
 
export default connect(mapStateToProps, { change, lookupSponsors })(ArticleContentSection);