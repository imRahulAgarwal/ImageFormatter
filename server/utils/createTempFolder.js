import fs from "fs";

const createTempFolder = () => {
    const tempFolder = "./temp";
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
    }
};

export default createTempFolder;
