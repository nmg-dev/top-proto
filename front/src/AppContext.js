import React from 'react';

const ApplicationContext = React.createContext({
    locale: 'ko',
    api: '',
    user: '',
    modal: '',
});

export default ApplicationContext;