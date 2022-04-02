import { dedupExchange, fetchExchange, gql, stringifyVariables } from "urql";
import { cacheExchange, Resolver,Cache } from "@urql/exchange-graphcache";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
  CreateCommentMutation,
  CommentsQuery,
  CommentsDocument,
  useCommentsQuery,
  CreateCommentMutationVariables,
  DeleteCommentMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';
import { devtoolsExchange } from "@urql/devtools";
import { isServer } from "./isServer";

export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error?.message.includes("not authenticated")) {
        Router.replace('/login');
        
      }
    })
  );
};


export type MergeMode = 'before' | 'after';

export interface PaginationParams {
  cursorArgument?: string;
}

const commentResolver = () : Resolver =>{
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    console.log("all fileds",allFields);
    return undefined;
  }
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(cache.resolveFieldByKey(entityKey, fieldKey) as string,"posts");
    info.partial = !isItInTheCache;
    //console.log("cache",isItInTheCache);
    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key,"posts") as string[];
      const _hasMore  = cache.resolve(key,"hasMore");
      if(!_hasMore)
      {
        hasMore = _hasMore as boolean;
      }
      //console.log("Data",hasMore,data);
      results.push(...data);
    });

    return {
    __typename : "PaginatedPosts",
    hasMore,
    posts : results
    }
    ;
  };
};

function invalidateAllPosts(cache : Cache){
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  fieldInfos.forEach((fi)=>{
    cache.invalidate('Query','posts',fi.arguments || {});
  })}

function invalidateAllComments(cache : Cache){
    const allFields = cache.inspectFields("Query");
    console.log("allfieldinfos",allFields)
    const fieldInfos = allFields.filter((info) => info.fieldName === "comments");
    console.log("fieldinfos",fieldInfos)
    fieldInfos.forEach((fi)=>{
      cache.invalidate('Query','comments',fi.arguments || {});
    })
  }


export const createUrqlClient = (ssrExchange: any,ctx:any) =>{
  let cookie = ''

  if(isServer())
  {
      cookie = ctx.req.headers.cookie;
  }

  return({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
    headers : cookie ? {
      cookie
  } : undefined,
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      resolvers: {
        keys  :{
          PaginatedPosts : ()=> null,
          },
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          comment: (result, _args, cache, _info) => {
            console.log("this ran")
            const {postId} = _args as CreateCommentMutationVariables;
            const Comment = gql`
              {
                comments(postId : ${postId.toString()}) {
                  id
                  text
                postId
                creatorId
                creator
                {
                  id
                  username
                }
                }
              }
            `;
            cache.updateQuery({ query: Comment }, data => {
              console.log(result)
              data.comments.unshift(result)
              return data;
            });
          },
          deletePost : (_result, args, cache, info) => {
                cache.invalidate({
              __typename : "Post",
              id : (args as DeletePostMutationVariables).id
            })
           },
           deleteComment : (_result, args, cache, info) => {
            cache.invalidate({
              __typename : "Comment",
              id : (args as DeleteCommentMutationVariables).id
            })
          },
          vote: (_result, args, cache, info) => {
            const { postId, value } = args as VoteMutationVariables;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                  voteStatus
                }
              `,
              { id: postId } as any
            );

            if (data) {
              if (data.voteStatus === value) {
                return;
              }
              const newPoints =
                (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
              cache.writeFragment(
                gql`
                  fragment __ on Post {
                    points
                    voteStatus
                  }
                `,
                { id: postId, points: newPoints, voteStatus: value } as any
              );
            }
          },
          
          createPost : (_result, args, cache, info) => {
            invalidateAllPosts(cache);
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
            invalidateAllPosts(cache);
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
}