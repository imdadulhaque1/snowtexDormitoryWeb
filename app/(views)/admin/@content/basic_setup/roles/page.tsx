"use client";
import AreaSubmitForm from "@/app/_components/Form/AreaSubmitForm";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

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
  const [roleName, setRoleName] = useState("");

  const [roles, setRoles] = useState({
    rolePostError: "",
    roleGetError: "",
    getRoles: [],
    expandRole: false,
    expandRoleObj: null,
  });

  const handleRoleSubmit = async (formData: FormData) => {
    const newRole = {
      name: formData.get("name")?.toString(),
    };

    const response = await fetch("/api/admin/basic_setup/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRole),
    });

    if (response.ok) {
      toast.success("Role has been created");
      getRolesFunc();
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

  useEffect(() => {
    getRolesFunc();
  }, []);

  const getRolesFunc = async () => {
    try {
      const response = await fetch("/api/admin/basic_setup/roles");
      const data = await response.json();
      setRoles((prev) => ({ ...prev, getRoles: data }));
    } catch (error: any) {
      setRoles((prev) => ({ ...prev, roleGetError: error.message }));
    }
  };
  const updateTags = async (roleObj: any) => {
    if (roleName?.trim() && roleObj.roleId) {
      try {
        const updatedRole = {
          roleId: roleObj.roleId,
          name: roleName,
        };

        // Send PATCH request
        const response = await fetch("/api/admin/basic_setup/roles", {
          method: "PUT",
          body: JSON.stringify(updatedRole),
        });

        const data = await response.json();
        if (response.ok) {
          getRolesFunc();
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
  const deleteRole = async (roleId: any) => {
    try {
      const res = await fetch("/api/admin/basic_setup/roles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleId: roleId }),
      });
      if (res?.ok) {
        getRolesFunc();
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
    <div className="flex-col min-h-screen bg-gradient-to-b from-primary to-primary90 p-4">
      <AreaSubmitForm
        addHoverText="Add Roles"
        updateHoverText="Update roles"
        updateClosedHoverText="Close to update roles"
        isDisabled={false}
        placeholder="Enter Roles"
        // @ts-ignore
        onSubmit={(formData) => {
          if (!roles?.expandRole) {
            return handleRoleSubmit(formData);
          }
          updateTags(roles?.expandRoleObj);
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
                className="flex items-center justify-center bg-primary90  rounded-md m-2 cursor-pointer"
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
                  className="bg-primary90 p-2 rounded-md h-full hover:bg-primary80 hover:text-white font-workSans text-md text-black"
                >
                  {roleItem.name}
                </button>
                {roles?.expandRole &&
                  // @ts-ignore
                  roles?.expandRoleObj?.roleId === roleItem.roleId && (
                    <div className="flex pl-4 h-full items-center justify-center ">
                      <div className="relative group items-center">
                        <MdDelete
                          onClick={() => deleteRole(roleItem.roleId)}
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
