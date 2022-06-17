import "../styles/globals.css";
import Header from "../components/Header";
import PageHead from "../components/PageHead";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gray-900 min-h-screen">
      <PageHead title={pageProps.title} />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}

export default MyApp;
