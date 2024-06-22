import React, { useEffect, useState } from "react";
import imageService from "../api/imageService";
import Loader from "./Loader/Loader";
import { toast } from "react-toastify";
import { toastOptions } from "../conf/conf";

const chunkSize = 1024 * 1024;

const ImageUpload = ({ tab, extensions = [] }) => {
    const [loading, setLoading] = useState(false);

    const [dropzoneActive, setDropzoneActive] = useState(false);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [extension, setExtension] = useState("");

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState();
    const [currentChunk, setCurrentChunk] = useState(null);

    const handleDrop = async (e) => {
        e.preventDefault();
        const upload = e.dataTransfer.files[0];
        const extensionSupported = extensions.find((ext) => ext === upload.type.split("/")[1]);

        if (extensionSupported) {
            setImage(upload);
            setPreview(URL.createObjectURL(upload));
            if (tab === "resize") {
                getHeightWidth(upload);
            }
        } else {
            toast.warning("Image format not supported", toastOptions);
        }
    };

    const handleChange = async (e) => {
        e.preventDefault();
        const upload = e.target.files[0];
        const extensionSupported = extensions.find((ext) => ext === upload.type.split("/")[1]);

        if (extensionSupported) {
            setImage(upload);
            setPreview(URL.createObjectURL(upload));
            if (tab === "resize") {
                getHeightWidth(upload);
            }
        } else {
            toast.warning("Image format not supported", toastOptions);
        }
    };

    const getHeightWidth = (upload) => {
        const reader = new FileReader();
        reader.readAsDataURL(upload);
        reader.onload = function (e) {
            const image = new Image();

            image.src = e.target.result;

            image.onload = function () {
                setHeight(this.height);
                setWidth(this.width);
            };
        };
    };

    const readAndUploadCurrentChunk = () => {
        const reader = new FileReader();
        if (!image) {
            return;
        }
        const from = currentChunk * chunkSize;
        const to = from + chunkSize;
        // Slice does not include the end, so we do not require to subtract 1 from the to size
        const blob = image.slice(from, to);

        reader.readAsDataURL(blob);
        reader.onload = (e) => uploadChunk(e);
    };

    const uploadChunk = (readerEvent) => {
        const data = readerEvent.target.result;
        const params = new URLSearchParams();

        params.set("name", image.name);
        params.set("currentChunk", currentChunk);
        params.set("totalChunks", Math.ceil(image.size / chunkSize));

        setLoading(true);
        if (tab === "resize") {
            params.set("height", height);
            params.set("width", width);

            imageService.resizeImage(params, data).then((response) => {
                const fileSize = image.size;
                const chunks = Math.ceil(fileSize / chunkSize);
                const isLastChunk = currentChunk === chunks;

                if (isLastChunk) {
                    const blob = new Blob([response.data], { type: response.headers["content-type"] });

                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${image.name}`;
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    emptyState();
                } else {
                    setCurrentChunk((prev) => prev + 1);
                }
            });
        } else {
            params.set("extension", extension);

            imageService.changeExtension(params, data).then((response) => {
                const fileSize = image.size;
                const chunks = Math.ceil(fileSize / chunkSize);
                const isLastChunk = currentChunk === chunks;
                if (isLastChunk) {
                    const blob = new Blob([response.data], { type: response.headers["content-type"] });

                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${image.name.split(".")[0]}.${blob.type.split("/")[1]}`;
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    emptyState();
                } else {
                    setCurrentChunk((prev) => prev + 1);
                }
            });
        }
    };

    const handleClick = () => {
        if (image) {
            setCurrentChunk(0);
        }
    };

    const emptyState = () => {
        setDropzoneActive(false);
        setImage(null);
        setCurrentChunk(null);
        setHeight(0);
        setWidth(0);
        setExtension("");
        setPreview();
        setLoading(false);
    };

    useEffect(() => {
        if (currentChunk !== null) {
            readAndUploadCurrentChunk();
        }
    }, [currentChunk]);

    useEffect(() => {
        if (tab) {
            emptyState();
        }
    }, [tab]);

    return (
        <>
            <div className="h-full w-full flex flex-col md:p-10 p-5 transition-all duration-200">
                <p className="montserrat text-center md:text-3xl text-xl font-semibold text-[#395886] transition-all duration-200">
                    {tab === "resize" ? "Change Image Dimensions" : "Change Image Extension"}
                </p>
                <div className="flex gap-x-10 my-5 mx-auto">
                    {tab === "resize" ? (
                        <>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="width"
                                    className="montserrat">
                                    Width
                                </label>
                                <input
                                    type="number"
                                    id="width"
                                    name="width"
                                    className="outline-none w-full rounded px-2 py-1 bg-[#f0f3fa] montserrat focus:bg-white"
                                    required
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="height"
                                    className="montserrat">
                                    Height
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    className="outline-none w-full rounded px-2 py-1 bg-[#f0f3fa] montserrat focus:bg-white"
                                    required
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {image && (
                                <div className="flex gap-x-4 montserrat flex-col">
                                    <label htmlFor="extension">Select the extension to change the file in</label>
                                    <select
                                        id="extension"
                                        name="extension"
                                        className="outline-none rounded py-1 bg-[#f0f3fa] focus:bg-white transition-colors duration-200"
                                        value={extension}
                                        onChange={(e) => setExtension(e.target.value)}>
                                        {extensions.map((ext) => {
                                            return ext == "" ? (
                                                <option
                                                    value={ext}
                                                    key={ext}>
                                                    Select an extension
                                                </option>
                                            ) : (
                                                image.type.split("/")[1] !== ext && (
                                                    <option
                                                        className="uppercase"
                                                        key={ext}
                                                        value={ext}>
                                                        {ext}
                                                    </option>
                                                )
                                            );
                                        })}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!preview ? (
                    <>
                        <label
                            htmlFor="image"
                            className="cursor-pointer group flex-1">
                            <div
                                onDragOver={(e) => {
                                    setDropzoneActive(true);
                                    e.preventDefault();
                                }}
                                onDragLeave={(e) => {
                                    setDropzoneActive(false);
                                    e.preventDefault();
                                }}
                                onDrop={handleDrop}
                                className={`h-full flex rounded-xl items-center justify-center border-2 border-dashed transition-colors duration-200 ${
                                    dropzoneActive
                                        ? "border-[#8AAEE0]"
                                        : "border-[#F0F3FA] group-hover:border-[#8aaee0]"
                                }`}>
                                <p
                                    className={`montserrat md:text-3xl text-xl text-center transition-all duration-200 ${
                                        dropzoneActive ? "text-[#395886]" : "text-[#638ECB] group-hover:text-[#395886]"
                                    }`}>
                                    Drag or Upload image
                                </p>
                            </div>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                            name="image"
                            id="image"
                        />
                    </>
                ) : (
                    <>
                        <img
                            src={preview}
                            className="w-full max-w-[480px] max-h-[540px] h-full mx-auto"
                        />
                        <button
                            className="py-1 rounded mt-4 bg-yellow-500 hover:bg-yellow-600 text-white duration-200 transition-colors"
                            onClick={() => {
                                emptyState();
                            }}>
                            Change Image
                        </button>
                    </>
                )}
                <button
                    onClick={() => handleClick()}
                    className={`transition-colors duration-200 bg-[#638ECB] montserrat text-xl mt-4 py-2 rounded hover:bg-[#395886] text-white`}>
                    Start
                </button>
            </div>
            {loading && (
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#ffffff57] z-10 flex justify-center items-center">
                    <Loader />
                </div>
            )}
        </>
    );
};

export default ImageUpload;
