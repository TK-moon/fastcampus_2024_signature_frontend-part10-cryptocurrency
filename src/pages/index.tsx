import {
  DEFAULT_SORT,
  getCurrencyListQueryOptions,
  getTickerListQueryOptions,
  HomeMain,
} from "@/domains/home";
import { getQueryClient } from "@/utils";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  UseQueryOptions,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { ComponentProps, FC } from "react";

interface Props extends ComponentProps<typeof HomeMain> {
  dehydrated_state: DehydratedState;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const query_client = getQueryClient();

  const query_option_list: UseQueryOptions<any, Error>[] = [
    getTickerListQueryOptions({ sort_by: DEFAULT_SORT }),
    getCurrencyListQueryOptions(),
  ];

  await Promise.all(
    query_option_list.map((query_options) => {
      return query_client.prefetchQuery(query_options);
    })
  );

  const dehydrated_state = dehydrate(query_client);

  return {
    props: {
      dehydrated_state,
    },
  };
};

const Home: FC<Props> = (props) => {
  return (
    <HydrationBoundary state={props.dehydrated_state}>
      <HomeMain />
    </HydrationBoundary>
  );
};

export default Home;
