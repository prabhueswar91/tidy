"use client";

import Image from "next/image";
import Dot from "../assets/dot.svg";

export default function ApprovalStatus({
  showApprove,
}: {
  showApprove: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 text-[#FFFEEF]">
      
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-4 h-4 relative">
          <Image src={Dot} alt="dot" fill style={{ objectFit: "contain" }} />
        </div>

        <h3 className="text-xl font-semibold">
          Application Submitted
        </h3>
      </div>

      {showApprove?<p className="text-sm font-light max-w-md">
        Experience the TidyZen moment and 
        earn exciting rewards! 
      </p>:
      <p className="text-sm font-light max-w-md">
        Thank you for applying!  
        we are processing your application.  
      </p>}

    </div>
  );
}
// "use client";

// import Image from "next/image";
// import Dot from "../assets/dot.svg";

// export default function ApprovalStatus({
//   showApprove,
// }: {
//   showApprove: boolean;
// }) {
//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex items-center justify-center gap-2">
//         <div className="w-4 h-4 relative">
//           <Image src={Dot} alt="dot" fill style={{ objectFit: "contain" }} />
//         </div>

//         <h3 className="text-xl font-semibold text-[#FFFEEF]">
//           {showApprove ? "Approved" : "Pending"}
//         </h3>
//       </div>

//       <p className="text-sm font-light text-[#FFFEEF] mt-6 text-center">
//         {showApprove
//           ? "Experience the TidyZen moment and earn exciting rewards!"
//           : "Thank you for your application, we will be in touch via your telegram to complete your setup."}
//       </p>
//     </div>
//   );
// }
