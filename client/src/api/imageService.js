import axios from "axios";
import { apiUrl } from "../conf/conf";

class ImageService {
    async supportedExtensions() {
        let url = apiUrl + "/images/format";
        const result = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return result;
    }

    async resizeImage(params, data) {
        let url = apiUrl + "/images/resize?" + params;
        const result = await axios.post(url, data, {
            responseType: "blob",
            headers: {
                "Content-Type": "application/octet-stream",
            },
        });
        return result;
    }

    async changeExtension(params, data) {
        let url = apiUrl + "/images/format?" + params;
        const result = await axios.post(url, data, {
            responseType: "blob",
            headers: {
                "Content-Type": "application/octet-stream",
            },
        });
        return result;
    }
}

const imageService = new ImageService();

export default imageService;
