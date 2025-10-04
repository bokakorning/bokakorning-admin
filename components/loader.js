import Backdrop from "@mui/material/Backdrop";

const Loader = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "rgba(0,0,0,0.7)",
      }}
      open={open}
    >
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-[#4EB0CF] rounded-full animate-bounce"></span>
        <span className="w-4 h-4 bg-[#4EB0CF] rounded-full animate-bounce delay-200"></span>
        <span className="w-3 h-3 bg-[#4EB0CF] rounded-full animate-bounce delay-400"></span>
      </div>
    </Backdrop>
  );
};

export default Loader;
