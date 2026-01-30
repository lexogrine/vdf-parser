type VDFObject = {
    [key: string]: string | VDFObject;
};
declare const parseVdf: (fileContent: string) => {
    success: true;
    content: VDFObject;
} | {
    success: false;
    error: string;
};

export { type VDFObject, parseVdf };
