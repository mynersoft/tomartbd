import { useState } from "react";
import axios from "axios";

function StatusToggle({ voucher }) {
  const [isActive, setIsActive] = useState(voucher.isActive === "active");

  const handleToggle = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);

    try {
      // Call API to update voucher status
      await axios.patch(`/api/voucher/status-update/${voucher._id}`, {
        status: newStatus ? "active" : "inactive",
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      setIsActive(!newStatus); // rollback on error
    }
  };

  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isActive}
        onChange={handleToggle}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  );
}


export default StatusToggle;