import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ComponentProps, FC, MouseEventHandler } from "react";
import { api_removeTicker, api_saveTicker } from "../api";
import { SAVED_TICKER_LIST_KEY } from "..";
import star_filled from "./star_filled.svg";
import star_outlined from "./star_outlined.svg";
import Image from "next/image";

interface Props extends ComponentProps<"button"> {
  ticker: string;
  is_saved: boolean;
}

const SaveButton: FC<Props> = (props) => {
  const { ticker, is_saved, onClick, ...rest } = props;

  const query_client = useQueryClient();

  const handleSuccess = () => {
    query_client.invalidateQueries({ queryKey: SAVED_TICKER_LIST_KEY });
  };

  const handleError = (error: Error) => {
    console.error(error);
    alert("저장에 실패했습니다.");
  };

  const { mutate: save } = useMutation({
    mutationFn: async () => api_saveTicker(ticker),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const { mutate: remove } = useMutation({
    mutationFn: async () => api_removeTicker(ticker),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    is_saved ? remove() : save();
    onClick?.(event);
  };

  return (
    <button onClick={handleClick} {...rest}>
      <Image
        src={is_saved ? star_filled : star_outlined}
        alt={is_saved ? "저장됨" : "저장안됨"}
      />
    </button>
  );
};

export { SaveButton };
