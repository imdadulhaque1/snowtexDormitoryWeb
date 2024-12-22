"use client";
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import MakePostForm from "@/app/_components/Form/MakePostForm";

const AdminMakePostPage: FC = () => {
  const [jobPost, setJobPost] = useState({
    postErrorMsg: "",
    getPostLoading: false,
    getPostData: [],
    getPostErrorMsg: "",
  });
  const [editingPost, setEditingPost] = useState<any>(null); // State for editing post
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch all posts data
  const getPostData = async () => {
    setJobPost((prev) => ({ ...prev, getPostLoading: true }));
    try {
      const res = await fetch("/api/admin/makepost");
      const data = await res.json();
      if (data) {
        setJobPost((prev) => ({
          ...prev,
          getPostData: data,
          getPostErrorMsg: "",
        }));
      }
    } catch (error: any) {
      setJobPost((prev) => ({ ...prev, getPostErrorMsg: error.message }));
    } finally {
      setJobPost((prev) => ({ ...prev, getPostLoading: false }));
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  // Handle form submission (create/update post)
  const submitFunc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const formDataObj = editingPost
        ? {
            postId: editingPost.postId,
            title: formData.get("title")?.toString(),
            companyName: formData.get("companyName")?.toString(),
            coTitle: formData.get("coTitle")?.toString(),
            noOfVacancy: formData.get("noOfVacancy")?.toString(),
            postIntroductions: formData.get("postIntroductions")?.toString(),
            postDescription: formData.get("postDescription")?.toString(),
            postResponsibilites: formData
              .get("postResponsibilites")
              ?.toString(),
            requiredFields: formData.get("requiredFields")?.toString(),
            postGoals: formData.get("postGoals")?.toString(),
            accountType: formData.get("accountType")?.toString(),
            jobSalary: formData.get("issuePost")?.toString(),
            coInfo: formData.get("coInfo")?.toString(),
          }
        : {
            title: formData.get("title")?.toString(),
            companyName: formData.get("companyName")?.toString(),
            coTitle: formData.get("coTitle")?.toString(),
            noOfVacancy: formData.get("noOfVacancy")?.toString(),
            postIntroductions: formData.get("postIntroductions")?.toString(),
            postDescription: formData.get("postDescription")?.toString(),
            postResponsibilites: formData
              .get("postResponsibilites")
              ?.toString(),
            requiredFields: formData.get("requiredFields")?.toString(),
            postGoals: formData.get("postGoals")?.toString(),
            accountType: formData.get("accountType")?.toString(),
            jobSalary: formData.get("issuePost")?.toString(),
            coInfo: formData.get("coInfo")?.toString(),
          };

      const method = editingPost ? "PUT" : "POST";
      const endpoint = "/api/admin/makepost";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataObj),
      });

      if (res.ok) {
        setJobPost((prev) => ({ ...prev, postErrorMsg: "" }));
        toast.success(
          editingPost ? "Post has been updated" : "Post has been created"
        );
        getPostData();
        formRef.current?.reset();
        setEditingPost(null); // Reset after update
      }
    } catch (error: any) {
      setJobPost((prev) => ({ ...prev, postErrorMsg: error.message }));
    }
  };

  // Set the post data for editing
  const postUpdateFunc = (postData: any) => {
    setEditingPost(postData);
  };

  // Handle post deletion
  const postDeleteFunc = async (postData: any) => {
    const deletePost = { postId: postData.postId };
    try {
      const res = await fetch(`/api/admin/makepost`, {
        method: "DELETE",
        body: JSON.stringify(deletePost),
      });

      if (res.ok) {
        toast.error("Post has been deleted");
        getPostData();
      }
    } catch (error: any) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="h-full w-full justify-center items-center bg-gradient-to-b from-primary to-primary90 overflow-y-scroll">
        <MakePostForm
          onSubmitFunc={submitFunc}
          formRef={formRef}
          errorMsg={jobPost?.postErrorMsg}
          initialData={editingPost}
        />

        {/* Display Posts */}
        <div className="flex w-full justify-center items-center px-4">
          <div className="flex flex-wrap justify-center items-center max-h-96 overflow-y-scroll w-full">
            {jobPost?.getPostData &&
              jobPost?.getPostData.length > 0 &&
              jobPost?.getPostData.map((post: any) => (
                <div
                  key={post.postId}
                  className="flex flex-col md:w-30p bg-white mr-3 rounded-md p-4 mb-2 border-2 hover:bg-primary95 hover:border-white hover:text-white relative transition duration-200 group shadow-lg"
                >
                  <h1 className="font-semibold">{post.title}</h1>
                  <div className="flex">
                    <p className="mr-4 font-workSans">
                      Company: {post.companyName}
                    </p>
                    <p className="font-workSans">Post No: {post.noOfVacancy}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-4 font-workSans">
                      Post Type: {post.accountType}
                    </p>
                    <p className="font-workSans">
                      Post Amount: {post.jobSalary}
                    </p>
                  </div>
                  <div
                    className="absolute top-1/3 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ right: "45%" }}
                  >
                    <FaEdit
                      onClick={() => postUpdateFunc(post)}
                      size={28}
                      className="ml-2 cursor-pointer shadow-xl shadow-white text-primary80 hover:text-primary50 mr-3"
                    />
                    <FaTrash
                      onClick={() => postDeleteFunc(post)}
                      size={25}
                      className="ml-2 cursor-pointer shadow-xl shadow-white text-errorColor hover:text-red-500"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default AdminMakePostPage;
