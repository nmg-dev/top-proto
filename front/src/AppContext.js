import React from 'react';
import Metric from './module/metric';
import AttributeMeta from './module/ameta';


const ApplicationContext = React.createContext({
    locale: 'ko',
    api: '',
    user: '',
    modal: '',
    metrics: Metric.ALL,
    meta: {
        config: AttributeMeta.Config,
        design: AttributeMeta.Design,
        message: AttributeMeta.Message,
    },
});

export default ApplicationContext;