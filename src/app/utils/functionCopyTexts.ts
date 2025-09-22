import toast from "react-hot-toast";

export const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copiato negli appunti!");
  });
};
