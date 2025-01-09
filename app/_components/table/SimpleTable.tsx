import React, { FC } from "react";

interface Props {
  tableTitle?: string;
  tableData: any[];
}

const SimpleTable: FC<Props> = (props) => {
  return (
    <div className={`w-[100%] h-75p bg-white p-4 m-4 rounded-lg shadow-lg`}>
      <p className=" font-workSans text-center mb-2 text-lg font-semibold">
        Room Common features
      </p>
      <div className="flex w-full items-center border-2 border-slate-300 py-2 px-2 rounded-t-lg bg-slate-300">
        <div className="flex w-1/12 items-center  justify-center border-slate-50 border-r-2">
          <p className="text-md font-workSans font-medium text-center ">Id</p>
        </div>
        <div className=" flex  w-1/5 items-center justify-center border-slate-50 border-r-2">
          <p className="text-md font-workSans font-medium text-center">Name</p>
        </div>
        <div className="flex w-1/2 items-center justify-center border-slate-50 border-r-2">
          <p className="text-md font-workSans font-medium text-center">
            Remarks
          </p>
        </div>

        <div className="flex  w-1/5  justify-center items-center">
          <p className="text-md font-workSans font-medium text-center">
            Actions
          </p>
        </div>
      </div>

      {commonFeatures?.data?.map((features: any, featureIndex: number) => {
        const isLastFeatures = featureIndex === commonFeatures?.data.length - 1;
        return (
          <div
            key={featureIndex}
            className={`flex w-full items-center ${
              !isLastFeatures ? "border-b-2" : "border-b-0"
            } border-slate-300 py-2 px-2  bg-slate-100`}
          >
            <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
              <p className="text-sm font-workSans text-center">
                {features?.commonFeatureId}
              </p>
            </div>
            <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
              <p className="text-sm font-workSans text-center break-words max-w-full">
                {features?.name}
              </p>
            </div>
            <div className="flex w-1/2 items-center justify-center border-slate-300 border-r-2">
              <p className="text-sm font-workSans text-center  max-w-full">
                {features?.remarks}
              </p>
            </div>

            <div className="flex  w-1/5  justify-center items-center">
              <div className="relative group mr-3 ">
                <button
                  onClick={async () => {
                    await setCommonFeatures((prev) => ({
                      ...prev,
                      featuresId: features?.commonFeatureId,
                      featuresName: features?.name,
                      featureRemarks: features?.remarks,
                      isUpdated: true,
                    }));
                  }}
                >
                  <FaEdit
                    color={COLORS.primary80}
                    size={25}
                    className="cursor-pointer  shadow-xl shadow-white"
                  />
                </button>

                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                  Update Common features
                </span>
              </div>

              <div className="relative group ">
                <button
                  onClick={async () => {
                    await setCommonFeatures((prev) => ({
                      ...prev,
                      floorId: features?.commonFeatureId,
                      isDeleted: true,
                    }));
                  }}
                >
                  <MdDeleteOutline
                    color={COLORS.errorColor}
                    size={28}
                    className="cursor-pointer  shadow-xl shadow-white"
                  />
                </button>

                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                  Delete Feature
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleTable;
