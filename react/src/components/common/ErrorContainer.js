import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResponsiveModal from 'components/common/ResponsiveModal';
import PrimaryButton from 'components/Forms/PrimaryButton';
import get from 'lodash/get';
import './ErrorContainer.scss';

const DEFAULT_MESSAGE = 'Please try reloading the page';

const filterErrors = errors => errors.filter(error => get(error, 'response.status') !== 401);

const ErrorContainer = () => {
  const errors = filterErrors(useSelector(state => state.common.errors));
  const [modalVisible, setModalVisible] = useState(false);

  const lastError = errors[errors.length - 1];

  useEffect(() => {
    if(lastError)
      setModalVisible(true);
  }, [lastError]);

  if(modalVisible) {
    const { message } = lastError;

    return (
      <ResponsiveModal className="error-container" showClose={false}>
        <ResponsiveModal.Block position="left">
          <h2>Error</h2>
          <div className="error-container-message">
            <p>{message || DEFAULT_MESSAGE}</p>
          </div>

          <PrimaryButton className="first" onClick={() => setModalVisible(false)}>
            Ok
          </PrimaryButton>
        </ResponsiveModal.Block>
      </ResponsiveModal>
    );
  }

  return null;
};
 
export default ErrorContainer;