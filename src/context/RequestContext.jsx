import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getLeaveRequests } from "../api/serviceapi";

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requestCount, setRequestCount] = useState(0);

  const fetchRequestCount = useCallback(async () => {
    try {
      const response = await getLeaveRequests("");

      setRequestCount(response?.data?.data?.totalRecords || 0);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchRequestCount();
  }, [fetchRequestCount]);

  return (
    <RequestContext.Provider
      value={{
        requestCount,
        setRequestCount,
        fetchRequestCount,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  return useContext(RequestContext);
};
