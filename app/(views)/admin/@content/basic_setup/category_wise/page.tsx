"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { FaRegWindowClose } from "react-icons/fa";
import { decodeToken } from "@/app/_utils/handler/decodeToken";
import AppURL from "@/app/_restApi/AppURL";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import { COLORS } from "@/app/_utils/COLORS";
import CategoryTable from "@/app/_components/table/CategoryTable";

interface Props {}

const CategorywisePage: FC<Props> = () => {
  const [category, setCategory] = useState({
    name: "",
    relatedTags: [] as { tagId: number; name: string }[],
  });
  const [tag, setTag] = useState({
    tagGetError: "",
    getTags: [] as any[],
  });
  const [historyData, setHistoryData] = useState({
    projectHistoryTxt: "",
  });

  const [categoryReq, setCategoryReq] = useState({
    getData: [],
    isUpdateCategory: false,
    categoryId: null,
    categoryName: "",
    categoryTags: [],
  });

  const [getToken, setGetToken] = useState(null);

  const decodeUserId = getToken ? decodeToken(getToken) : null;

  const retrieveToken = async () => {
    try {
      const response = await fetch(AppURL.retrieveCookieToken, {
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        setGetToken(data.token);
      } else {
        console.log("Error retrieving token:", data.message);
        // return data.message;
      }
    } catch (error: any) {
      console.log("Fetch failed:", error);
      // return error?.message;
    }
  };

  useEffect(() => {
    if (!getToken) {
      retrieveToken();
    }
    if (getToken) {
      getCategoryFunc(getToken);
      getTags(getToken);
    }
  }, [getToken]);

  const getTags = async (token: any) => {
    try {
      const response = await fetch(`${AppURL.tagApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTag((prev) => ({ ...prev, getTags: data?.tags, tagGetError: "" }));
    } catch (error: any) {
      setTag((prev) => ({ ...prev, tagGetError: error.message }));
    }
  };

  const getCategoryFunc = async (token: any) => {
    try {
      // const response = await fetch("/api/admin/basic_setup/category_wise");
      const response = await fetch(`${AppURL.categoryApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Data: ", JSON.stringify(data, null, 2));

      setCategoryReq((prevItem) => ({
        ...prevItem,
        getData: data?.categories,
        getError: "",
      }));
    } catch (error: any) {
      setCategoryReq((prevItem) => ({ ...prevItem, getError: error.message }));
    }
  };

  const filteredTags =
    historyData?.projectHistoryTxt?.trim() &&
    tag.getTags &&
    tag.getTags.filter((t: any) =>
      t.name.toLowerCase().includes(historyData.projectHistoryTxt.toLowerCase())
    );

  const handleTagSelection = (tagObj: any) => {
    setCategory((prev: any) => ({
      ...prev,
      relatedTags: prev.relatedTags.some((t: any) => t.tagId === tagObj.tagId)
        ? prev.relatedTags
        : [...prev.relatedTags, { tagId: tagObj.tagId, name: tagObj.name }],
    }));
  };

  const removeTag = (tagId: number) => {
    setCategory((prev) => ({
      ...prev,
      relatedTags: prev.relatedTags.filter((tag) => tag.tagId !== tagId),
    }));
  };

  const submitCategoryFunc = async (e: React.FormEvent) => {
    const categoryData = await {
      name: category.name,
      categoryTags: category.relatedTags,
      userId: decodeUserId,
    };

    try {
      const response = await fetch(`${AppURL.categoryApi}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        getCategoryFunc(getToken);
        toast.success("Category has been created");
        setTimeout(() => {
          setCategory({
            name: "",
            relatedTags: [],
          });
        }, 200);
      } else {
        const errorText = await response.json();
        toast.error(errorText?.message);
        // toast.error("Failed to create category !");
      }
    } catch (error: any) {
      console.log("Error creating category:", error?.message);
    }
  };

  const size = useWindowSize();
  const windowWidth: any = size && size?.width;

  const handleEditCategory = (catObj: any) => {
    setCategory({
      name: catObj.name,
      relatedTags: catObj.categoryTags || [],
    });
    setCategoryReq((prev) => ({
      ...prev,
      isUpdateCategory: true,
      categoryId: catObj.categoryId,
    }));
  };

  const updateCategoryFunc = async () => {
    // categoryId: categoryReq?.categoryId,
    const updatedCategory = await {
      name: category?.name?.trim(),
      categoryTags: category?.relatedTags,
      userId: decodeUserId,
    };

    try {
      const response = await fetch(
        `${AppURL.categoryApi}?id=${categoryReq?.categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken}`,
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (response.ok) {
        getCategoryFunc(getToken);

        toast.success("Category has been updated");
        notUpdateFunc();
      } else {
        toast.error("Failed to update category !");
      }
    } catch (error) {
      toast.error("Failed to update category. Try again !");
    }
  };

  const notUpdateFunc = async () => {
    setCategory({
      name: "",
      relatedTags: [],
    });
    setCategoryReq((prev) => ({
      ...prev,
      isUpdateCategory: false,
      categoryId: null,
    }));
  };

  const categoryDeleteFunc = async (categoryId: string | number) => {
    try {
      const res = await fetch(`${AppURL.categoryApi}?id=${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken}`,
        },
        body: JSON.stringify({ userId: decodeUserId }),
      });
      if (res?.ok) {
        getCategoryFunc(getToken);
        toast.success("Category successfully deleted !");
      } else {
        const errorData = await res.json();
        toast.error(errorData?.error?.toString());
      }
    } catch (error: any) {
      console.log("Error deleting Category:", error?.message);
    }
  };

  return (
    <div className="flex flex-col fixed h-screen w-screen bg-gradient-to-b from-primary to-primary90 py-5">
      <div className="flex items-center justify-between w-1/2 px-4">
        <div className={`mb-3 w-11/12`}>
          <VerticalSingleInput
            label="Category Name"
            type="text"
            name="categoryName"
            placeholder="Enter category name..."
            // @ts-ignore
            value={category.name}
            onChange={(e: any) =>
              setCategory((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <div className="my-4">
            <label className="text-black text-md font-workSans mb-1">
              Category Tags
            </label>
            <div className="flex flex-wrap items-center bg-primary95 border border-gray-300 rounded-md px-2 py-1">
              {category.relatedTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => removeTag(tag.tagId)}
                  className="flex items-center bg-primary90 text-black font-workSans text-sm px-3 py-1 mr-1 my-1 rounded-full hover:bg-errorLight85"
                >
                  {tag.name}
                </button>
              ))}

              <div className="flex w-full items-center justify-between">
                <input
                  type="text"
                  name="projectHistoryInput"
                  placeholder="Add related category tags..."
                  className="flex-1 border-none outline-none focus:outline-none p-1 font-workSans mt-3 bg-primary95"
                  value={historyData.projectHistoryTxt}
                  onChange={(e) =>
                    setHistoryData({
                      projectHistoryTxt: e.target.value,
                    })
                  }
                />
                {historyData.projectHistoryTxt && (
                  <button
                    onClick={() => {
                      const matchingTag = tag.getTags.find(
                        (t) =>
                          t.name.toLowerCase() ===
                          historyData.projectHistoryTxt.toLowerCase()
                      );
                      if (matchingTag) {
                        handleTagSelection(matchingTag);
                      } else {
                        handleTagSelection({
                          tagId: null,
                          name: historyData.projectHistoryTxt,
                        });
                      }
                      setHistoryData({ projectHistoryTxt: "" });
                    }}
                    className="font-workSans text-sm bg-green-200 px-3 py-1 rounded-xl hover:bg-green-300"
                  >
                    Add Tag ?
                  </button>
                )}
              </div>
            </div>

            {filteredTags && filteredTags.length > 0 && (
              <div className="flex flex-wrap items-center bg-slate-300 rounded-md px-3 pt-3">
                {filteredTags.map((tag, index) => (
                  <div
                    key={index}
                    onClick={() => handleTagSelection(tag)}
                    className="flex items-center gap-2 bg-primary80 px-3 py-1 mr-3 mb-3 rounded-md border-2 border-primary80 cursor-pointer hover:bg-primary90 hover:border-primary85"
                  >
                    <p className="text-black font-workSans text-sm">
                      {tag.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {!categoryReq?.isUpdateCategory ? (
          <div className="ml-5 relative group">
            <button onClick={submitCategoryFunc} className="relative">
              <IoIosAddCircleOutline
                color={COLORS.primary96}
                size={30}
                className="cursor-pointer bg-primary50 rounded-full shadow-xl shadow-white"
              />
            </button>

            {/* Tooltip text */}
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
              Category Add
            </span>
          </div>
        ) : (
          <div className=" ml-5 flex items-center">
            <div className="relative group ">
              <button onClick={updateCategoryFunc}>
                <MdOutlineSystemUpdateAlt
                  color={COLORS.primary70}
                  size={35}
                  className="cursor-pointer  shadow-xl shadow-white"
                />
              </button>

              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                Update Category
              </span>
            </div>

            <div className="relative group mb-2">
              <FaRegWindowClose
                onClick={notUpdateFunc}
                color={COLORS.errorColor}
                size={30}
                className=" ml-2 cursor-pointer  shadow-xl shadow-white"
              />

              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                close to skip update
              </span>
            </div>
          </div>
        )}
      </div>
      <div
        className={`px-4  ${
          windowWidth <= 850
            ? "w-[100%]"
            : windowWidth > 850 && windowWidth <= 1350
            ? "w-[90%]"
            : "w-[80%]"
        }  overflow-y-auto max-h-[calc(100vh-200px)]`}
      >
        {categoryReq.getData && categoryReq.getData?.length > 0 && (
          <CategoryTable
            data={categoryReq.getData}
            onEdit={handleEditCategory}
            onDelete={(catId: string | number) => {
              categoryDeleteFunc(catId);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CategorywisePage;
