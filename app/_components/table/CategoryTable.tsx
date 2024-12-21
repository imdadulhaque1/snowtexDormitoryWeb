import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CategoryTableInterface } from "../../../../interface/admin/category/CategoryTableInterface";

interface TableProps {
  data: CategoryTableInterface[];
  onEdit: (obj: any) => void;
  onDelete: (id: string | number) => void;
}

const CategoryTable: React.FC<TableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-md">
      <table className="table-auto w-full border-collapse border border-gray-300 ">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-1/12 px-4 py-2 border">SL</th>
            <th className="w-1/12 px-4 py-2 border">ID</th>
            <th className="w-2/12 px-4 py-2 border">Category Name</th>
            <th className="w-2/12 px-4 py-2 border">Category Tags</th>
            <th className="w-1/12 px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const isLastItem = index === data.length - 1;
            return (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border text-center">
                  {item.categoryId}
                </td>
                <td className="px-4 py-2 border text-center">{item.name}</td>
                <td className=" px-4 py-2 border text-center">
                  <div className="flex flex-wrap items-center justify-center ">
                    {item.categoryTags &&
                      item.categoryTags.length > 0 &&
                      item.categoryTags.map((tag, index) => {
                        return (
                          <div key={index} className="py-1">
                            <span
                              key={index}
                              className="text-sm bg-primary90 text-black font-workSans px-2 py-1 mr-1  rounded-full cursor-pointer hover:bg-primary85"
                            >
                              {tag.name}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </td>
                <td
                  className={`px-4 py-2 border text-center  ${
                    !isLastItem && "border-b"
                  } `}
                >
                  <div className="flex items-center justify-center">
                    <FaEdit
                      className="text-xl md:text-2xl text-primary75 cursor-pointer hover:text-primary50 mr-3"
                      onClick={() => onEdit(item)}
                    />
                    <MdDelete
                      className="text-xl md:text-2xl text-errorColor cursor-pointer hover:text-red-600"
                      onClick={() => onDelete(item?.categoryId)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
