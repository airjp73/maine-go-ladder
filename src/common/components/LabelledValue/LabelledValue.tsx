import React from "react";

interface LabelledValueProps {
  label: string;
  value: string;
}

const LabelledValue: React.FC<LabelledValueProps> = ({ label, value }) => (
  <p>
    <strong>{label}:</strong> {value}
  </p>
);

export default LabelledValue;
