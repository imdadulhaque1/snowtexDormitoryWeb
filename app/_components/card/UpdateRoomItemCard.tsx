"use client";

import AppURL from "@/app/_restApi/AppURL";
import { roomDetailsInterface } from "@/interface/admin/roomManagements/roomDetailsInterface";
import axios from "axios";
import React, { FC, useEffect, useRef, useState } from "react";
import TableHeader from "../inputField/table/TableHeader";
import ComView from "../comView/ComView";
import Checkbox from "../inputField/checkbox/Checkbox";
import ComInputView from "../inputField/ComInputView";
import { MdOutlineDelete } from "react-icons/md";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  paidItems?: any;
  freeItems?: any;
  token?: string;
  userId: string | number;
  onPassItems?: (res: any) => void;
}

const UpdateRoomItemCard: FC<Props> = ({
  className,
  paidItems,
  freeItems,
  token,
  userId,
  onPassItems,
}) => {
  const actualItems = paidItems.concat(freeItems);
  const initialized = useRef(false);
  const [checkRoomItems, setCheckRoomItems] = useState<number[]>([]);
  const [prevItems, setPrevItems] = useState<any>({
    paidItems: [],
    freeItems: [],
  });

  const [fetchData, setFetchData] = useState<{
    roomItems: roomDetailsInterface[];
  }>({
    roomItems: [],
  });

  const availableRoomItemsFunc = async () => {
    try {
      const { data } = await axios.get(`${AppURL.paidItemApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        const convertedRoomItem = data?.data.map((item: any) => ({
          ...item,
          itemQty: 1,
          actualPrice: item?.price,
        }));
        setFetchData((prev) => ({ ...prev, roomItems: convertedRoomItem }));
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

  useEffect(() => {
    if (!initialized.current) {
      setPrevItems({ paidItems: [...paidItems], freeItems: [...freeItems] });
      initialized.current = true;
    }
  }, [paidItems, freeItems]);

  const handleCheckboxChange = (rItem: any, riIndex: number) => {
    setCheckRoomItems((prev: any) => {
      const isChecked = prev.some((item: any) => item.itemId === rItem.itemId);

      return isChecked
        ? prev.filter((item: any) => item.itemId !== rItem.itemId)
        : [...prev, rItem, riIndex];
    });
    setPrevItems((prev: any) => {
      const isPaid = rItem?.paidOrFree === 1;

      const key = isPaid ? "paidItems" : "freeItems";

      const itemExists = prev[key].some(
        (item: any) => item?.riIndex === riIndex
      );

      return {
        ...prev,
        [key]: itemExists
          ? prev[key].filter((item: any) => item.riIndex !== riIndex)
          : [...prev[key], { ...rItem, riIndex }],
      };
    });
  };

  const totalPaidItemAmount =
    prevItems?.paidItems &&
    prevItems?.paidItems.length > 0 &&
    prevItems?.paidItems.reduce(
      (sum: any, item: any) => sum + Number(item.price),
      0
    );

  const totalFreeItemAmount =
    prevItems?.freeItems &&
    prevItems?.freeItems.length > 0 &&
    prevItems?.freeItems.reduce(
      (sum: any, item: any) => sum + Number(item.price),
      0
    );

  const noOfPaidItems =
    prevItems?.paidItems &&
    prevItems?.paidItems.length > 0 &&
    prevItems?.paidItems.reduce(
      (sum: any, item: any) => sum + Number(item.itemQty),
      0
    );

  const noOfFreeItems =
    prevItems?.freeItems &&
    prevItems?.freeItems.length > 0 &&
    prevItems?.freeItems.reduce(
      (sum: any, item: any) => sum + Number(item.itemQty),
      0
    );

  const handlePaidQtyChange = async (index: number, newQty: number) => {
    setPrevItems((prev: any) => {
      const updatedPaidItems = [...prev.paidItems];
      updatedPaidItems[index] = {
        ...updatedPaidItems[index],
        itemQty: newQty,
        price: Number(updatedPaidItems[index].actualPrice) * newQty,
      };
      return { ...prev, paidItems: updatedPaidItems };
    });

    if (newQty < 1) return toast.error("Do you want to delete this item ?");
  };

  // Handle item removal (by index)
  const handlePaidItemRemove = (index: number) => {
    setPrevItems((prev: any) => {
      const updatedPaidItems = prev.paidItems.filter(
        (_: any, i: any) => i !== index
      );
      return { ...prev, paidItems: updatedPaidItems };
    });
    toast.error("Item removed successfully !");
  };

  const handleFreeQtyChange = async (index: number, newQty: number) => {
    setPrevItems((prev: any) => {
      const updatedFreeItems = [...prev.freeItems];
      updatedFreeItems[index] = {
        ...updatedFreeItems[index],
        itemQty: newQty,
        price: Number(updatedFreeItems[index].actualPrice) * newQty,
      };
      return { ...prev, freeItems: updatedFreeItems };
    });

    if (newQty < 1) return toast.error("Do you want to delete this item ?");
  };

  const handleFreeItemRemove = (index: number) => {
    setPrevItems((prev: any) => {
      const updatedFreeItems = prev.freeItems.filter(
        (_: any, i: any) => i !== index
      );
      return { ...prev, freeItems: updatedFreeItems };
    });
    toast.error("Item removed successfully !");
  };

  useEffect(() => {
    const passingItems = {
      paidItems: prevItems?.paidItems,
      freeItems: prevItems?.freeItems,
      totalPaidItemAmount,
      totalFreeItemAmount,
    };
    if (onPassItems) {
      onPassItems(passingItems);
    }
  }, [prevItems?.paidItems, prevItems?.freeItems]);

  return (
    <div
      className={`rounded-lg bg-white shadow-lg shadow-slate-400 ${className} `}
    >
      <p className="font-workSans text-xl text-black text-center mb-4 font-medium">
        Available Room Items
      </p>
      <div className="flex w-full items-center rounded-t-lg bg-slate-300">
        <TableHeader
          headerText="Select"
          containerClassName="w-1/12"
          hasSearch={false}
        />
        <TableHeader
          headerText="Item Name"
          containerClassName="w-2/5 border-x-2 border-slate-50"
          hasSearch={false}
        />
        <TableHeader
          headerText="Price"
          containerClassName="w-1/5"
          hasSearch={false}
        />
        <TableHeader
          headerText="Paid / Free"
          containerClassName="w-1/5 border-x-2 border-slate-50"
          hasSearch={false}
        />
        <TableHeader
          headerText="Item Qty"
          containerClassName="w-1/6"
          hasSearch={false}
        />
      </div>
      <div className="w-full max-h-[250px] overflow-y-auto">
        {fetchData?.roomItems &&
          fetchData?.roomItems.map((roomItem: any, roomItemIndex: number) => {
            const isLast = roomItemIndex == fetchData?.roomItems?.length - 1;
            const isChecked = checkRoomItems.some(
              (r: any) => r.itemId === roomItem.itemId
            );
            const selectedRowBg = isChecked ? "bg-slate-200" : "bg-slate-100";

            const txtColor =
              roomItem.paidOrFree === 1 ? "text-black" : "text-gray-500";
            return (
              <div
                key={roomItemIndex}
                className={`flex w-full items-center  border border-slate-300 ${
                  isLast && "rounded-b-md"
                } ${selectedRowBg}`}
              >
                <div className="w-1/12 flex justify-center py-1">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => {
                      handleCheckboxChange(roomItem, roomItemIndex);
                    }}
                  />
                </div>

                <ComView
                  value={roomItem.name}
                  className={`w-2/5 border-x-2 ${txtColor}`}
                />
                <ComView
                  value={roomItem.price}
                  className={`w-1/5  ${txtColor} `}
                />
                <ComView
                  value={roomItem.paidOrFree === 1 ? "Paid" : "Free"}
                  className={`w-1/5 border-x-2 ${txtColor}`}
                />
                <ComView
                  value={roomItem?.itemQty}
                  className={`w-1/6 ${txtColor}`}
                />
              </div>
            );
          })}
      </div>

      <div className=" w-full flex justify-center items-start my-4 p-4 ">
        <div className="flex flex-col items-center w-[50%] border-2 border-slate-300 rounded-lg bg-white shadow-lg p-3 mr-3">
          <p className="text-black font-workSans text-md text-center font-medium">
            Paid items
          </p>
          <div className="flex w-full items-center rounded-t-lg bg-slate-200 mt-2  ">
            <TableHeader
              headerText="SL"
              containerClassName="w-[10%]"
              hasSearch={false}
            />
            <TableHeader
              headerText="Item Name"
              containerClassName="w-[43%] border-x-2 border-slate-50"
              hasSearch={false}
            />
            <TableHeader
              headerText="Price"
              containerClassName="  w-[15%]"
              hasSearch={false}
            />
            <TableHeader
              headerText="Qty"
              containerClassName="w-[20%] border-x-2 border-slate-50"
              hasSearch={false}
            />
            <TableHeader
              headerText="Action"
              containerClassName="w-[12%]"
              hasSearch={false}
            />
          </div>

          {prevItems?.paidItems && prevItems?.paidItems.length > 0 ? (
            prevItems?.paidItems?.map((pItem: any, pIndex: number) => {
              const isLast = pIndex == prevItems?.paidItems.length - 1;

              return (
                <div
                  key={pIndex}
                  className={`flex w-full items-center  border border-slate-300 ${
                    isLast && "rounded-b-md"
                  } `}
                >
                  <ComView
                    value={pIndex + 1}
                    className={`w-[10%] border-x-2 text-black`}
                  />
                  <ComView
                    value={pItem.name}
                    className={`w-[43%] border-r-2 text-black `}
                  />
                  <ComView
                    value={pItem.price}
                    className={`w-[15%]  text-black`}
                  />
                  <div className="flex w-[20%] border-x-2 px-3 py-1">
                    <ComInputView
                      placeholder="Qty"
                      className="w-full py-1 text-center border-2 border-slate-300 rounded-md"
                      type="number"
                      name="itemQty"
                      // @ts-ignore
                      value={pItem?.itemQty?.toString()}
                      onChange={(e: any) =>
                        handlePaidQtyChange(pIndex, Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center w-[12%]">
                    <MdOutlineDelete
                      onClick={() => {
                        handlePaidItemRemove(pIndex);
                      }}
                      size={25}
                      className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="font-workSans text-sm text-errorColor my-2">
              No paid items founds !
            </p>
          )}
          {prevItems?.paidItems && prevItems?.paidItems.length > 0 && (
            <div className="flex w-full items-end justify-end ">
              <ComView
                value={totalPaidItemAmount}
                className={`w-[15%] text-black font-medium`}
              />
              <ComView
                value={noOfPaidItems}
                className={`w-[20%] text-black font-medium`}
              />
              <div className="w-[12%]" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-[50%]  border-2 border-slate-300 rounded-lg bg-white shadow-lg p-3">
          <p className="text-black font-workSans text-md text-center font-medium">
            Free items
          </p>
          <div className="flex w-full items-center rounded-t-lg bg-slate-200 mt-2">
            <TableHeader
              headerText="SL"
              containerClassName="w-[10%]"
              hasSearch={false}
            />
            <TableHeader
              headerText="Item Name"
              containerClassName="w-[43%] border-x-2 border-slate-50"
              hasSearch={false}
            />
            <TableHeader
              headerText="Price"
              containerClassName=" w-[15%]"
              hasSearch={false}
            />
            <TableHeader
              headerText="Qty"
              containerClassName="w-[20%] border-x-2 border-slate-50"
              hasSearch={false}
            />
            <TableHeader
              headerText="Action"
              containerClassName="w-[12%]"
              hasSearch={false}
            />
          </div>
          {prevItems?.freeItems && prevItems?.freeItems.length > 0 ? (
            prevItems?.freeItems?.map((fItem: any, fIndex: number) => {
              const isLast = fIndex == prevItems?.freeItems.length - 1;
              return (
                <div
                  key={fIndex}
                  className={`flex w-full items-center  border border-slate-300 ${
                    isLast && "rounded-b-md"
                  } `}
                >
                  <ComView
                    value={fIndex + 1}
                    className={`w-[10%] text-black`}
                  />
                  <ComView
                    value={fItem.name}
                    className={`w-[43%] border-x-2 text-black `}
                  />
                  <ComView
                    value={fItem.price}
                    className={`w-[15%] text-black`}
                  />
                  <div className="flex w-[20%] border-x-2 px-3 py-1">
                    <ComInputView
                      placeholder="Qty"
                      className="w-full py-1 text-center border-2 border-slate-300 rounded-md"
                      type="number"
                      name="itemQty"
                      // @ts-ignore
                      value={fItem?.itemQty?.toString()}
                      onChange={(e: any) =>
                        handleFreeQtyChange(fIndex, Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center w-[12%]">
                    <MdOutlineDelete
                      onClick={() => {
                        handleFreeItemRemove(fIndex);
                      }}
                      size={25}
                      className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="font-workSans text-sm text-errorColor my-2">
              No free items founds !
            </p>
          )}
          {prevItems?.freeItems && prevItems?.freeItems.length > 0 && (
            <div className="flex w-full items-end justify-end ">
              <ComView
                value={totalFreeItemAmount}
                className={`w-[15%]  text-black font-medium`}
              />
              <ComView
                value={noOfFreeItems}
                className={`w-[20%] text-black font-medium`}
              />
              <div className="w-[12%]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateRoomItemCard;
