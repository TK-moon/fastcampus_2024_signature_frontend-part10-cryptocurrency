import { INTERVAL_LIST } from "@/api/cryptocurrency/chart/types";
import { CryptoCurrencyDetailMain, Interval } from "@/domains/home/detail";
import { GetServerSideProps } from "next";
import { ComponentProps, FC } from "react";

interface Props extends ComponentProps<typeof CryptoCurrencyDetailMain> {}

type Params = { ticker: string };

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const ticker = context.params?.ticker;
  const interval_for_initialize = context.query.interval as
    | Interval
    | undefined;

  if (!ticker) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ticker,
      interval_for_initialize: interval_for_initialize ?? INTERVAL_LIST[0],
    },
  };
};

const CryptoCurrencyDetailPage: FC<Props> = (props) => {
  return <CryptoCurrencyDetailMain {...props} />;
};

export default CryptoCurrencyDetailPage;
