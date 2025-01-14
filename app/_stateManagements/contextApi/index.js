"use client";
import React, { useState, useContext, useCallback } from "react";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [getLoginInfo, setGetLoginInfo] = useState(null);
  const [getToken, setGetToken] = useState(null);
  const [getCountry, setGetCountry] = useState(null);
  const [getDivision, setGetDivision] = useState(null);
  const [getDistrict, setGetDistrict] = useState(null);
  const [menuReload, setMenuReload] = useState(false);
  const [getDrawerStatus, setGetDrawerStatus] = useState(false);

  const setLoginInfo = useCallback(
    (value) => {
      setGetLoginInfo(value);
    },
    [getLoginInfo]
  );
  const setToken = useCallback(
    (value) => {
      setGetToken(value);
    },
    [getToken]
  );
  const setCountry = useCallback(
    (value) => {
      setGetCountry(value);
    },
    [getCountry]
  );
  const setDivision = useCallback(
    (value) => {
      setGetDivision(value);
    },
    [getDivision]
  );
  const setDistrict = useCallback(
    (value) => {
      setGetDistrict(value);
    },
    [getDistrict]
  );
  const setIsMenuReload = useCallback(
    (value) => {
      setMenuReload(value);
    },
    [menuReload]
  );
  const setDrawerStatus = useCallback(
    (value) => {
      setGetDrawerStatus(value);
    },
    [getDrawerStatus]
  );

  return (
    <AppContext.Provider
      value={{
        setLoginInfo,
        getLoginInfo,
        setToken,
        getToken,
        setCountry,
        getCountry,
        setDivision,
        getDivision,
        setDistrict,
        getDistrict,
        menuReload,
        setIsMenuReload,
        getDrawerStatus,
        setDrawerStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
