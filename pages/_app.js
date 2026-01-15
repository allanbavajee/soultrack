// pages/_app.js
import "../styles/globals.css";
import { MembersProvider } from "../context/MembersContext"; // chemin correct

function MyApp({ Component, pageProps }) {
  return (
    <MembersProvider>
      <Component {...pageProps} />
    </MembersProvider>
  );
}

export default MyApp;
