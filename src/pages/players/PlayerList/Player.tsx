import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { PageTitle } from "../../../components/PageTitle";
import { PlayerStats } from "../../../components/PlayerStats";
import { StatsApi } from "../../../api";
import { IPlayerDetails } from "../../../api/types";

export const Player: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();

  const { data, isLoading } = useQuery<IPlayerDetails>(
    ["players-recent-thirty", playerId],
    () => StatsApi.Players.ById(playerId)
  );

  return (
    <>
      <PageTitle>{data?.realname ? data.realname : "Player"}</PageTitle>
      {isLoading && <Loading />}
      {data && <PlayerStats data={data} />}
    </>
  );
};
