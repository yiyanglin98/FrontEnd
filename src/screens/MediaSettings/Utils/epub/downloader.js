import _ from 'lodash';
import { prompt, CTEpubGenerator } from 'utils';
import { EDITOR_MARKDOWN } from '../constants';
import { setup } from '../setup';
import { parseText, genChaperFromItems, markdown2HTML } from './util';
import { epubState } from './setstate';


function formatEpubChapter(rawChapter) {
    let chapter = genChaperFromItems(rawChapter);
  
    let parsedTxt = parseText(chapter.text);
    if (parsedTxt.editorType === EDITOR_MARKDOWN) {
        chapter.text = markdown2HTML(parsedTxt.content);
    }

    let parsedAD = parseText(chapter.audioDescription);
    if (parsedAD.editorType === EDITOR_MARKDOWN) {
        chapter.audioDescription = markdown2HTML(parsedAD.content);
    }

    return chapter;
}

function getEpubGeneratorOptions(chapters) {
    let { mediaName } = setup.media();

    return { 
        chapters,
        filename: mediaName + '.epub', 
        author: 'Test Instructor', 
        language: epubState.language,
        title: mediaName
    };
}

function handleError(error) {
    if (error.message === 'Network Error') {
        error.message += ': Failed to download cover images.';
    } else {
        error.message += 'Failed to download the ePub file.';
    }

    prompt.addOne({ 
        text: error.message,
        status: 'error',
        position: 'bottom left'
    });
}


export function downloadEpub() {
    let chapters = _.map(epubState.chapters, formatEpubChapter);
  
    let options = getEpubGeneratorOptions(chapters);
    const epubDownloader = new CTEpubGenerator(options);
  
    epubDownloader.download({
        onError: handleError
    });
}