import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, propTypes } from 'redux-form';
import { ReduxCheckbox } from 'components/Forms/Checkbox';
import PrimaryButton from 'components/Forms/PrimaryButton';
import fromPairs from 'lodash/fromPairs';
import './FilterDropdown.scss';

class FilterDropdown extends React.Component {
  state = {
    showDropdown: false,
    checkCount: 0
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    this.initializeFromValue(this.props.value);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if(value !== prevProps.value)
      this.initializeFromValue(value);
  }

  initializeFromValue(value) {
    const { initialize } = this.props;

    if(value) {
      initialize({
        is_checked: fromPairs(value.map(key => ([key, true])))
      });

      this.setState({
        checkCount: value.length
      });
    }
  }

  handleDocumentClick = e => {
    if(!this._container.contains(e.target))
      this.hideDropdown();
  }

  showDropdown = () => {
    this.setState({ showDropdown: true });
  }

  hideDropdown = () => {
    this.setState({
      showDropdown: false
    });

    this.props.reset();
  }

  toggleDropdown = () => {
    const show = !this.state.showDropdown;

    if(show)
      this.showDropdown();
    else
      this.hideDropdown();
  }

  handleFilter = values => {
    const { is_checked } = values;
    const filter = Object.keys(is_checked).filter(key => is_checked[key]);
    this.props.filterDataByState(filter);
    
    this.setState({
      showDropdown: false,
      checkCount: filter.length
    });

    const { initialize } = this.props;
    setTimeout(() => {
      initialize(values);
    })
  }

  render() {
    const {
      selectLists,
      handleSubmit,
      submitting
    } = this.props;

    const { showDropdown, checkCount } = this.state;

    return (
      <form ref={ref => this._container = ref} className="filter-dropdown" onSubmit={handleSubmit(this.handleFilter)}>
        <div>
          <button type="button" className="btn btn-link primary-link large" onClick={this.toggleDropdown} size="medium">
            {this.props.filterText}
            {checkCount > 0 && ` (${checkCount})`}

            <span className={`icon icon-angle-${showDropdown ? 'up' : 'down'}`} />
          </button>

          {showDropdown && (
            <div className="filter-dropdown-menu">
              <ul className="filter-dropdown-list">
                {(selectLists || []).map((data, i) => (
                  <li key={data.id}>
                    <Field
                      label={data.name}
                      component={ReduxCheckbox}
                      name={`is_checked[${data.params}]`} />
                  </li>
                ))}
              </ul>

              <PrimaryButton
                type="submit"
                disabled={submitting}
                size="small">

                Apply
              </PrimaryButton>
            </div>
          )}
        </div>
      </form>
    );
  }
}

FilterDropdown.propTypes = {
  ...propTypes,

  selectLists: PropTypes.array.isRequired,
  filterDataByState: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  value: PropTypes.array
};

export default reduxForm({})(FilterDropdown);
