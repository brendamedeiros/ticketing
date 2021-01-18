/** Why use axios instead of use-request hook
 * Hooks are used inside of React Component
 * getInitialProps isn't a component. It's a plain function
 */
import buildClient from "../api/build-client";

/** Browser/client request */
const LandingPage = ({ currentUser }) => {
    return currentUser ? (
        <h1>You are signed in</h1>
    ) : (
        <h1>You are not signed in</h1>
    );
};

/** getInitialProps is specific to Next.js and Next is going to call it whil is attempting to render our app on the server
 * It's an attempt to fetch some data that this component needs during this server side rendering process and it will be
 * executed on the server
 *
 * Server request
 *
 * If you not specify a domain, the Node HTTP layer is going to assume that you're trying to make request on your local machine
 * so the Node's HTTP layer is going to automatically stick a domain on there, possibly 'localhost' (127.0.0.1:80)
 */
LandingPage.getInitialProps = async (context) => {
    console.log("LANDING PAGE");
    const client = buildClient(context);
    const { data } = await client.get("/api/users/currentuser");
    return data;
};

export default LandingPage;
