"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import Button from "@/app/_components/button/Button";
import toast from "react-hot-toast";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import {
  isEmailValid,
  isValidBDTelephone,
} from "@/app/_utils/handler/validateBDTelephone ";
import { COLORS } from "@/app/_utils/COLORS";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { FaPlus, FaEdit, FaRegWindowClose } from "react-icons/fa";
import AddNewPersonModal from "@/app/_components/modal/AddNewPersonModal";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import SearchPersonCard from "@/app/_components/card/SearchPersonCard";
import DeleteModal from "@/app/_components/modal/DeletedModal";

interface Props {}

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
  });

  const [personInfo, setPersonInfo] = useState({
    personId: null,
    searchKey: "",
    searchData: [],
    selectedPerson: null,
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
    //   // getBuildingsFunc(decodeToken?.token);
    //   fetchPaidItems(decodeToken?.token);
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

  const handlePersonSelect = (selectedPerson: any) => {
    setPersonInfo((prev: any) => ({
      ...prev,
      selectedPerson: selectedPerson,
    }));
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

  const size = useWindowSize();
  const windowHeight: any = size && size?.height;
  console.log("window height: ", windowHeight);

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
              <div className="flex w-full xl:w-1/3 h-100p">
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
                            personIndex === personInfo?.searchData?.length - 1;

                          const firstStyle = isFirst && "mt-4";
                          const lastStyle = isLast && "mb-4";
                          const notLastStyle = !isLast && "mb-2";
                          const isSelected =
                            personInfo.selectedPerson &&
                            personInfo.selectedPerson.personalPhoneNo ===
                              person.personalPhoneNo &&
                            personInfo.selectedPerson.email === person.email;

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
              </div>
              <div className="flex w-full xl:w-2/3 xl:ml-4">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Explicabo enim porro, laboriosam numquam nostrum repellat
                  atque deserunt dolores aperiam quas perferendis repellendus
                  rem, corrupti vitae qui tempore nisi, sed eum.
                </p>
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
