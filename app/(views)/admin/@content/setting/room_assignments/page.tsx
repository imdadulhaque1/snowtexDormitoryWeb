"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import AddNewPersonModal from "@/app/_components/modal/AddNewPersonModal";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import SearchPersonCard from "@/app/_components/card/SearchPersonCard";
import DeleteModal from "@/app/_components/modal/DeletedModal";
import { IoClose } from "react-icons/io5";
import { personInterface } from "@/interface/admin/roomManagements/personInterafce";
import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import PersonCard from "@/app/_components/card/PersonCard";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import { FaCheck } from "react-icons/fa";
import RoomInfoSelectCard from "@/app/_components/card/RoomInfoSelectCard";
import RoomDetailsCard from "@/app/_components/card/RoomDetailsCard";
import VertcialRadioBtn from "@/app/_components/radioBtn/VertcialRadioBtn";

interface Props {}

interface PersonInfoState {
  personId: number | null;
  searchKey: string;
  searchData: personInterface[];
  selectedPerson: personInterface | null;
  checkedData: personInterface | null;
}

const RoomAssignmentsPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });

  const [userType, setUserType] = useState({
    internal: true,
    external: false,
  });

  const [boolStatus, setBoolStatus] = useState({
    isAddNew: false,
    isViewDetails: false,
    isUpdate: false,
    isDelete: false,
    checkedStatus: false,
  });

  const [fetchData, setFetchData] = useState({
    roomDetails: [],
  });

  const [personInfo, setPersonInfo] = useState<PersonInfoState>({
    personId: null,
    searchKey: "",
    searchData: [],
    selectedPerson: null,
    checkedData: null,
  });

  const [paymentOptions, setPaymentOptions] = useState({
    paidOrNot: 0,
  });

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = await retrieveToken();

      if (token) {
        try {
          const decoded: any = jwtDecode.decode(token);

          setDecodeToken({
            userId: decoded?.userId,
            name: decoded?.name,
            email: decoded?.email,
            token: token,
            expireDate: decoded?.exp,
          });
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    fetchAndDecodeToken();

    // if (decodeToken?.token && decodeToken?.userId) {
    //   getBuildingsFunc(decodeToken?.token);
    //   fetchFloorData(decodeToken?.token);
    //   fetchRoomData(decodeToken?.token);
    // }
  }, [decodeToken?.token, decodeToken?.userId]);

  const fetchPersonInfo = async (key: any) => {
    try {
      const { data } = await axios.get(`${AppURL.personApi}?search=${key}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });
      if (data?.status === 200) {
        setPersonInfo((prev) => ({ ...prev, searchData: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching person info: ", error?.message);
    }
  };

  useEffect(() => {
    if (personInfo?.searchKey?.trim()) {
      fetchPersonInfo(personInfo?.searchKey);
    }
  }, [personInfo?.searchKey]);

  const handlePersonSelect = async (selectedPerson: any) => {
    if (
      selectedPerson?.personalPhoneNo !==
      personInfo?.selectedPerson?.personalPhoneNo
    ) {
      await setBoolStatus((prev) => ({
        ...prev,
        checkedStatus: false,
      }));
      await setPersonInfo((prev: any) => ({
        ...prev,
        selectedPerson: selectedPerson,
        checkedData: null,
      }));
    }
  };

  const personInfoDeleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (personInfo?.personId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.personApi}/${personInfo?.personId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${decodeToken?.token}`,
            },
            body: JSON.stringify(deleteData),
          }
        );

        if (response?.status === 200) {
          toast.success("Person info deleted successfully !");
          setPersonInfo((prev) => ({ ...prev, personId: null }));
          setBoolStatus((prev) => ({ ...prev, isDelete: false }));
          personInfo?.searchKey?.trim() &&
            fetchPersonInfo(personInfo?.searchKey);
        } else {
          toast.error("Error deleting building !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
        console.log("Error deleting person info: ", error.message);
      }
    }
  };

  const paidOrNotChange = (value: any) => {
    setPaymentOptions((prev) => ({ prev, paidOrNot: value }));
  };

  const size = useWindowSize();
  const windowHeight: any = size && size?.height;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex flex-col ${
          getDrawerStatus ? "pl-[265]" : "pl-0"
        } max-h-screen  justify-center `}
      >
        <div className="flex items-center justify-center w-100p h-10 mb-4">
          <ComBtn
            className={
              userType?.internal
                ? "bg-primary50 text-white"
                : "bg-primary80 text-black"
            }
            onClick={() => {
              setUserType({
                internal: true,
                external: false,
              });
            }}
            label="Internal Employee"
          />
          <ComBtn
            className={
              userType?.external
                ? "bg-primary50 text-white"
                : "bg-primary80 text-black"
            }
            onClick={() => {
              setUserType({
                internal: false,
                external: true,
              });
            }}
            label="External"
          />
        </div>
        <div className="flex flex-col min-h-[70%] ">
          {userType?.internal && (
            <div>
              <h1>
                Internal user informations added searching by Employee Id &
                Employee Name
              </h1>
            </div>
          )}
          {userType?.external && (
            <div className="flex flex-col xl:flex-row w-full h-80p">
              <div className="flex flex-col w-full xl:w-1/3 h-100p">
                {!boolStatus?.checkedStatus ? (
                  <div className="flex flex-col w-full  ">
                    <div className="flex w-full bg-white items-center justify-between p-2 rounded-t-lg">
                      <input
                        className="w-2/3 font-workSans text-black bg-primary95 mr-3 p-2 border-2 border-slate-300 rounded-lg outline-none focus:outline-none"
                        placeholder="Search by name / contact no / email"
                        value={personInfo?.searchKey}
                        onChange={(e) =>
                          setPersonInfo((prev: any) => ({
                            ...prev,
                            searchKey: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="flex bg-primary70  w-1/3 items-center justify-center font-workSans text-sm py-2 px-2 rounded-lg text-black hover:bg-primary40 hover:text-white"
                        onClick={() => {
                          setBoolStatus((prev) => ({
                            ...prev,
                            isAddNew: true,
                            isUpdate: false,
                          }));
                        }}
                      >
                        <FaPlus size={18} className="cursor-pointer mr-2" />
                        Add New Person
                      </button>
                    </div>
                    <div
                      className={`flex flex-col items-center bg-gray-100 h-96  ${
                        windowHeight > 750 ? "xl:h-90p" : "xl:h-70p"
                      } overflow-y-auto rounded-b-lg `}
                    >
                      {personInfo?.searchData &&
                        personInfo?.searchData?.length > 0 &&
                        personInfo.searchData?.map(
                          (person: any, personIndex: number) => {
                            const isFirst = personIndex === 0;
                            const isLast =
                              personIndex ===
                              personInfo?.searchData?.length - 1;

                            const firstStyle = isFirst && "mt-4";
                            const lastStyle = isLast && "mb-4";
                            const notLastStyle = !isLast && "mb-2";
                            const isSelected =
                              (personInfo.selectedPerson &&
                                personInfo.selectedPerson.personalPhoneNo ===
                                  person.personalPhoneNo &&
                                personInfo.selectedPerson.email ===
                                  person.email) ||
                              false;

                            return (
                              <SearchPersonCard
                                key={personIndex}
                                person={person}
                                isSelected={isSelected}
                                onSelect={() => handlePersonSelect(person)}
                                firstStyle={firstStyle}
                                lastStyle={lastStyle}
                                notLastStyle={notLastStyle}
                                onEdit={() => {
                                  setBoolStatus((prev) => ({
                                    ...prev,
                                    isUpdate: true,
                                  }));
                                }}
                                onDelete={() => {
                                  setBoolStatus((prev) => ({
                                    ...prev,
                                    isDelete: true,
                                  }));
                                  setPersonInfo((prev) => ({
                                    ...prev,
                                    personId: person?.personId,
                                  }));
                                }}
                                isChecked={boolStatus?.checkedStatus}
                                handleChecked={async (event: any) => {
                                  // const checked = event.target.checked;

                                  await setBoolStatus((prev) => ({
                                    ...prev,
                                    checkedStatus: event.target.checked,
                                  }));
                                  const isChecked = await event.target.checked;

                                  if (isChecked) {
                                    setPersonInfo((prev) => ({
                                      ...prev,
                                      checkedData: person,
                                    }));
                                  } else {
                                    setPersonInfo((prev) => ({
                                      ...prev,
                                      checkedData: null,
                                    }));
                                  }
                                }}
                              />
                            );
                          }
                        )}

                      {personInfo?.searchKey?.trim() &&
                        personInfo?.searchData?.length <= 0 && (
                          <div className="flex flex-col my-5 items-center justify-center ">
                            <p className="font-workSans text-red-500 text-md">
                              No person founds !
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <PersonCard
                    personData={personInfo?.checkedData}
                    cancelFunc={() => {
                      if (boolStatus?.isViewDetails) {
                        toast.error("Please close room details, first !");
                      } else {
                        setBoolStatus((prev) => ({
                          ...prev,
                          checkedStatus: false,
                        }));
                        setPersonInfo((prev) => ({
                          ...prev,
                          checkedData: null,
                        }));
                      }
                    }}
                  />
                )}
                {boolStatus?.checkedStatus && !boolStatus?.isViewDetails && (
                  <RoomInfoSelectCard
                    token={decodeToken?.token}
                    userId={decodeToken?.userId}
                    onAddSuccess={async (response) => {
                      if (response?.status == 200) {
                        await setBoolStatus((prev: any) => ({
                          ...prev,
                          isViewDetails: true,
                        }));
                        await setFetchData((prev) => ({
                          ...prev,
                          roomDetails: response?.data,
                        }));
                        await toast.success(response?.message);
                      } else {
                        toast.error("failed to fetch room details");
                      }
                    }}
                  />
                )}
                {boolStatus?.checkedStatus &&
                  boolStatus?.isViewDetails &&
                  fetchData?.roomDetails?.length > 0 && (
                    <RoomDetailsCard
                      rDetails={fetchData?.roomDetails[0]}
                      cancelFunc={() => {
                        setBoolStatus((prev) => ({
                          ...prev,
                          isViewDetails: false,
                        }));
                      }}
                    />
                  )}
              </div>
              <div className="flex w-full xl:w-2/3 xl:ml-4">
                <div className=" w-full bg-white p-4 rounded-lg shadow-lg shadow-slate-400">
                  <div className="my-3">
                    <label className=" text-black text-sm font-workSans mb-1">
                      Room Free
                    </label>
                    <div className="flex  bg-primary95 border-2 border-slate-200 rounded-lg p-2 w-full  xl:w-1/2 ">
                      <VertcialRadioBtn
                        label="Paid"
                        value={1}
                        name="Paid"
                        checked={paymentOptions?.paidOrNot === 1}
                        onChange={paidOrNotChange}
                      />
                      <VertcialRadioBtn
                        label="Free of cost"
                        value={2}
                        name="roomFee"
                        checked={paymentOptions?.paidOrNot === 2}
                        onChange={paidOrNotChange}
                        className="mx-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <AddNewPersonModal
            title={
              boolStatus?.isUpdate
                ? "Updated Person informations"
                : "Entrry New Persons Details"
            }
            isVisible={
              boolStatus?.isAddNew
                ? boolStatus?.isAddNew
                : boolStatus?.isUpdate
                ? boolStatus?.isUpdate
                : false
            }
            onCancel={() => {
              setBoolStatus((prev) => ({
                ...prev,
                isAddNew: false,
                isUpdate: false,
              }));
            }}
            userId={decodeToken?.userId}
            token={decodeToken?.token}
            onAddSuccess={(response: any) => {
              if (response.trim()) {
                setBoolStatus((prev) => ({
                  ...prev,
                  isAddNew: false,
                  isUpdate: false,
                }));
                setPersonInfo((prev) => ({ ...prev, searchKey: response }));
              }
            }}
            updateData={
              boolStatus?.isUpdate ? personInfo?.selectedPerson : null
            }
            isUpdate={boolStatus?.isUpdate}
          />
          <DeleteModal
            title="Do you want to delete ?"
            description="You're going to delete this person info ."
            onConfirm={personInfoDeleteFunc}
            onCancel={() => {
              setBoolStatus((prev) => ({ ...prev, isDelete: false }));
            }}
            isVisible={boolStatus?.isDelete}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default RoomAssignmentsPage;

interface comBtnInterface {
  className?: string;
  onClick?: () => void;
  label?: string;
}

const ComBtn: FC<comBtnInterface> = ({ className, onClick, label }) => {
  return (
    <button
      className={`${className} font-workSans text-md py-2 px-8 rounded-lg  mr-5`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
