import GuildListElement, {
  GuildListElementProps,
} from "@components/GuildListElement";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "./GuildList.module.scss";
import { useEffect, useState } from "react";

// TODO: Response Type
type getGuildsResponse = Array<{
  name: string;
  icon: string;
  banner: string;
}>;

const GuildList = () => {
  const [guilds, setGuilds] = useState<GuildListElementProps[]>([]);

  // TODO: Send connected user information when auth is added.
  const { data, isSuccess, error } = useQuery<getGuildsResponse, Error>({
    queryKey: ["messages", "1"],
    queryFn: async () => {
      const response = await axios.get<[]>(`http://localhost:4000/user/guilds`);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const guilds: GuildListElementProps[] = data.map((guild) => ({
        image: guild.icon,
        tooltip: guild.name,
      }));

      setGuilds(guilds);
    }
  }, [isSuccess, data]);

  if (error) return <p>Error loading guilds: {error.message}</p>;

  return (
    <div className={styles.ListContainer}>
      {guilds.map((guild, index) => (
        <GuildListElement
          key={`guild-${index}`}
          image={`${guild.image}`}
          tooltip={`${guild.tooltip}`}
        />
      ))}
    </div>
  );
};

export default GuildList;
