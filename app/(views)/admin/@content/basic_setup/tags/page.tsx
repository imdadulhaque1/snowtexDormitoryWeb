"use client";

import AreaSubmitForm from "@/app/_components/Form/AreaSubmitForm";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

interface Props {}
interface tagInterface {
  _id: string;
  tagId: number;
  name: string;
  isApprove: boolean;
  isActive: boolean;
  createdBy: string;
  createdTime: string;
  __v: number;
}

const TagPage: FC<Props> = (props) => {
  const [tagName, setTagName] = useState("");

  const [tag, setTag] = useState({
    tagPostError: "",
    tagGetError: "",
    getTags: [],
    expandTag: false,
    expandTagObj: null,
  });

  const handleTagSubmit = async (formData: FormData) => {
    const newTag = {
      name: formData.get("name")?.toString(),
    };

    const response = await fetch("/api/admin/basic_setup/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTag),
    });

    if (response.ok) {
      toast.success("Tag has been created");
      getTags();
    } else {
      const errorText = await response.json();
      toast.error(errorText?.error?.toString());
      setTag((prevErr) => ({
        ...prevErr,
        tagPostError: errorText?.error?.toString(),
      }));

      throw new Error(errorText?.error?.toString());
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    try {
      const response = await fetch("/api/admin/basic_setup/tags");
      const data = await response.json();
      setTag((prev) => ({ ...prev, getTags: data }));
    } catch (error: any) {
      setTag((prev) => ({ ...prev, tagGetError: error.message }));
    }
  };

  const updateTags = async (tagObj: any) => {
    if (tagName?.trim() && tagObj.tagId) {
      try {
        const updatedTag = {
          tagId: tagObj.tagId,
          name: tagName,
        };

        // Send PATCH request
        const response = await fetch("/api/admin/basic_setup/tags", {
          method: "PUT",
          body: JSON.stringify(updatedTag),
        });

        const data = await response.json();
        if (response.ok) {
          getTags();
          toast.success("Tag has been updated successfully !");
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to update tag.");
        }

        setTag((prev) => ({
          ...prev,
          expandTag: false,
          expandTagObj: null,
        }));

        setTagName("");
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }
  };
  const tagDelete = async (tagId: any) => {
    try {
      const res = await fetch("/api/admin/basic_setup/tags", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId }),
      });
      if (res?.ok) {
        getTags();
        setTag((prev) => ({
          ...prev,
          expandTag: false,
          expandTagObj: null,
        }));

        setTagName("");
        toast.error("Tag successfully deleted !");
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
        addHoverText="Add Tags"
        updateHoverText="Update tags"
        updateClosedHoverText="Close to update tags"
        isDisabled={false}
        placeholder="Enter Tags"
        // @ts-ignore
        onSubmit={(formData) => {
          if (!tag?.expandTag) {
            return handleTagSubmit(formData);
          }
          updateTags(tag?.expandTagObj);
        }}
        errorMessage={tag.tagPostError}
        value={tagName}
        onValueChange={setTagName}
        isUpdated={tag.expandTag}
        notUpdateFunc={() => {
          setTag((prev) => ({
            ...prev,
            expandTag: false,
            expandTagObj: null,
          }));

          setTagName("");
        }}
      />
      <div className="flex flex-wrap items-center">
        {tag?.getTags &&
          tag?.getTags?.length > 0 &&
          tag?.getTags?.map((tagItem: any, index: number) => {
            return (
              <div
                key={index}
                className="flex items-center justify-center bg-primary90  rounded-md m-2 cursor-pointer "
              >
                <button
                  onClick={() => {
                    console.log("tagItem: ", tagItem?.tagId);
                    setTagName(tagItem.name);
                    setTag((prev) => ({
                      ...prev,
                      expandTag: true,
                      expandTagObj: tagItem,
                    }));
                  }}
                  className="bg-primary90 p-2 rounded-md h-full hover:bg-primary80 hover:text-white font-workSans text-md text-black"
                >
                  {tagItem.name}
                </button>
                {tag?.expandTag &&
                  tag?.expandTagObj?.tagId === tagItem.tagId && (
                    <div className="flex pl-4 h-full items-center justify-center ">
                      <div className="relative group items-center">
                        <MdDelete
                          onClick={() => tagDelete(tagItem.tagId)}
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

export default TagPage;
