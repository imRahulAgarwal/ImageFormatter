import React from "react";

const Footer = () => {
    return (
        <footer className="bg-[#395886] text-white text-center py-8">
            <p className="mb-4">Developed by Rahul Agarwal</p>
            <div className="flex justify-center space-x-4 mb-4">
                <a
                    href="https://instagram.com/rahul.coder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#B1C9EF] rounded-full hover:bg-[#8AAEE0] transition-colors">
                    <img
                        src="instagram.svg"
                        className="p-2"
                    />
                </a>
                <a
                    href="https://youtube.com/@rahul.coder12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#B1C9EF] rounded-full hover:bg-[#8AAEE0] transition-colors">
                    <img
                        src="youtube.svg"
                        className="p-2"
                    />
                </a>
                <a
                    href="https://linkedin.com/in/rahul-agarwal12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#B1C9EF] rounded-full hover:bg-[#8AAEE0] transition-colors">
                    <img
                        src="linkedin.svg"
                        className="p-2"
                    />
                </a>
                <a
                    href="mailto:imagarwal05@gmail.com"
                    className="w-10 h-10 flex items-center justify-center bg-[#B1C9EF] rounded-full hover:bg-[#8AAEE0] transition-colors">
                    <img
                        src="mailto.svg"
                        className="p-2"
                    />
                </a>
            </div>
            <a
                href="https://workwithrahul.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D5DEEF] hover:text-[#8AAEE0] transition-colors">
                Visit My Website
            </a>
            <p className="text-[#D5DEEF] mt-4">&copy; {new Date().getFullYear()} Rahul Agarwal. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
