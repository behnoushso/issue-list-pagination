import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client"
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
// import { createHttpLink } from 'apollo-link-http'
import {setContext} from '@apollo/client/link/context';
// import Cookies from 'js-cookie'

// const client = new ApolloClient({
//     link: new HttpLink({
//         uri: "https://github.com/reactjs/reactjs.org/issues",
//         credentials: 'include',
//         headers: {'X-CSRF-Token': 'VZu/HQVPvcdj1zQRowoCto4+1m/QfrScxZclh5X9WFusw7X3wBIfIXcnMFfQw/md/G8QqQiWuoe7X27NUXsTMQ=='},}),
//         cache: new InMemoryCache(),
//     })

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
        Authorization: `Bearer ${
            process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
        }`,
    },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    }

    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

const link: any = ApolloLink.from([errorLink, httpLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache,
});

// const httpLink = createHttpLink({ uri: 'https://github.com/reactjs/reactjs.org/issues' })

// const authLink = setContext((_, { headers }) => {
//     // get the authentication token from local storage if it exists
//     // const token = Cookies.get('token')
//     // return the headers to the context so httpLink can read them
//     return {
//         headers: {
//             ...headers,
//             authorization: "pdUyTPQ1%2FY%2BoFj80vQ%2BPjQ%2FSChfsyQStmPRCC8%2B9RvkobDQz3q9D2Gu2%2F3wolIKg1KMz%2Ff%2BitX%2Bp1CVoxQRJUY0UGKjS2cIfCaxzneOPhwA2Ry5OsPqHGxJtCwshpVXe%2FyU88co6PTG02RbbmJhTBCoryDek3abuM6d88%2FYwpM0%3D--YmNyF0toETcmqrKV--9JYDBQTjfgQ14M0agzk1KA%3D%3D",
//         }
//     }
// });

// const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache()
// })

    ReactDOM.render(
        <ApolloProvider client={client}>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </ApolloProvider>,
        document.getElementById('root')
    );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
