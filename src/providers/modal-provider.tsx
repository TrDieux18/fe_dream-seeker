import { useModal } from "@/hooks/use-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const { isModalOpen } = useModal();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) return null;

  
};

export default ModalProvider;
