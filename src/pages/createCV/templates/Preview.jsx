import React from 'react'
import SecondTemplate from '../templates/SecondTemplate';
import ThirdTemplate from '../templates/ThirdTemplate';

const Preview = ({ previewData, temp, theme, onPageCount  }) => {

    switch (temp) {
        case "1": return <SecondTemplate {...previewData} theme={theme}  />;
        case "2": return <SecondTemplate {...previewData} theme={theme}  onPageCount={onPageCount} />;
        case "3": return <ThirdTemplate {...previewData} theme={theme} />;
        default: return null;
    }
};



export default Preview