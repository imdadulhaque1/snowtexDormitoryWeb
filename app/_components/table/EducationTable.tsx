import { EducationTableInterface } from "../../../../interface/admin/education/EducationTableInterface";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface TableProps {
  data: EducationTableInterface[];
  onEdit: (obj: any) => void;
  onDelete: (id: string | number) => void;
}

const EducationTable: React.FC<TableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-1/12 px-4 py-2 border">SL</th>
            <th className="w-1/12 px-4 py-2 border">ID</th>
            <th className="w-2/12 px-4 py-2 border">Label</th>
            <th className="w-2/12 px-4 py-2 border">Name</th>
            <th className="w-1/12 px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-200`}
            >
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-center">
                {item.educationId}
              </td>
              <td className="px-4 py-2 border text-center">
                {item.educationLabel}
              </td>
              <td className="px-4 py-2 border text-center">
                {item.degreeName}
              </td>
              <td className=" flex items-center justify-center px-4 py-2 border text-center">
                <FaEdit
                  className="text-xl md:text-2xl text-primary75 cursor-pointer hover:text-primary50 mr-3"
                  onClick={() => onEdit(item)}
                />
                <MdDelete
                  className="text-xl md:text-2xl text-errorColor cursor-pointer hover:text-red-600"
                  onClick={() => onDelete(item?.educationId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EducationTable;
