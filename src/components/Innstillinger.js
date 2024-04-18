import React from "react";
import {
  FaUserCircle,
  FaLink,
  FaPalette,
  FaComments,
  FaShieldAlt,
  FaDatabase,
  FaBell,
  FaQuestionCircle,
  FaPaperPlane,
} from "react-icons/fa";
import "./Innstillinger.scss";

const Innstillinger = () => {
  return (
    <div className="innstillinger-container">
      <h2>Settings</h2>
      <div className="setting">
        <FaUserCircle />
        <span>Account</span>
      </div>
      <div className="setting">
        <FaLink />
        <span>Linked Devices</span>
      </div>
      <div className="setting">
        <FaPalette />
        <span>Appearance</span>
      </div>
      <div className="setting">
        <FaComments />
        <span>Chats</span>
      </div>
      <div className="setting">
        <FaShieldAlt />
        <span>Privacy</span>
      </div>
      <div className="setting">
        <FaDatabase />
        <span>Data and Storage</span>
      </div>
      <div className="setting">
        <FaBell />
        <span>Notifications</span>
      </div>
      <div className="setting">
        <FaQuestionCircle />
        <span>Help</span>
      </div>
      <div className="setting">
        <FaPaperPlane />
        <span>Invite Your Friends</span>
      </div>
    </div>
  );
};

export default Innstillinger;
