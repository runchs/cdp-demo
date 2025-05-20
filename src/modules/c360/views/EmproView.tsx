import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const EmproTab: React.FC = () => {
  const location = useLocation();
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = "https://emprodev-auth.aeonth.com/auth/realms/empro/protocol/openid-connect/auth";

    if (location.pathname === "/c360") {
      const searchParams = location.search;
      const fullUrl = `${baseUrl}${searchParams}`;
      setIframeSrc(fullUrl);
    } else {
      setIframeSrc(baseUrl);
    }
  }, [location]);

  return (
    <>
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          title="empro"
          style={{ height: "calc(100vh - 67px)", width: "100%" }}
        />
      )}
    </>
  );
};

export default EmproTab;
