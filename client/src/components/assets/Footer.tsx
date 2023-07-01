import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-16 text-white">
      <p className="text-sm">
        Built by{" "}
        <Link
          className="text-red-200 font-bold hover:text-white"
          to="https://github.com/AymenSakouhi"
        >
          AYMEN SAKOUHI
        </Link>
      </p>
    </div>
  );
};

export default Footer;
