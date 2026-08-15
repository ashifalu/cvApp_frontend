import SecondTemplate from '../templates/SecondTemplate.jsx';
import ThirdTemplate from '../templates/ThirdTemplate.jsx';
import FirstTemplate from "../templates/FirstTemplate.jsx";
import FourthTemplate from "../templates/FourthTemplate.jsx";
import FifthTemplate from "../templates/FifthTemplate.jsx";
import SixthTemplate from "../templates/SixthTemplate.jsx";
import SeventhTemplate from "../templates/SeventhTemplate.jsx";
import EighthTemplate from "../templates/EighthTemplate.jsx";
import NinthTemplate from "../templates/NinthTemplate.jsx";
import TenthTemplate from "../templates/TenthTemplate.jsx";
import EleventhTemplate from "../templates/EleventhTemplate.jsx";
import TemplateTwelve from "../templates/TemplateTwelve.jsx";
import TemplateThirteen from "../templates/TemplateThirteen.jsx";
import TemplateFourteen from "../templates/TemplateFourteen.jsx";
import TemplateFifteen from "../templates/TemplateFifteen.jsx";
import TemplateSixteen from "../templates/TemplateSixteen.jsx";

const Preview = ({ previewData, temp, theme, onPageCount, currentPage }) => {

    switch (temp) {
        case "1": return <FirstTemplate {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage} />;
        case "2": return <SecondTemplate {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage} />;
        case "3": return <ThirdTemplate {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage} />;
        case "4": return <FourthTemplate {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "5": return <FifthTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "6": return <SixthTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "7": return <SeventhTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "8": return <EighthTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "9": return <NinthTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "10": return <TenthTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "11": return <EleventhTemplate  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "12": return <TemplateTwelve  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "13": return <TemplateThirteen  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "14": return <TemplateFourteen  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "15": return <TemplateFifteen  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>
        case "16": return <TemplateSixteen  {...previewData} theme={theme} onPageCount={onPageCount} currentPage={currentPage}/>










        default: return null;
    }
};

export default Preview