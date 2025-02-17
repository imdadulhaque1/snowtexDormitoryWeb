import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import React, { FC } from "react";

interface verticalViewInterface {
  label: string;
  value: any;
  className?: string;
  valueColor?: string;
}

const VerticalView: React.FC<verticalViewInterface> = ({
  label,
  value,
  className,
  valueColor,
}) => {
  return (
    <div className={`flex ${className}`}>
      <p className={`${modalStyles.detailsLabel} mr-2`}>{label}:</p>
      <p className={`${modalStyles.detailsTxt} ${valueColor}`}>{value}</p>
    </div>
  );
};

export default VerticalView;
