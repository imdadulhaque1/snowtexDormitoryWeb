import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import TableHeader from "../inputField/table/TableHeader";
import { roomDetailsInterface } from "@/interface/admin/roomManagements/roomDetailsInterface";
import AppURL from "@/app/_restApi/AppURL";
import Checkbox from "../inputField/checkbox/Checkbox";

interface Props {
  className?: string;
  token: string;
  userId: any;
  onPassItems?: (itemRes: any) => void;
}

const AvailableRoomItemCard: FC<Props> = ({
  className,
  token,
  userId,
  onPassItems,
}) => {
  const [fetchData, setFetchData] = useState<{
    roomItems: roomDetailsInterface[];
  }>({
    roomItems: [],
  });
  const [searchKey, setSearchKey] = useState<{
    name: string;
    price: string;
    paidOrFree: string;
  }>({
    name: "",
    price: "",
    paidOrFree: "",
  });
  const [checkRoomItems, setCheckRoomItems] = useState<number[]>([]); // Store selected room IDs

  const availableRoomItemsFunc = async () => {
    try {
      const { data } = await axios.get(`${AppURL.paidItemApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setFetchData((prev) => ({ ...prev, roomItems: data?.data }));
      }
    } catch (err: any) {
      console.log("Failed to fetch room items: ", err?.message);
    }
  };

  useEffect(() => {
    if (token) {
      availableRoomItemsFunc();
    }
  }, [token]);

  const handleInputChange = (key: string, value: string) => {
    setSearchKey((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (rItem: any) => {
    setCheckRoomItems((prev: any) => {
      const isChecked = prev.some((item: any) => item.itemId === rItem.itemId);

      return isChecked
        ? prev.filter((item: any) => item.itemId !== rItem.itemId)
        : [...prev, rItem];
    });
  };

  // ✅ Filter logic based on search inputs
  const filteredRoomData = fetchData.roomItems.filter((roomItem) =>
    ["name", "price", "paidOrFree"].every((key) =>
      String(roomItem[key as keyof typeof roomItem])
        .toLowerCase()
        .includes(searchKey[key as keyof typeof searchKey].toLowerCase())
    )
  );

  const paidItems =
    checkRoomItems && checkRoomItems?.length > 0
      ? checkRoomItems?.filter(
          (paidItem) => parseInt(paidItem?.paidOrFree) == 1
        )
      : [];
  const freeItems =
    checkRoomItems && checkRoomItems?.length > 0
      ? checkRoomItems?.filter(
          (paidItem) => parseInt(paidItem?.paidOrFree) == 2
        )
      : [];

  const totalPaidItemAmount =
    paidItems &&
    paidItems.length > 0 &&
    paidItems.reduce((sum: any, item: any) => sum + Number(item.price), 0);

  const totalFreeItemAmount =
    freeItems &&
    freeItems.length > 0 &&
    freeItems.reduce((sum: any, item: any) => sum + Number(item.price), 0);

  useEffect(() => {
    const passingItems = {
      paidItems,
      freeItems,
      totalPaidItemAmount,
      totalFreeItemAmount,
    };
    if (onPassItems) {
      onPassItems(passingItems);
    }
  }, [paidItems, freeItems, totalPaidItemAmount, totalFreeItemAmount]);

  return (
    <>
      <div
        className={`rounded-lg bg-white shadow-lg shadow-slate-400 ${className}`}
      >
        <p className="text-xl text-black text-center mb-4">
          Available Room Service Items
        </p>
        <div className="flex w-full items-center rounded-t-lg bg-slate-300">
          <TableHeader
            headerText="Select"
            containerClassName="w-1/5"
            hasSearch={false}
          />
          <TableHeader
            headerText="Item Name"
            placeholder="Search by item name"
            containerClassName="w-2/5 border-x-2 border-slate-50"
            hasSearch={true}
            apiOnSearch={false}
            value={searchKey.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onClear={() => setSearchKey((prev) => ({ ...prev, name: "" }))}
          />
          <TableHeader
            headerText="Price"
            placeholder="Search by price"
            containerClassName="w-1/5"
            hasSearch={true}
            apiOnSearch={false}
            value={searchKey.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            onClear={() => setSearchKey((prev) => ({ ...prev, price: "" }))}
          />
          <TableHeader
            headerText="Paid(1) / Free(2)"
            placeholder="Search by Paid or Free"
            containerClassName="w-1/5 border-l-2 border-slate-50"
            hasSearch={true}
            apiOnSearch={false}
            value={searchKey.paidOrFree}
            onChange={(e) => handleInputChange("paidOrFree", e.target.value)}
            onClear={() =>
              setSearchKey((prev) => ({ ...prev, paidOrFree: "" }))
            }
          />
        </div>

        <div className="w-full max-h-[200px] overflow-y-auto">
          {filteredRoomData.map((roomItem: any, roomIndex: number) => {
            const isLast = roomIndex == filteredRoomData?.length - 1;
            const isChecked = checkRoomItems.some(
              (r: any) => r.itemId === roomItem.itemId
            );
            const selectedRowBg = isChecked ? "bg-slate-200" : "bg-slate-100";

            const txtColor =
              roomItem.paidOrFree === 1 ? "text-black" : "text-gray-500";
            return (
              <div
                key={roomItem.itemId}
                className={`flex w-full items-center  border border-slate-300 ${
                  isLast && "rounded-b-md"
                } ${selectedRowBg}`}
              >
                <div className="w-1/5 flex justify-center py-1">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(roomItem)}
                  />
                </div>

                <ComView
                  value={roomItem.name}
                  className={`w-2/5 border-x-2 ${txtColor}`}
                />
                <ComView
                  value={roomItem.price}
                  className={`w-1/5 border-r-2 ${txtColor} `}
                />
                <ComView
                  value={roomItem.paidOrFree === 1 ? "Paid" : "Free"}
                  className={`w-1/5 ${txtColor}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {checkRoomItems && checkRoomItems?.length > 0 && (
        <div className="flex justify-center items-start">
          <div className="flex flex-col items-center w-[48%] rounded-lg bg-white shadow-lg p-3 mr-3">
            <p className="font-workSans text-md text-center font-medium">
              Paid items
            </p>
            <div className="flex w-full items-center rounded-t-lg bg-slate-200 mt-2">
              <TableHeader
                headerText="SL"
                containerClassName="w-1/6"
                hasSearch={false}
              />
              <TableHeader
                headerText="Item Name"
                containerClassName="w-1/2 border-x-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Price"
                containerClassName="w-1/3"
                hasSearch={false}
              />
            </div>
            {paidItems && paidItems.length > 0 ? (
              paidItems?.map((pItem: any, pIndex: number) => {
                const isLast = pIndex == paidItems.length - 1;

                return (
                  <div
                    className={`flex w-full items-center  border border-slate-300 ${
                      isLast && "rounded-b-md"
                    } `}
                  >
                    <ComView
                      value={pIndex + 1}
                      className={`w-1/6 border-x-2 text-black`}
                    />
                    <ComView
                      value={pItem.name}
                      className={`w-1/2 border-r-2 text-black `}
                    />
                    <ComView
                      value={pItem.price}
                      className={`w-1/3 text-black`}
                    />
                  </div>
                );
              })
            ) : (
              <p className="font-workSans text-sm text-errorColor my-2">
                No paid items founds !
              </p>
            )}
            {paidItems && paidItems.length > 0 && (
              <div className="flex w-full items-end justify-end">
                <div className="flex w-1/3 items-center justify-center py-1">
                  <p className="font-workSans text-black text-md font-medium">
                    {`Total: ${totalPaidItemAmount}`}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center w-[48%] rounded-lg bg-white shadow-lg p-3 mr-3">
            <p className="font-workSans text-md text-center font-medium">
              Free items
            </p>
            <div className="flex w-full items-center rounded-t-lg bg-slate-200 mt-2">
              <TableHeader
                headerText="SL"
                containerClassName="w-1/6 "
                hasSearch={false}
              />
              <TableHeader
                headerText="Item Name"
                containerClassName="w-1/2 border-x-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Price"
                containerClassName="w-1/3"
                hasSearch={false}
              />
            </div>
            {freeItems && freeItems.length > 0 ? (
              freeItems?.map((fItem: any, fIndex: number) => {
                const isLast = fIndex == freeItems.length - 1;
                return (
                  <div
                    className={`flex w-full items-center  border border-slate-300 ${
                      isLast && "rounded-b-md"
                    } `}
                  >
                    <ComView
                      value={fIndex + 1}
                      className={`w-1/6 border-x-2 text-black`}
                    />
                    <ComView
                      value={fItem.name}
                      className={`w-1/2 border-r-2 text-black `}
                    />
                    <ComView
                      value={fItem.price}
                      className={`w-1/3 text-black`}
                    />
                  </div>
                );
              })
            ) : (
              <p className="font-workSans text-sm text-errorColor my-2">
                No free items founds !
              </p>
            )}
            {freeItems && freeItems.length > 0 && (
              <div className="flex w-full items-end justify-end">
                <div className="flex w-1/3 items-center justify-center py-1">
                  <p className="font-workSans text-black text-md font-medium">
                    {`Total: ${totalFreeItemAmount}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AvailableRoomItemCard;

interface ComViewProps {
  value?: any;
  className?: string;
}

const ComView: FC<ComViewProps> = ({ value, className }) => {
  return (
    <div
      className={`flex items-center justify-center border-slate-300 ${className}`}
    >
      <p className="text-sm font-workSans text-center break-words max-w-full">
        {value}
      </p>
    </div>
  );
};
