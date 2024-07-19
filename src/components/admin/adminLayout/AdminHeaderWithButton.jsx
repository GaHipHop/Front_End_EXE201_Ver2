import React from "react";
import { Span } from "@nextui-org/react";

const AdminHeaderWithButtons = () => {
  return (
    <div className="flex gap-5 justify-between self-center px-5 w-full max-w-[1072px] max-md:flex-wrap max-md:max-w-full">
      <div>
        <Span auto flat>
          Add Transaction
        </Span>
        <Button auto flat>
          Transactions
        </Button>
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/179e0622cea34c2612198e7cb92e0aecaa2ca707bd71783d9ecdec9aa40f4c23?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
        className="shrink-0 shadow-sm aspect-square w-[68px]"
        alt="User Avatar"
      />
    </div>
  );
};

export default AdminHeaderWithButtons;
