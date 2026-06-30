import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getAttendanceCorrectionRequests } from "../api/serviceapi";

const CorrectionContext = createContext();

export const CorrectionProvider = ({ children }) => {
  const [correctionCount, setCorrectionCount] = useState(0);

const fetchCorrectionCount = useCallback(async () => {
  try {
    const response = await getAttendanceCorrectionRequests();

    setCorrectionCount(response?.data?.data?.statusCount || 0);
  } catch (error) {
    console.log(error);
  }
}, []);

useEffect(() => {
  fetchCorrectionCount();
}, [fetchCorrectionCount]);

  return (
    <CorrectionContext.Provider
      value={{
        correctionCount,
        setCorrectionCount,
        fetchCorrectionCount,
      }}
    >
      {children}
    </CorrectionContext.Provider>
  );
};

export const useCorrection = () => {
  return useContext(CorrectionContext);
};
