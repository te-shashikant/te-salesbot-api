const GetResponseMessage: Record<number, string> = {
  200: "Success!",
  202: "Login details are incorrect!",
  203: "Email is not registered yet!",
  204: "Account is not active!",
  205: "Email or phone already exists!",
  206: "Duplicate value not allowed!",
  207: "Old password is wrong!",
  208: "Company is not active!",
  209: "Company user count exceeded!",
  210: "DSR can only be added for today or yesterday!",
  211: "DSR can be published only once per day!",
  400: "Bad Request!",
  401: "Unauthorized!",
  404: "Not Found",
  408: "Exception occured!",
  500: "Internal server error!",
};

type Status = {
  response_code: number;
  response_message: string;
};

type StatusResponseType = {
  status: Status;
};

function StatusResponse(Code: number): StatusResponseType {
  return {
    status: {
      response_code: Code,
      response_message: GetResponseMessage[Code] || "Unknown Code",
    },
  };
}

function ObjectResponse<T>(
  Code: number,
  Object: T,
  ObjectName: string
): StatusResponseType & Record<typeof ObjectName, T> {
  return {
    status: {
      response_code: Code,
      response_message: GetResponseMessage[Code] || "Unknown Code",
    },
    [ObjectName]: Object,
  } as StatusResponseType & Record<typeof ObjectName, T>;
}

// Optional: DynamicResponse example
function DynamicResponse(
  Code: number,
  Objects: Record<string, unknown>
): StatusResponseType & Record<string, unknown> {
  return {
    status: {
      response_code: Code,
      response_message: GetResponseMessage[Code] || "Unknown Code",
    },
    ...Objects,
  };
}

// Export them
export { StatusResponse, ObjectResponse, DynamicResponse, StatusResponseType };
