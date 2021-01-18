import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

/** By default, Next.JS render the js files on its own component. What we are doing here is building a custom app component
 * Component = e.g banana.js | index.js
 * pageProps = the set of components that we are intending to pass to either banana.js or index.js
 * Why doing this? Because that's the only way to import global css (e.g bootstrap)
 */

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div className="container">
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get("/api/users/currentuser");

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    console.log(pageProps);

    return {
        pageProps,
        //currentUser: data.currentUser is the same as ...data
        ...data,
    };
};

export default AppComponent;
