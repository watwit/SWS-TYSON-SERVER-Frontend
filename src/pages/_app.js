import "@/styles/globals.css";
import Layout from "@/components/layout";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import PropTypes from "prop-types";
import { AlertProvider } from "@/contexts/alertContext";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const isHomePage = router.pathname === `/`;

  return (
    <SessionProvider session={session}>
        <AlertProvider>
          <ThemeProvider theme={theme}>
            {isHomePage ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </ThemeProvider>
        </AlertProvider>
    </SessionProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
