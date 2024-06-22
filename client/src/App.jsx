import React, { useEffect, useState } from "react";
import ImageUpload from "./components/ImageUpload";
import imageService from "./api/imageService";
import Footer from "./components/Footer/Footer";

const App = () => {
    const [extensions, setExtensions] = useState([""]);
    const [activeTab, setActiveTab] = useState("resize");

    const getExtensions = async () => {
        const resp = await imageService.supportedExtensions();
        setExtensions(["", ...resp.data.formats]);
    };

    useEffect(() => {
        getExtensions();
    }, []);

    return (
        <>
            <div className="w-screen min-h-[95vh] flex sm:p-12 p-6">
                <div className="border flex-1 bg-[#d5deef] rounded-xl flex md:flex-row flex-col relative">
                    <div
                        className={`flex-1 md:rounded-l-xl rounded-t-xl flex justify-center items-center transition-colors duration-200 ${
                            activeTab === "resize" ? "" : "bg-[#8AAEE090]"
                        }`}>
                        {activeTab === "resize" && (
                            <ImageUpload
                                tab={activeTab}
                                extensions={extensions}
                            />
                        )}
                        {activeTab !== "resize" && (
                            <div className="flex flex-col justify-center gap-y-4">
                                <p className="text-white montserrat md:text-2xl text-xl text-center transition-all duration-200">
                                    Change Image Dimensions
                                </p>
                                <button
                                    onClick={() => setActiveTab("resize")}
                                    className="bg-[#638ECB] hover:bg-[#395886] outline-none shadow-md px-6 py-2 text-white transition-colors duration-200 ease-in-out rounded">
                                    Let's Go
                                </button>
                            </div>
                        )}
                    </div>
                    <div
                        className={`flex-1 md:rounded-l-xl rounded-b-xl flex justify-center items-center transition-colors duration-200 ${
                            activeTab === "extension" ? "" : "bg-[#8AAEE090]"
                        }`}>
                        {activeTab === "extension" && (
                            <ImageUpload
                                tab={activeTab}
                                extensions={extensions}
                            />
                        )}
                        {activeTab !== "extension" && (
                            <div className="flex flex-col justify-center gap-y-4 p-5">
                                <p className="text-white montserrat md:text-2xl text-xl text-center transition-all duration-200">
                                    Change Image Extension
                                </p>
                                <button
                                    onClick={() => setActiveTab("extension")}
                                    className="bg-[#638ECB] hover:bg-[#395886] outline-none shadow-md px-6 py-2 text-white transition-colors duration-200 ease-in-out rounded">
                                    Let's Go
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default App;
