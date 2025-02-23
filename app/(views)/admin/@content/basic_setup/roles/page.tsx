"use client";
import AreaSubmitForm from "@/app/_components/Form/AreaSubmitForm";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import jwtDecode from "jsonwebtoken";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import { useAppContext } from "@/app/_stateManagements/contextApi";

interface Props {}
interface rolesInterface {
  _id: string;
  roleId: number;
  name: string;
  isApprove: boolean;
  approvedBy: string;
  isActive: boolean;
  createdBy: string;
  createdTime: string;
  __v: number;
}

const RolesPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [roleName, setRoleName] = useState("");

  const [roles, setRoles] = useState({
    rolePostError: "",
    roleGetError: "",
    getRoles: [],
    expandRole: false,
    expandRoleObj: null,
  });

  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
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

    if (decodeToken?.token && decodeToken?.userId) {
      getRolesFunc(decodeToken?.token);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const handleRoleSubmit = async (formData: FormData, userId: any) => {
    const newRole = {
      name: formData.get("name")?.toString(),
      createdBy: userId.toString(),
    };

    const response = await fetch(AppURL.roleApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken?.token}`,
      },
      body: JSON.stringify(newRole),
    });

    if (response.ok) {
      toast.success("Role has been created");
      getRolesFunc(decodeToken?.token);
    } else {
      const errorText = await response.json();
      toast.error(errorText?.error?.toString());
      setRoles((prevErr) => ({
        ...prevErr,
        rolePostError: errorText?.error?.toString(),
      }));

      throw new Error(errorText?.error?.toString());
    }
  };

  const getRolesFunc = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roleApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await setRoles((prev) => ({ ...prev, getRoles: data?.roles }));
    } catch (error: any) {
      setRoles((prev) => ({ ...prev, roleGetError: error.message }));
    }
  };
  const updateTags = async (roleObj: any, userId: any) => {
    if (roleName?.trim() && roleObj.roleId) {
      try {
        const updatedRole = {
          name: roleName,
          updatedBy: userId.toString(),
        };

        // Send PATCH request
        const response = await fetch(`${AppURL.roleApi}/${roleObj.roleId}`, {
          method: "PUT",
          body: JSON.stringify(updatedRole),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decodeToken?.token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          getRolesFunc(decodeToken?.token);
          toast.success("Role has been updated successfully !");
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to update role.");
        }

        setRoles((prev) => ({
          ...prev,
          expandRole: false,
          expandRoleObj: null,
        }));

        setRoleName("");
      } catch (error) {
        console.error("Error updating Role:", error);
      }
    }
  };
  const deleteRole = async (roleId: any, token: string) => {
    try {
      const res = await fetch(`${AppURL.roleApi}/${roleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.ok) {
        getRolesFunc(decodeToken?.token);
        setRoles((prev) => ({
          ...prev,
          expandRole: false,
          expandRoleObj: null,
        }));

        setRoleName("");
        toast.error("Role successfully deleted !");
      } else {
        const errorData = await res.json();
        console.log("Error deleting Tags:", errorData.error);
      }
    } catch (error: any) {
      console.log("Error deleting tag:", error?.message);
    }
  };

  return (
    <div className={`flex-col ${getDrawerStatus ? "pl-[265px]" : "pl-0"} p-4 `}>
      <AreaSubmitForm
        addHoverText="Add Roles"
        updateHoverText="Update roles"
        updateClosedHoverText="Close to update roles"
        isDisabled={false}
        placeholder="Enter Roles"
        // @ts-ignore
        onSubmit={(formData) => {
          if (!roles?.expandRole && decodeToken.userId) {
            return handleRoleSubmit(formData, decodeToken.userId);
          }
          decodeToken.userId &&
            updateTags(roles?.expandRoleObj, decodeToken.userId);
        }}
        errorMessage={roles.rolePostError}
        value={roleName}
        onValueChange={setRoleName}
        isUpdated={roles.expandRole}
        notUpdateFunc={() => {
          setRoles((prev) => ({
            ...prev,
            expandRole: false,
            expandRoleObj: null,
          }));

          setRoleName("");
        }}
      />
      <div className="flex flex-wrap items-center">
        {roles?.getRoles &&
          roles?.getRoles?.length > 0 &&
          roles?.getRoles?.map((roleItem: any, index: number) => {
            return (
              <div
                key={index}
                className="flex items-center justify-center bg-slate-300  rounded-md m-2 cursor-pointer"
              >
                <button
                  onClick={() => {
                    setRoleName(roleItem.name);
                    setRoles((prev) => ({
                      ...prev,
                      expandRole: true,
                      expandRoleObj: roleItem,
                    }));
                  }}
                  className="bg-slate-300 p-2 rounded-md h-full hover:bg-slate-400 hover:text-white font-workSans text-sm text-black"
                >
                  {roleItem.name}
                </button>
                {roles?.expandRole &&
                  // @ts-ignore
                  roles?.expandRoleObj?.roleId === roleItem.roleId && (
                    <div className="flex pl-4 h-full items-center justify-center ">
                      <div className="relative group items-center">
                        <MdDelete
                          onClick={() =>
                            decodeToken?.token &&
                            deleteRole(roleItem.roleId, decodeToken?.token)
                          }
                          className=" text-errorColor hover:text-red-500 cursor-pointer  shadow-xl shadow-white"
                          size={25}
                          style={{ marginRight: 1 }}
                        />

                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                          Delete tag ?
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RolesPage;
