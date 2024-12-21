import React, { FC, useEffect } from "react";
import Input from "../inputField/Input";
import SubmitButton from "../button/SubmitButton";
import MultilineInput from "../inputField/MultilineInput";

interface Props {
  onSubmitFunc?: (e: React.FormEvent<HTMLFormElement>) => void;
  formRef?: any;
  errorMsg?: string;
  initialData?: any;
}

const MakePostForm: FC<Props> = ({
  onSubmitFunc,
  formRef,
  errorMsg,
  initialData,
}) => {
  // Populate form with initialData if available
  useEffect(() => {
    if (formRef?.current && initialData) {
      Object.keys(initialData).forEach((key) => {
        const field = formRef.current.elements.namedItem(key);
        if (field) {
          field.value = initialData[key] ?? "";
        }
      });
    }
  }, [initialData, formRef]);

  return (
    <div className="flex items-center justify-center py-4">
      <div className="text-xl text-red-500 text-center">
        {errorMsg && errorMsg}
      </div>
      <form
        onSubmit={onSubmitFunc}
        ref={formRef}
        className="flex w-full md:w-9/12 flex-col bg-primary justify-center gap-y-4 border border-primary80 rounded-2xl p-4"
      >
        <div className="flex flex-col">
          <h1 className="text-center text-black text-3xl my-4 font-arima">
            Make Post
          </h1>

          <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
            <Input
              label="Title"
              name="title"
              placeholder="Post Title"
              required
            />
            <Input
              label="Company Name"
              name="companyName"
              placeholder="Company Name (Optional)"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
            <Input
              label="Co-title"
              name="coTitle"
              placeholder="Co-title here"
              required
            />
            <Input
              label="No of Post"
              name="noOfVacancy"
              placeholder="No of Post"
              type="number"
              required
            />
          </div>

          <MultilineInput
            multiline={true}
            label="Post Introductions"
            name="postIntroductions"
            placeholder="Post Introductions"
            required
          />
          <MultilineInput
            multiline={true}
            label="Post Description"
            name="postDescription"
            placeholder="Post Description"
            required
          />
          <MultilineInput
            multiline={true}
            label="Post Responsibilities"
            name="postResponsibilites"
            placeholder="Post Responsibilites"
            required
          />
          <MultilineInput
            multiline={true}
            label="Required Fields"
            name="requiredFields"
            placeholder="Required Fields"
            required
          />

          <MultilineInput
            multiline={true}
            label="Post Goals"
            name="postGoals"
            placeholder="Post Goals"
            required
          />

          {/* Radio Buttons for Account Type */}
          <div className="flex w-full items-center justify-between mb-4">
            <label className="w-3/12 md:w-2/12 flex items-end font-workSans text-black pr-2">
              Account Type
            </label>
            <div className="w-2/3 md:w-10/12 flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="accountType"
                  value="1"
                  className="w-5 h-5"
                  required
                />
                <span className="font-workSans text-black">1st Post</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="accountType"
                  value="2"
                  className="w-5 h-5"
                  required
                />
                <span className="font-workSans text-black">2nd Post</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="accountType"
                  value="3"
                  className="w-5 h-5"
                  required
                />
                <span className="font-workSans text-black">3rd Post</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="accountType"
                  value="4"
                  className="w-5 h-5"
                  required
                />
                <span className="font-workSans text-black">4th Post</span>
              </label>
            </div>
          </div>

          <MultilineInput
            label="Issue Post"
            name="jobSalary"
            placeholder="Issue Post"
            required
          />

          <div className=" ">
            <MultilineInput
              multiline={true}
              label="Co. Info"
              name="coInfo"
              placeholder="Co Info"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex w-full items-center justify-center">
            <SubmitButton label="Make Post" loading="Post Creating...." />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MakePostForm;

// "use client";
// import React, { FC } from "react";
// import Input from "../inputField/Input";
// import SubmitButton from "../button/SubmitButton";
// import MultilineInput from "../inputField/MultilineInput";

// import "react-datepicker/dist/react-datepicker.css";

// interface Props {
//   onSubmitFunc?: (e: React.FormEvent<HTMLFormElement>) => void;
//   formRef?: any;
//   errorMsg?: string;
// }

// const MakePostForm: FC<Props> = ({ onSubmitFunc, formRef, errorMsg }) => {
//   return (
//     <div className="flex items-center justify-center py-4">
//       <div className="text-xl text-red-500 text-center">
//         {errorMsg && errorMsg}
//       </div>
//       <form
//         onSubmit={onSubmitFunc}
//         ref={formRef}
//         className="flex w-full md:w-9/12 flex-col bg-primary justify-center gap-y-4 border border-primary80 rounded-2xl p-4"
//       >
//         <div className="flex flex-col">
//           <h1 className="text-center text-black text-3xl my-4 font-arima">
//             Make Post
//           </h1>

//           <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
//             <Input
//               label="Title"
//               name="title"
//               placeholder="Post Title"
//               required
//             />
//             <Input
//               label="Company Name"
//               name="companyName"
//               placeholder="Company Name (Optional)"
//             />
//           </div>

//           <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
//             <Input
//               label="Co-title"
//               name="coTitle"
//               placeholder="Co-title here"
//               required
//             />
//             <Input
//               label="No of Post"
//               name="noOfVacancy"
//               placeholder="No of Post"
//               type="number"
//               required
//             />
//           </div>

//           <MultilineInput
//             multiline={true}
//             label="Post Introductions"
//             name="postIntroductions"
//             placeholder="Post Introductions"
//             required
//           />
//           <MultilineInput
//             multiline={true}
//             label="Post Description"
//             name="postDescription"
//             placeholder="Post Description"
//             required
//           />
//           <MultilineInput
//             multiline={true}
//             label="Post Responsibilities"
//             name="postResponsibilites"
//             placeholder="Post Responsibilites"
//             required
//           />
//           <MultilineInput
//             multiline={true}
//             label="Required Fields"
//             name="requiredFields"
//             placeholder="Required Fields"
//             required
//           />

//           <MultilineInput
//             multiline={true}
//             label="Post Goals"
//             name="postGoals"
//             placeholder="Post Goals"
//             required
//           />

//           {/* Radio Buttons for Account Type */}
//           <div className="flex w-full items-center justify-between mb-4">
//             <label className="w-3/12 md:w-2/12 flex items-end font-workSans text-black pr-2">
//               Account Type
//             </label>
//             <div className="w-2/3 md:w-10/12 flex space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="1"
//                   className="w-5 h-5"
//                   required
//                 />
//                 <span className="font-workSans text-black">1st Post</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="2"
//                   className="w-5 h-5"
//                   required
//                 />
//                 <span className="font-workSans text-black">2nd Post</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="3"
//                   className="w-5 h-5"
//                   required
//                 />
//                 <span className="font-workSans text-black">3rd Post</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="accountType"
//                   value="4"
//                   className="w-5 h-5"
//                   required
//                 />
//                 <span className="font-workSans text-black">4th Post</span>
//               </label>
//             </div>
//           </div>

//           <MultilineInput
//             label="Issue Post"
//             name="issuePost"
//             placeholder="Issue Post"
//             required
//           />

//           <div className=" ">
//             <MultilineInput
//               multiline={true}
//               label="Co. Info"
//               name="coInfo"
//               placeholder="Co Info"
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="flex w-full items-center justify-center">
//             <SubmitButton label="Make Post" loading="Post Creating...." />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MakePostForm;
