import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    handleRedirect(status, session, router);
  }, [status, session, router]);

  function isProtectedRoute(route) {
    return router.pathname === route;
  }

  function redirectTo(destination) {
    router.push(destination);
  }

  function handleRedirect(status, session, router) {
    if (status === "unauthenticated") {
      redirectTo("/");
    } else if (status === "authenticated") {
      const role = session?.user.role;
      if (role === "Supervisor" && (isProtectedRoute("/usermanagement"))) {
        redirectTo("/qcreport");
      } else if (role === "Operator" && (isProtectedRoute("/setting") || isProtectedRoute("/usermanagement") || isProtectedRoute("/masterdata"))) {
        redirectTo("/qcreport");
      }
    }
  }

  return session ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
