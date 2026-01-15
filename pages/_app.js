// _app.js
import "../styles/globals.css";
import { MembersProvider } from "../context/MembersContext"; // ⚠️ Assure-toi que le chemin est correct

function MyApp({ Component, pageProps }) {
  return (
    <MembersProvider>
      <Component {...pageProps} />
    </MembersProvider>
  );
}

export default MyApp;
