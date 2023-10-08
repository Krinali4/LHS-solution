import React, { useState } from 'react';
import FileViewer from "react-file-viewer";

const ViewDoc = (props) => {


    const getFileType = (file) => {
        let type = file.split(".");
        let c = type[type.length - 1];
        return c;
    }

    const onError = e => {
        console.log(e, "error in file-viewer");
    };

    return <FileViewer fileType={getFileType(props.link)} filePath={props.link} onError={onError} />

}

export default ViewDoc;