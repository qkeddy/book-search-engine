import { gql } from "@apollo/client";

export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`;

// export const QUERY_SINGLE_PROFILE = gql`
//     query me {
//         users {
//             _id
//             username
//             email
//             savedBooks {
//                 bookId
//                 authors
//                 description
//                 image
//                 link
//                 title
//             }
//         }
//     }
// `;
