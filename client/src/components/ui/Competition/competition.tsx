import React from "react";

import { Button } from "../button";

function Competition() {
  return (
    <>
      <h1 className="text-center">Past Questions and Solutions</h1>
      <div className="flex flex-col items-center gap-5">
        <Button className="h-[66px] w-[998px] rounded-[5px] border-[1.5px] border-black bg-[#FFE8A3] text-[22px]">
          Competition Name (e.g 2024)
        </Button>
        <Button>Competition Name (e.g 2024)</Button>
        <Button>Competition Name (e.g 2024)</Button>
      </div>
      <h1 className="text-center">Practice Test</h1>
      <div className="flex flex-col items-center gap-4">
        <Button>Practice Test Name (e.g.WAJO Practice Test A)</Button>
        <Button>Practice Test Name (e.g.WAJO Practice Test A)</Button>
      </div>
    </>
  );
}

export default Competition;
