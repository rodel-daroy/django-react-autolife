import React, { useEffect, useState } from "react";

export const sendEvent = (category, event, label, value, otherParams) => {
  window.gtag("event", event, {
    event_category: category,
    event_label: label,
    value,
    ...otherParams
  });
};

export const useExperiment = (experimentId, defaultValue = "0") => {
  const [variant, setVariant] = useState(defaultValue);

  const updateVariant = value => {
    setVariant((value === undefined || value === null) ? defaultValue : value);
  };

  const initialize = () => {
    const value = window.google_optimize && window.google_optimize.get(experimentId);
    updateVariant(value);
  };

  useEffect(() => {
    const hideEnd = window.dataLayer && window.dataLayer.hide && window.dataLayer.hide.end;

    if(hideEnd)
      window.dataLayer.hide.end = () => {
        initialize();
        hideEnd();
      };
    else
      initialize();

    if(window.gtag)
      window.gtag("event", "optimize.callback", {
        name: experimentId,
        callback: updateVariant
      });

    return () => {
      if(window.gtag)
        window.gtag("event", "optimize.callback", {
          name: experimentId,
          callback: updateVariant,
          remove: true
        });
    };
  }, []);

  return variant;
};

export const withExperiment = (experimentId, defaultValue = "0") => WrappedComponent => {
  const WrapperComponent = props => {
    const variant = useExperiment(experimentId, defaultValue);

    return (
      <WrappedComponent {...props} variant={variant} />
    );
  };

  WrapperComponent.displayName = `withExperiment(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WrapperComponent;
};