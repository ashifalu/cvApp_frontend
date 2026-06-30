import React from 'react'
import SecondTemplate from '../../pages/createCV/templates/SecondTemplate.jsx';
import ThirdTemplate from '../../pages/createCV/templates/ThirdTemplate.jsx';

const Preview = ({ previewData, temp, theme }) => {
  
    switch (temp) {
        case "1": return <SecondTemplate {...previewData} theme={theme} />;
        case "2": return <SecondTemplate {...previewData} theme={theme} />;
        case "3": return <ThirdTemplate {...previewData} theme={theme} />;
        default: return null;
    }
};



export default Preview