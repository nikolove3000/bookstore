import { useState } from "react";

const FloatingInput = ({ label, type = "text", name, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="relative mb-4">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-md px-3 outline-none transition-all"
        style={{
          paddingTop: isFloated ? "20px" : "13px",
          paddingBottom: isFloated ? "6px" : "13px",
          background: "#0a0808",
          border: `0.5px solid ${focused ? "#c9a84c" : "#2a1a1a"}`,
          color: "#c8b8a8",
          fontFamily: "Georgia, serif",
          fontSize: "13px",
        }}
      />
      <label
        className="absolute left-3 pointer-events-none transition-all"
        style={{
          top: isFloated ? "5px" : "50%",
          transform: isFloated ? "translateY(0)" : "translateY(-50%)",
          fontSize: isFloated ? "10px" : "13px",
          color: focused ? "#c9a84c" : "#6a5040",
          letterSpacing: isFloated ? "1px" : "0px",
          textTransform: isFloated ? "uppercase" : "none",
          fontFamily: "Georgia, serif",
        }}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;